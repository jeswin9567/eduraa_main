const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true,
  },
  teacherEmail: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  endtime: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false, // Initially false; will be updated when the class starts
  }
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
