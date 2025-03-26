const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  days: [{
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  }
});

const teacherTimetableSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  timeSlots: [timeSlotSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TeacherTimetable', teacherTimetableSchema); 