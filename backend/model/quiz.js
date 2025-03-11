const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    mockTestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'MockTest'
    },
    answers: {
        type: Map,
        of: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true,
        set: v => v.trim().toLowerCase()
    },
    title: {
        type: String,
        required: true,
        set: v => v.trim().toLowerCase()
    },
    description: {
        type: String,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentageScore: {
        type: Number,
        required: true
    },
    attempts: {
        type: Number,
        default: 1
    },
    weakArea: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    explanations: [{
        type: String,
        required: false
    }],
    generatedBy: {
        type: String,
        enum: ['manual', 'ai'],
        default: 'manual'
    },
    difficultyLevel: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        required: false
    }
}, { timestamps: true });

// Static method to find weak areas for a student
quizAnswerSchema.statics.findWeakAreas = async function(email) {
    console.log('Finding weak areas for email:', email);
    
    const results = await this.aggregate([
        { $match: { email: email } },
        { $group: {
            _id: { 
                subject: "$subject", 
                title: "$title",
                description: "$description"
            },
            totalScore: { $sum: "$score" },
            totalPossibleMarks: { $sum: "$totalMarks" },
            attempts: { $max: "$attempts" }  // Get the maximum attempts value
        }},
        { $project: {
            _id: 0,
            subject: "$_id.subject",
            title: "$_id.title",
            description: "$_id.description",
            averageScore: {
                $multiply: [
                    { $divide: ["$totalScore", "$totalPossibleMarks"] },
                    100
                ]
            },
            attempts: { 
                $cond: { 
                    if: { $lt: ["$attempts", 1] }, 
                    then: 1, 
                    else: "$attempts" 
                }
            }
        }},
        { $sort: { averageScore: 1 } }
    ]);
    
    console.log('Aggregation results:', results);
    return results;
};

// Pre-save middleware to calculate percentage score
quizAnswerSchema.pre('save', function(next) {
    if (this.score && this.totalMarks) {
        this.percentageScore = (this.score / this.totalMarks) * 100;
    }
    if (!this.attempts || this.attempts < 1) {
        this.attempts = 1;
    }
    if (this.subject) {
        this.subject = this.subject.trim().toLowerCase();
    }
    if (this.title) {
        this.title = this.title.trim().toLowerCase();
    }
    next();
});

const QuizAnswer = mongoose.model('QuizAnswer', quizAnswerSchema);

module.exports = QuizAnswer;
