// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  mockTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest', // Reference the MockTest model if you have it
    required: true,
  },
  entranceExamName: {
    type: String,
    required: true,
  },
  mockTestName: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
