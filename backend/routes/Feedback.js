// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');

router.post('/feedback', async (req, res) => {
  const { email, mockTestId, feedback, entranceExamName, mockTestName } = req.body;

  try {
    // Validate required fields
    if (!email || !mockTestId || !feedback) {
        return res.status(400).json({ error: 'Email, MockTestId, and feedback are required' });
      }
      

    // Create a new feedback entry with the additional fields
    const newFeedback = new Feedback({
      email,
      mockTestId,
      entranceExamName,
      mockTestName,
      feedback,
    });

    // Save feedback to the database
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

//get feedback

router.get('/vfeedback', async (req, res) => {
    try {
      const feedbackEntries = await Feedback.find({});
      res.json(feedbackEntries);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ message: 'Failed to fetch feedback' });
    }
  });
  

module.exports = router;
