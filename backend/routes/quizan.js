const express = require('express');
const router = express.Router();
const QuizAnswer = require('../model/quiz'); // Adjust the path based on your directory structure

// POST /quiz/saveAnswers
// POST /quiz/saveAnswers
router.post('/saveAnswers', async (req, res) => {
    const { email, mockTestId, answers, score, subject, title, description } = req.body;

    if (!email || !mockTestId || !answers || score === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newQuizAnswer = new QuizAnswer({
            email,
            mockTestId,
            answers,
            score,
            subject,
            title,
            description
        });

        await newQuizAnswer.save();
        return res.status(201).json({ message: 'Answers saved successfully.', newQuizAnswer });
    } catch (error) {
        console.error('Error saving answers:', error);
        return res.status(500).json({ message: 'Error saving answers.', error });
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




module.exports = router;
