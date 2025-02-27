const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  teacherEmail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reminder: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Reminder', reminderSchema); 