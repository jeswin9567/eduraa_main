const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    mockTestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'MockTest' // Assuming you have a MockTest model
    },
    answers: {
        type: Map,
        of: Number, // Assuming answers are stored as question index: answer index
        required: true,
    },  
    score: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const QuizAnswer = mongoose.model('QuizAnswer', quizAnswerSchema);

module.exports = QuizAnswer;
