const express = require('express');
const router = express.Router();
const Course = require('../model/courses');
const MockTest = require('../model/Mocktest');
const Scholarship = require('../model/scholarship');
const StudentLoan = require('../model/StudentLoan');
const Entrance = require('../model/Entrance');
const User = require('../model/User');
const Teacher = require('../model/Teacher');

router.get('/search', async (req, res) => {
    try {
        const { query, userEmail } = req.query;

        // Get user's assigned teacher
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get teacher's email from assigned teacher ID
        const teacher = await Teacher.findById(user.assignedTeacher);
        const teacherEmail = teacher ? teacher.email : null;

        // Create search regex
        const searchRegex = new RegExp(query, 'i');

        // Parallel search across all models
        const [courses, mockTests, scholarships, loans, entrances] = await Promise.all([
            // Search courses with teacher email condition
            Course.find({
                teacherEmail: teacherEmail,
                $or: [
                    { topic: searchRegex },
                    { subTopic: searchRegex }
                ]
            }),

            // Search mock tests with teacher email condition
            MockTest.find({
                email: teacherEmail,
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            }),

            // Search scholarships
            Scholarship.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex }
                ]
            }),

            // Search student loans
            StudentLoan.find({
                $or: [
                    { loanName: searchRegex },
                    { bankName: searchRegex }
                ]
            }),

            // Search entrance exams
            Entrance.find({
                $or: [
                    { name: searchRegex },
                    { details: searchRegex }
                ]
            })
        ]);

        res.json({
            courses,
            mockTests,
            scholarships,
            loans,
            entrances
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error performing search' });
    }
});

module.exports = router; 