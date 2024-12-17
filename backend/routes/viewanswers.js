// In your backend route file (e.g., quizRoutes.js)
const express = require('express');
const router = express.Router();
const MockTest = require('../model/Mocktest');
const QuizAnswer = require('../model/quiz');

// Route to get user's answers, correct answers, and steps
router.get('/quiz/viewSteps/:mockTestId', async (req, res) => {
    const { mockTestId } = req.params;
    const { email } = req.query;

    try {
        const mockTest = await MockTest.findById(mockTestId);
        const userAnswers = await QuizAnswer.findOne({ mockTestId, email });

        if (!mockTest || !userAnswers) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const results = mockTest.questions.map((question, index) => {
            const userAnswerIndex = userAnswers.answers.get(index.toString());
            const correctAnswerIndex = question.options.findIndex(option => option.isCorrect);
            return {
                questionText: question.questionText,
                userAnswer: question.options[userAnswerIndex]?.optionText || 'Not Attempted',
                correctAnswer: question.options[correctAnswerIndex].optionText,
                steps: question.steps,
            };
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching view steps data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
