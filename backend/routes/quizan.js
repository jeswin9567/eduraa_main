const express = require('express');
const router = express.Router();
const QuizAnswer = require('../model/quiz'); // Adjust the path based on your directory structure
const MockTest = require('../model/Mocktest'); // Add this import
const User = require('../model/User');
const { updatePerformanceCSV } = require('../utils/generateSampleCSV'); // Add this import
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const pdf = require('pdf-parse');
const Class = require('../model/courses');
const AIMockTest = require('../model/AIMockTest');
const natural = require('natural');
const pos = require('pos');
const nlp = require('compromise');
const winkNLP = require('wink-nlp');
const math = require('mathjs');

// POST /quiz/saveAnswers
// POST /quiz/saveAnswers
router.post('/saveAnswers', async (req, res) => {
    try {
        const { 
            email, 
            mockTestId, 
            answers, 
            score, 
            totalMarks,
            subject,
            title,    // This might need normalization
            description,
            totalQuestions,
            percentageScore,
            generatedBy  // Add this to destructuring
        } = req.body;

        const normalizedTitle = title.trim().toLowerCase();
        const normalizedSubject = subject.trim().toLowerCase();

        // Check if this is an AI-generated quiz
        const isAIQuiz = description.includes('AI Generated Test');
        let finalDescription = description;

        if (isAIQuiz) {
            const nextNumber = await getNextAIQuizNumber(normalizedSubject, normalizedTitle);
            finalDescription = `AI Generated Quiz #${nextNumber} on ${title}`;
        }

        console.log('Received quiz data:', req.body); // Debug log

        // Validate required fields
        if (!email || !mockTestId || !answers || score === undefined || totalMarks === undefined) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { email, mockTestId, answers, score, totalMarks }
            });
        }

        // Check if user has already attempted this quiz
        const existingAttempt = await QuizAnswer.findOne({ email, mockTestId });

        if (existingAttempt) {
            // Update existing attempt
            existingAttempt.answers = answers;
            existingAttempt.score = score;
            existingAttempt.totalMarks = totalMarks;
            existingAttempt.percentageScore = percentageScore;
            existingAttempt.attempts += 1;
            existingAttempt.title = normalizedTitle;  // Use normalized title
            existingAttempt.description = finalDescription;  // Use the numbered description
            existingAttempt.generatedBy = generatedBy || 'manual';  // Add this line

            const savedQuiz = await existingAttempt.save();
            console.log('Updated existing quiz:', savedQuiz);

            // Update CSV file after updating existing quiz
            await updatePerformanceCSV({
                email: savedQuiz.email,
                subject: savedQuiz.subject,
                topic: savedQuiz.title,
                description: savedQuiz.description,
                percentage: savedQuiz.percentageScore,
                attempts: savedQuiz.attempts,
                score: savedQuiz.score,
                totalMarks: savedQuiz.totalMarks
            });

            return res.status(200).json(savedQuiz);
        }

        // Create new quiz answer with normalized title
        const quizAnswer = new QuizAnswer({
            email,
            mockTestId,
            answers,
            score,
            totalMarks,
            subject: normalizedSubject,
            title: normalizedTitle,  // Use normalized title
            description: finalDescription,  // Use the numbered description
            totalQuestions,
            percentageScore,
            attempts: 1,
            generatedBy: generatedBy || 'manual'  // Add this line
        });

        const savedQuiz = await quizAnswer.save();
        console.log('Saved new quiz:', savedQuiz);

        // Update CSV file after saving to database
        await updatePerformanceCSV({
            email: savedQuiz.email,
            subject: savedQuiz.subject,
            topic: savedQuiz.title,
            description: savedQuiz.description,
            percentage: savedQuiz.percentageScore,
            attempts: savedQuiz.attempts,
            score: savedQuiz.score,
            totalMarks: savedQuiz.totalMarks
        });

        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ 
            message: "Failed to save quiz results",
            error: error.message 
        });
    }
});


// Add this in your routes file
router.get('/results/:mockTestId', async (req, res) => {
    const { mockTestId } = req.params;
    const email = req.query.email; // Get email from query parameter

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const quizResult = await QuizAnswer.findOne({ email, mockTestId });
        if (!quizResult) {
            return res.status(404).json({ message: 'No results found for this quiz.' });
        }
        return res.status(200).json(quizResult);
    } catch (error) {
        console.error('Error fetching results:', error);
        return res.status(500).json({ message: 'Error fetching results.', error });
    }
});

// Add this in your routes file
router.delete('/deleteAnswers', async (req, res) => {
    const { email, mockTestId } = req.body;

    if (!email || !mockTestId) {
        return res.status(400).json({ message: 'Email and mockTestId are required.' });
    }

    try {
        const result = await QuizAnswer.findOneAndDelete({ email, mockTestId });

        if (!result) {
            return res.status(404).json({ message: 'No results found to delete.' });
        }

        return res.status(200).json({ message: 'Answers deleted successfully.' });
    } catch (error) {
        console.error('Error deleting answers:', error);
        return res.status(500).json({ message: 'Error deleting answers.', error });
    }
});

// Modify the weak areas route
router.get("/weak-areas/:email", async (req, res) => {
    try {
        const { email } = req.params;

        // Get the user with populated assigned teachers
        const user = await User.findOne({ email }).populate('assignedTeacher');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get teacher emails from assigned teachers
        const teacherEmails = user.assignedTeacher.map(teacher => teacher.email);

        // Get all quiz answers for this user
        const quizAnswers = await QuizAnswer.find({ email });

        // Get mock tests only from assigned teachers
        const mockTests = await MockTest.find({
            email: { $in: teacherEmails }
        });

        // Group mock tests by title
        const mockTestsByTitle = mockTests.reduce((acc, test) => {
            if (!acc[test.title]) {
                acc[test.title] = [];
            }
            acc[test.title].push(test);
            return acc;
        }, {});

        // Process quiz answers and combine with mock test data
        const processedData = Object.entries(mockTestsByTitle).map(([title, tests]) => {
            // Find answers for this title
            const relevantAnswers = quizAnswers.filter(answer => 
                tests.some(test => test._id.toString() === answer.mockTestId.toString())
            );

            const totalAttempted = relevantAnswers.length;
            const totalAvailable = tests.length;

            // Calculate total score and marks only for attempted tests
            const totalScore = relevantAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);
            const totalPossibleMarks = relevantAnswers.reduce((sum, answer) => sum + (answer.totalMarks || 0), 0);

            // Calculate percentage based on attempted tests only
            const percentage = totalAttempted > 0 
                ? (totalScore / totalPossibleMarks) * 100 
                : 0;

            return {
                subject: tests[0].subject,
                title: title,
                description: tests[0].description,
                totalScore,
                totalMarks: totalPossibleMarks,
                attempts: totalAttempted,
                totalQuizzes: totalAvailable,
                averageScore: percentage,
                teacherName: tests[0].teacherName // Include teacher name if needed
            };
        });

        res.json(processedData);
    } catch (error) {
        console.error('Error in weak-areas:', error);
        res.status(500).json({ message: "Error fetching weak areas" });
    }
});

// Add this new route for updating answers
router.put('/updateAnswers/:mockTestId', async (req, res) => {
    const { mockTestId } = req.params;
    const { 
        email, 
        answers, 
        score, 
        totalMarks, 
        isRetry,
        percentageScore,
        subject,
        title,
        description,
        totalQuestions
    } = req.body;

    if (!email || !mockTestId) {
        return res.status(400).json({ message: 'Email and mockTestId are required.' });
    }

    try {
        // Find the existing quiz answer
        const existingQuiz = await QuizAnswer.findOne({ email, mockTestId });
        
        if (!existingQuiz) {
            return res.status(404).json({ message: 'No quiz found to update.' });
        }

        // Update all fields
        existingQuiz.answers = answers;
        existingQuiz.score = score;
        existingQuiz.totalMarks = totalMarks;
        existingQuiz.percentageScore = percentageScore;
        existingQuiz.subject = subject;
        existingQuiz.title = title;
        existingQuiz.description = description;
        existingQuiz.totalQuestions = totalQuestions;
        
        // Increment attempts if it's a retry
        if (isRetry) {
            existingQuiz.attempts = (existingQuiz.attempts || 1) + 1;
        }

        const updatedQuiz = await existingQuiz.save();
        console.log('Updated quiz:', updatedQuiz);

        // Update CSV file after updating existing quiz
        await updatePerformanceCSV({
            email: updatedQuiz.email,
            subject: updatedQuiz.subject,
            topic: updatedQuiz.title,
            description: updatedQuiz.description,
            percentage: updatedQuiz.percentageScore,
            attempts: updatedQuiz.attempts,
            score: updatedQuiz.score,
            totalMarks: updatedQuiz.totalMarks
        });

        return res.status(200).json({
            message: 'Quiz answers updated successfully.',
            updatedQuiz
        });
    } catch (error) {
        console.error('Error updating answers:', error);
        return res.status(500).json({ 
            message: 'Error updating answers.',
            error: error.message 
        });
    }
});

// Route to increment attempts counter
router.put('/incrementAttempts/:mockTestId', async (req, res) => {
    const { mockTestId } = req.params;
    const { email } = req.body;

    try {
        const existingQuiz = await QuizAnswer.findOne({ email, mockTestId });
        
        if (!existingQuiz) {
            return res.status(404).json({ message: 'No quiz found to update.' });
        }

        // Get current attempts and increment by 1
        const currentAttempts = existingQuiz.attempts || 1;
        existingQuiz.attempts = currentAttempts + 1;
        
        console.log('Previous attempts:', currentAttempts);
        console.log('New attempts:', existingQuiz.attempts);

        await existingQuiz.save();

        return res.status(200).json({
            message: 'Attempts incremented successfully',
            attempts: existingQuiz.attempts
        });
    } catch (error) {
        console.error('Error incrementing attempts:', error);
        return res.status(500).json({ 
            message: 'Error updating attempts',
            error: error.message 
        });
    }
});

// Route to update quiz attempt with new answers and score
router.put('/updateQuizAttempt/:mockTestId', async (req, res) => {
    const { mockTestId } = req.params;
    const { 
        email, 
        answers, 
        score, 
        totalMarks,
        percentageScore
    } = req.body;

    try {
        const existingQuiz = await QuizAnswer.findOne({ email, mockTestId });
        
        if (!existingQuiz) {
            return res.status(404).json({ message: 'No quiz found to update.' });
        }

        // Update quiz data without changing attempts
        existingQuiz.answers = answers;
        existingQuiz.score = score;
        existingQuiz.totalMarks = totalMarks;
        existingQuiz.percentageScore = percentageScore;

        const updatedQuiz = await existingQuiz.save();

        return res.status(200).json({
            message: 'Quiz updated successfully',
            updatedQuiz
        });
    } catch (error) {
        console.error('Error updating quiz:', error);
        return res.status(500).json({ 
            message: 'Error updating quiz',
            error: error.message 
        });
    }
});

router.get("/student-progress/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;

    // Get all quiz answers for this student
    const quizAnswers = await QuizAnswer.aggregate([
      {
        $match: { email: studentEmail }
      },
      {
        // Group by title to combine related quizzes
        $group: {
          _id: {
            title: "$title",
            subject: "$subject",
            description: "$description"
          },
          totalScore: { $sum: "$score" },
          totalPossibleMarks: { $sum: "$totalMarks" },
          attempts: { $sum: 1 },
          lastAttemptDate: { $max: "$createdAt" },
          quizzes: {
            $push: {
              score: "$score",
              totalMarks: "$totalMarks",
              createdAt: "$createdAt"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: "$_id.title",
          subject: "$_id.subject",
          description: "$_id.description",
          totalScore: 1,
          totalPossibleMarks: 1,
          attempts: 1,
          lastAttemptDate: 1,
          percentageScore: {
            $multiply: [
              { $divide: ["$totalScore", "$totalPossibleMarks"] },
              100
            ]
          },
          quizzes: 1
        }
      },
      {
        $sort: { lastAttemptDate: -1 }
      }
    ]);

    res.json({ progress: quizAnswers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get performance data
router.get("/performance/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const results = [];
        
        const csvPath = path.join(__dirname, '../uploads/csv/performance.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.log('CSV file does not exist');
            return res.json([]);
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        if (!fileContent.trim()) {
            console.log('CSV file is empty');
            return res.json([]);
        }

        // Read and parse CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => {
                    if (data.email === email) {
                        results.push({
                            subject: data.subject,
                            topic: data.topic,
                            percentage: parseFloat(data.percentage)
                        });
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Group and calculate averages by subject and topic
        const groupedResults = results.reduce((acc, curr) => {
            const key = `${curr.subject}-${curr.topic}`;
            if (!acc[key]) {
                acc[key] = {
                    subject: curr.subject,
                    topic: curr.topic,
                    totalPercentage: curr.percentage,
                    count: 1,
                    averagePercentage: curr.percentage
                };
            } else {
                acc[key].totalPercentage += curr.percentage;
                acc[key].count += 1;
                acc[key].averagePercentage = acc[key].totalPercentage / acc[key].count;
            }
            return acc;
        }, {});

        const finalResults = Object.values(groupedResults).map(item => ({
            subject: item.subject,
            topic: item.topic,
            averagePercentage: parseFloat(item.averagePercentage.toFixed(2))
        }));

        console.log('Performance data found:', finalResults);
        res.json(finalResults);
    } catch (error) {
        console.error('Error in performance analysis:', error);
        res.status(500).json({ 
            message: "Error fetching performance data",
            error: error.message 
        });
    }
});

// Add ML-based performance analysis route
router.get("/performance-analysis/:email", async (req, res) => {
    try {
        const { email } = req.params;
        
        const quizAttempts = await QuizAnswer.find({ email });
        
        if (!quizAttempts || quizAttempts.length === 0) {
            return res.json({ 
                message: "No quiz attempts found",
                analysis: {
                    bySubject: {},
                    weakTopics: [],
                    recommendations: []
                }
            });
        }

        // Calculate topic averages first
        const allQuizzes = await QuizAnswer.find({});
        const topicAverages = {};
        
        // Calculate averages for all topics
        allQuizzes.forEach(quiz => {
            const key = `${quiz.subject}-${quiz.title}`.toLowerCase();
            if (!topicAverages[key]) {
                topicAverages[key] = {
                    totalScore: 0,
                    count: 0
                };
            }
            topicAverages[key].totalScore += quiz.percentageScore;
            topicAverages[key].count++;
        });

        // Normalize and group quizzes
        const groupedQuizzes = {};
        
        quizAttempts.forEach(quiz => {
            // Normalize the subject and title
            const normalizedSubject = quiz.subject.trim().toLowerCase();
            const normalizedTitle = quiz.title.trim().toLowerCase();
            const key = `${normalizedSubject}-${normalizedTitle}`;
            
            if (!groupedQuizzes[key]) {
                groupedQuizzes[key] = {
                    subject: quiz.subject,
                    topic: quiz.title,
                    descriptions: new Set(),
                    scores: [],
                    totalScore: 0,
                    attempts: 0
                };
            }
            
            groupedQuizzes[key].descriptions.add(quiz.description);
            groupedQuizzes[key].scores.push(quiz.percentageScore);
            groupedQuizzes[key].totalScore += quiz.percentageScore;
            groupedQuizzes[key].attempts += quiz.attempts;
        });

        // Prepare analysis object
        const analysis = {
            bySubject: {},
            weakTopics: [],
            recommendations: []
        };
        
        // Process grouped quizzes
        Object.values(groupedQuizzes).forEach(groupedQuiz => {
            const averageScore = groupedQuiz.totalScore / groupedQuiz.scores.length;
            const topicKey = `${groupedQuiz.subject}-${groupedQuiz.topic}`.toLowerCase();
            
            // Calculate topic average
            const topicAverage = topicAverages[topicKey] 
                ? topicAverages[topicKey].totalScore / topicAverages[topicKey].count 
                : 0;
            
            // Track subject performance
            if (!analysis.bySubject[groupedQuiz.subject]) {
                analysis.bySubject[groupedQuiz.subject] = {
                    overallScore: 0,
                    topicsCount: 0
                };
            }
            analysis.bySubject[groupedQuiz.subject].overallScore += averageScore;
            analysis.bySubject[groupedQuiz.subject].topicsCount++;
            
            // Check if this is a weak topic
            if (averageScore < 60 || averageScore < topicAverage) {
                analysis.weakTopics.push({
                    subject: groupedQuiz.subject,
                    topic: groupedQuiz.topic,
                    description: Array.from(groupedQuiz.descriptions).join(', '),
                    averageScore: averageScore,
                    topicAverage: topicAverage,
                    attempts: groupedQuiz.attempts
                });
                
                // Generate recommendations
                analysis.recommendations.push({
                    subject: groupedQuiz.subject,
                    topic: groupedQuiz.topic,
                    suggestions: [
                        averageScore < 40 ? 'This topic needs immediate attention' : 'More practice needed',
                        `Topic average is ${topicAverage.toFixed(1)}% - Focus on improvement`,
                        groupedQuiz.attempts < 3 ? 'Try more practice tests' : 'Review your previous attempts'
                    ]
                });
            }
        });
        
        // Calculate final subject averages
        Object.keys(analysis.bySubject).forEach(subject => {
            if (analysis.bySubject[subject].topicsCount > 0) {
                analysis.bySubject[subject].overallScore /= analysis.bySubject[subject].topicsCount;
            }
        });
        
        console.log('Analysis results:', analysis);
        res.json({ analysis });
    } catch (error) {
        console.error('Error in analysis:', error);
        res.status(500).json({ 
            message: "Error analyzing performance",
            error: error.message 
        });
    }
});

// Add this function to get user's average score for a topic
async function getUserTopicPerformance(email, subject, topic) {
    try {
        const attempts = await QuizAnswer.find({
            email,
            subject: subject.trim().toLowerCase(),
            title: topic.trim().toLowerCase()
        });

        if (attempts.length === 0) return 0;

        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.percentageScore, 0);
        return totalScore / attempts.length;
    } catch (error) {
        console.error('Error getting user performance:', error);
        return 0;
    }
}

// Modify the getUserPerformanceLevel function
async function getUserPerformanceLevel(email, subject, topic) {
    try {
        const quizzes = await QuizAnswer.find({
            email,
            subject: subject.trim().toLowerCase(),
            title: topic.trim().toLowerCase()
        });

        if (quizzes.length === 0) return 'basic';

        // Calculate average percentage
        const totalPercentage = quizzes.reduce((sum, quiz) => sum + quiz.percentageScore, 0);
        const averagePercentage = totalPercentage / quizzes.length;

        console.log('User average percentage:', averagePercentage); // Debug log

        // New thresholds:
        // 0-30%: basic
        // 31-50%: intermediate
        // Above 50%: advanced
        if (averagePercentage <= 30) return 'basic';
        if (averagePercentage <= 50) return 'intermediate';
        return 'advanced';

    } catch (error) {
        console.error('Error getting user performance:', error);
        return 'basic'; // Default to basic if there's an error
    }
}

// Modify the generate-ai-test route
router.post("/generate-ai-test", async (req, res) => {
    try {
        const { subject, topic, email } = req.body;
        
        // Get user's performance level
        const difficultyLevel = await getUserPerformanceLevel(email, subject, topic);
        console.log(`Generating ${difficultyLevel} level questions for ${subject} - ${topic}`);

        // Get existing quiz content to avoid duplicates
        const existingQuizzes = await QuizAnswer.find({
            email,
            subject: subject.trim().toLowerCase(),
            title: topic.trim().toLowerCase()
        });

        const questions = await generateQuizQuestions(subject, topic, difficultyLevel, existingQuizzes);

        // Get the next quiz number for this topic
        const nextNumber = await getNextQuizNumber(subject, topic);

        // Create and save the AI mock test
        const aiMockTest = new AIMockTest({
            topic: topic,
            subject: subject,
            questions,
            generatedFrom: 'AI Generated Content',
            description: `AI Generated Quiz #${nextNumber} for ${topic}`,
            teacherEmail: 'AI_GENERATED',
            difficultyLevel
        });

        await aiMockTest.save();
        return res.json({ mockTest: aiMockTest });

    } catch (error) {
        console.error('Error generating test:', error);
        res.status(500).json({ 
            message: "Failed to generate test",
            error: error.message 
        });
    }
});

async function generateQuizQuestions(subject, topic, difficulty, existingQuizzes) {
    const questions = [];
    const requiredQuestions = 10;
    
    // Get topic-specific content from your database
    const topicContent = await Class.findOne({
        subject: { $regex: new RegExp(subject, 'i') },
        topic: { $regex: new RegExp(topic, 'i') }
    });

    // Extract key concepts and terms
    const concepts = await extractTopicConcepts(topicContent, topic);
    
    // Generate unique questions based on difficulty
    while (questions.length < requiredQuestions) {
        let question;
        
        switch(difficulty) {
            case 'basic':
                question = generateBasicQuestion(concepts, topic);
                break;
            case 'intermediate':
                question = generateIntermediateQuestion(concepts, topic);
                break;
            case 'advanced':
                question = generateAdvancedQuestion(concepts, topic);
                break;
        }

        // Check if question is unique
        if (question && !isQuestionDuplicate(question, questions, existingQuizzes)) {
            questions.push(question);
        }
    }

    return questions;
}

function generateBasicQuestion(concepts, topic) {
    const questionTypes = [
        // Definition based
        (concept) => ({
            question: `What is ${concept} in ${topic}?`,
            options: generateOptions(concept, concepts),
            correctAnswer: 0,
            explanation: `Basic definition of ${concept} in ${topic}`
        }),
        // Identification
        (concept) => ({
            question: `Which of the following best describes ${concept}?`,
            options: generateOptions(concept, concepts),
            correctAnswer: 0,
            explanation: `Basic characteristics of ${concept}`
        })
    ];

    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    const questionGenerator = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    return questionGenerator(concept);
}

function generateIntermediateQuestion(concepts, topic) {
    const questionTypes = [
        // Relationship based
        (concept) => {
            const relatedConcept = getRelatedConcept(concept, concepts);
            return {
                question: `How does ${concept} relate to ${relatedConcept} in ${topic}?`,
                options: generateRelationshipOptions(concept, relatedConcept),
                correctAnswer: 0,
                explanation: `Relationship between ${concept} and ${relatedConcept}`
            };
        },
        // Application based
        (concept) => ({
            question: `In what situation would you apply ${concept}?`,
            options: generateApplicationOptions(concept),
            correctAnswer: 0,
            explanation: `Application of ${concept} in real scenarios`
        })
    ];

    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    const questionGenerator = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    return questionGenerator(concept);
}

function generateAdvancedQuestion(concepts, topic) {
    const questionTypes = [
        // Analysis based
        (concept) => ({
            question: `Analyze the impact of ${concept} on ${topic}. Which statement is most accurate?`,
            options: generateAnalysisOptions(concept, topic),
            correctAnswer: 0,
            explanation: `Detailed analysis of ${concept}'s impact`
        }),
        // Evaluation based
        (concept) => ({
            question: `Evaluate the effectiveness of ${concept} in ${topic}. Which conclusion is best supported?`,
            options: generateEvaluationOptions(concept),
            correctAnswer: 0,
            explanation: `Critical evaluation of ${concept}`
        })
    ];

    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    const questionGenerator = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    return questionGenerator(concept);
}

// Helper functions
function generateOptions(concept, concepts) {
    const otherConcepts = concepts.filter(c => c !== concept);
    const correctAnswer = `The correct definition of ${concept}`;
    const wrongAnswers = shuffleArray(otherConcepts)
        .slice(0, 3)
        .map(c => `Definition of ${c}`);
    
    // Put correct answer at index 0 and shuffle all options
    const options = [correctAnswer, ...wrongAnswers];
    return shuffleArray(options);
}

function isQuestionDuplicate(newQuestion, currentQuestions, existingQuizzes) {
    // Check current quiz questions
    const isDuplicateInCurrent = currentQuestions.some(q => 
        q.question === newQuestion.question
    );

    // Check previous quiz questions
    const isDuplicateInExisting = existingQuizzes.some(quiz =>
        quiz.questions.some(q => q.question === newQuestion.question)
    );

    return isDuplicateInCurrent || isDuplicateInExisting;
}

async function getNextQuizNumber(subject, topic) {
    const existingQuizzes = await AIMockTest.find({
        subject: subject.trim().toLowerCase(),
        topic: topic.trim().toLowerCase()
    });
    return existingQuizzes.length + 1;
}

// Add this function to extract concepts from topic content
async function extractTopicConcepts(topicContent, topic) {
    try {
        // If we have topic content from the database
        if (topicContent && topicContent.notes) {
            // Get text content from PDF
            const response = await axios({
                method: 'get',
                url: topicContent.notes,
                responseType: 'arraybuffer'
            });

            const data = await pdf(response.data);
            const text = data.text;

            // Use natural for text processing
            const tokenizer = new natural.WordTokenizer();
            const tokens = tokenizer.tokenize(text.toLowerCase());

            // Get topic-specific keywords
            const concepts = new Set();
            
            // For mathematics - sets and functions
            if (topic.toLowerCase().includes('sets')) {
                const setsConcepts = [
                    'union', 'intersection', 'subset', 'superset', 
                    'complement', 'difference', 'symmetric difference',
                    'empty set', 'universal set', 'power set',
                    'cartesian product', 'disjoint sets', 'equivalent sets'
                ];
                setsConcepts.forEach(concept => concepts.add(concept));
            }

            if (topic.toLowerCase().includes('functions')) {
                const functionsConcepts = [
                    'domain', 'range', 'codomain', 'one-to-one',
                    'onto', 'bijective', 'inverse function',
                    'composite function', 'identity function',
                    'linear function', 'quadratic function'
                ];
                functionsConcepts.forEach(concept => concepts.add(concept));
            }

            // Add any additional concepts found in the text
            tokens.forEach(token => {
                if (token.length > 3 && !token.match(/[0-9]/)) {
                    concepts.add(token);
                }
            });

            return Array.from(concepts);
        }

        // If no content found, return default concepts based on topic
        return getDefaultConcepts(topic);
    } catch (error) {
        console.error('Error extracting concepts:', error);
        return getDefaultConcepts(topic);
    }
}

// Helper function to get default concepts if no content is found
function getDefaultConcepts(topic) {
    const defaultConcepts = {
        'sets': [
            'union', 'intersection', 'subset', 'complement',
            'difference', 'empty set', 'universal set'
        ],
        'functions': [
            'domain', 'range', 'one-to-one', 'onto',
            'inverse', 'composite', 'linear function'
        ],
        'default': [
            'definition', 'example', 'property', 'application',
            'theorem', 'proof', 'solution'
        ]
    };

    if (topic.toLowerCase().includes('sets')) {
        return defaultConcepts.sets;
    }
    if (topic.toLowerCase().includes('functions')) {
        return defaultConcepts.functions;
    }
    return defaultConcepts.default;
}

// Add this helper function to get related concepts
function getRelatedConcept(concept, concepts) {
    // Remove the current concept from the list
    const otherConcepts = concepts.filter(c => c !== concept);
    // Return a random related concept
    return otherConcepts[Math.floor(Math.random() * otherConcepts.length)];
}

// Add these helper functions for generating options
function generateRelationshipOptions(concept, relatedConcept) {
    return [
        `They are directly related through ${concept}'s properties`,
        `They are inversely related`,
        `They have no relationship`,
        `They are the same concept`
    ];
}

function generateApplicationOptions(concept) {
    return [
        `When solving problems involving ${concept}`,
        `In theoretical situations only`,
        `Never in practical applications`,
        `Only in specific cases`
    ];
}

function generateAnalysisOptions(concept, topic) {
    return [
        `${concept} significantly impacts ${topic} through multiple aspects`,
        `${concept} has minimal impact on ${topic}`,
        `${concept} is unrelated to ${topic}`,
        `The impact cannot be determined`
    ];
}

function generateEvaluationOptions(concept) {
    return [
        `${concept} is highly effective in most situations`,
        `${concept} is only effective in specific cases`,
        `${concept} is rarely effective`,
        `${concept}'s effectiveness cannot be evaluated`
    ];
}

// Add this helper function for shuffling arrays
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Add this to track the correct answer index after shuffling
function generateQuestionWithTrackedAnswer(question, options, initialCorrectIndex = 0) {
    const shuffledOptions = shuffleArray([...options]);
    const newCorrectIndex = shuffledOptions.indexOf(options[initialCorrectIndex]);
    
    return {
        question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
        explanation: `The correct answer is: ${options[initialCorrectIndex]}`
    };
}

// Add this route to get AI mock test by ID
router.get("/ai-mocktest/:id", async (req, res) => {
    try {
        const mockTest = await AIMockTest.findById(req.params.id);
        
        if (!mockTest) {
            return res.status(404).json({ 
                message: "Test not found",
                error: "The requested mock test does not exist" 
            });
        }

        // Return the mock test data
        res.json({ 
            success: true,
            mockTest 
        });

    } catch (error) {
        console.error('Error fetching AI mock test:', error);
        res.status(500).json({ 
            message: "Error fetching test",
            error: error.message 
        });
    }
});

// Add this route to get all AI mock tests for a user
router.get("/ai-mocktests/:email", async (req, res) => {
    try {
        const mockTests = await AIMockTest.find({
            email: req.params.email
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            mockTests
        });

    } catch (error) {
        console.error('Error fetching AI mock tests:', error);
        res.status(500).json({
            message: "Error fetching tests",
            error: error.message
        });
    }
});

// Add this new route to get AI-generated quizzes
router.get('/ai-quizzes/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        // Find all quizzes generated by AI for this user
        const aiQuizzes = await QuizAnswer.find({ 
            email,
            generatedBy: 'ai'
        }).sort({ createdAt: -1 });

        res.json({ 
            success: true,
            quizzes: aiQuizzes 
        });

    } catch (error) {
        console.error('Error fetching AI quizzes:', error);
        res.status(500).json({ 
            message: "Error fetching AI quiz results",
            error: error.message 
        });
    }
});

// Add this new route to get quiz details
router.get('/quiz-details/:mockTestId', async (req, res) => {
    try {
        const { mockTestId } = req.params;
        
        const mockTest = await AIMockTest.findById(mockTestId);
        
        if (!mockTest) {
            return res.status(404).json({ 
                message: "Mock test not found" 
            });
        }

        res.json({ 
            success: true,
            mockTest
        });

    } catch (error) {
        console.error('Error fetching quiz details:', error);
        res.status(500).json({ 
            message: "Error fetching quiz details",
            error: error.message 
        });
    }
});

module.exports = router;
