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
  }
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
