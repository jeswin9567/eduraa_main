const express = require('express');
const router = express.Router();
const QuizAnswer = require('../model/quiz'); // Adjust the path based on your directory structure
const MockTest = require('../model/Mocktest'); // Add this import
const User = require('../model/User');
const { updatePerformanceCSV } = require('../utils/generateSampleCSV'); // Add this import
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

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
            title,
            description,
            totalQuestions,
            percentageScore 
        } = req.body;

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

        // Create new quiz answer
        const quizAnswer = new QuizAnswer({
            email,
            mockTestId,
            answers,
            score,
            totalMarks,
            subject,
            title,
            description,
            totalQuestions,
            percentageScore,
            attempts: 1
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
        const trainingData = [];
        
        // 1. Load training data from CSV
        const csvPath = path.join(__dirname, '../uploads/csv/performance.csv');
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => {
                    trainingData.push({
                        subject: data.subject,
                        topic: data.topic,
                        description: data.description,
                        percentage: parseFloat(data.percentage),
                        score: parseInt(data.score),
                        totalMarks: parseInt(data.totalMarks)
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // 2. Get user's quiz data and group by subject and topic
        const userQuizzes = await QuizAnswer.find({ email });
        const groupedQuizzes = userQuizzes.reduce((acc, quiz) => {
            const key = `${quiz.subject}-${quiz.title}`;
            if (!acc[key]) {
                acc[key] = {
                    subject: quiz.subject,
                    topic: quiz.title,
                    attempts: 0,
                    totalScore: 0,
                    descriptions: new Set(),
                    scores: []
                };
            }
            
            acc[key].attempts += quiz.attempts;
            acc[key].totalScore += quiz.percentageScore;
            acc[key].descriptions.add(quiz.description);
            acc[key].scores.push(quiz.percentageScore);
            
            return acc;
        }, {});

        // 3. Calculate topic averages from training data
        const topicAverages = trainingData.reduce((acc, data) => {
            const key = `${data.subject}-${data.topic}`;
            if (!acc[key]) {
                acc[key] = {
                    scores: [],
                    average: 0
                };
            }
            acc[key].scores.push(data.percentage);
            return acc;
        }, {});

        Object.keys(topicAverages).forEach(key => {
            const scores = topicAverages[key].scores;
            topicAverages[key].average = scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        // 4. Prepare analysis data
        const analysis = {
            bySubject: {},
            weakTopics: [],
            recommendations: []
        };

        // Process grouped quizzes
        Object.values(groupedQuizzes).forEach(groupedQuiz => {
            const averageScore = groupedQuiz.totalScore / groupedQuiz.scores.length;
            const topicKey = `${groupedQuiz.subject}-${groupedQuiz.topic}`;
            const topicAverage = topicAverages[topicKey]?.average || 0;

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

module.exports = router;
