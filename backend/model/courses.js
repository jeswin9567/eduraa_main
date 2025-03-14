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
  }],
  completedBy: [{
    studentEmail: {
      type: String,
      required: false
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: [{
    studentEmail: String,
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Add a virtual field for average rating
classSchema.virtual('averageRating').get(function() {
  if (this.feedback && this.feedback.length > 0) {
    const totalRating = this.feedback.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / this.feedback.length).toFixed(1);
  }
  return 0;
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
