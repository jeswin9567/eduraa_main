const mongoose = require('mongoose');

const aiMockTestSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }],
    generatedFrom: {
        type: String,  // URL of the notes PDF
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacherEmail: String,
    difficultyLevel: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default: 'basic'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('AIMockTest', aiMockTestSchema); 