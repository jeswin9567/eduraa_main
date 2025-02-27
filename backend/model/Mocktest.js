const mongoose = require('mongoose');

const MockTestSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrance',  // Reference to the Entrance exam
        required: true,
    },
    title: {
        type: String,
        required: true,
    },  
    description: {
        type: String,
        required:true,
    },
    duration: {
        type: Number,  // in minutes
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    numberOfQuestions: {
        type: Number,
        required: true,
    },
    questions: [{
        questionText: { 
            type: String,
            required: true,
        },
        questionImage: {  // Add this field
            type: String,
            required: false,
        },
        options: [{
            optionText: { 
                type: String,
                required: true,
            },
            isCorrect: { 
                type: Boolean,
                required: true,
            }
        }],
        marks: {
            type: Number,
            required: true,
        },
        steps: [{
            type: String,  // Add steps to each question
            required: true,
        }],
    }],
    passingMarks: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    teacherName: {
        type: String,
        default: false,
    },

    email: {
        type: String,
        default: false,
    },

    subject: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('MockTest', MockTestSchema);
