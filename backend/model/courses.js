const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  subTopic: {
    type: String,
    required: true,
  },
  notes: {
    type: String, // URL of the uploaded PDF file from Cloudinary
    required: true,
  },
  video: {
    type: String, // URL of the uploaded video file from Cloudinary
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  teacherEmail: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  teacherAssignedSub:{
    type:String,
    required:true,
  },
  captions: {
    type: String,
    required: false
  },
  words: [{
    text: String,
    start: Number,
    end: Number,
    confidence: Number
  }],
  chapters: [{
    start: Number,
    end: Number,
    summary: String,
    headline: String
  }]
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
