const express = require('express');
const router = express.Router();
const Class = require('../model/courses');
const Payment = require('../model/payment');
const Teacher = require('../model/Teacher');

// Get course analytics
router.get('/course-analytics', async (req, res) => {
    try {
        const Class = require('../model/courses');
        const Teacher = require('../model/Teacher');

        // Get all courses with their completion data
        const courses = await Class.find();
        
        // Get all teachers with their assigned students
        const teachers = await Teacher.find();
        
        // Create a map of teacher email to their assigned students count
        const teacherStudentMap = {};
        teachers.forEach(teacher => {
            teacherStudentMap[teacher.email] = teacher.assignedStudents ? teacher.assignedStudents.length : 0;
        });

        // Calculate completion rate for each course
        let totalCompletionRate = 0;
        let validCourseCount = 0;

        courses.forEach(course => {
            // Get assigned students count for this course's teacher
            const totalAssignedStudents = teacherStudentMap[course.teacherEmail] || 0;
            
            if (totalAssignedStudents > 0) {
                // Calculate completion rate for this course
                const courseCompletionRate = (course.completedBy.length / totalAssignedStudents) * 100;
                totalCompletionRate += courseCompletionRate;
                validCourseCount++;
            }
        });

        // Calculate average completion rate across all courses
        const averageCompletionRate = validCourseCount > 0 
            ? totalCompletionRate / validCourseCount 
            : 0;

        // Calculate average rating
        const coursesWithRatings = courses.filter(course => 
            course.feedback && course.feedback.length > 0
        );

        const averageRating = coursesWithRatings.length > 0
            ? coursesWithRatings.reduce((acc, course) => {
                const courseRating = course.feedback.reduce((sum, fb) => sum + fb.rating, 0) / course.feedback.length;
                return acc + courseRating;
            }, 0) / coursesWithRatings.length
            : 0;

        res.json({
            totalCourses: courses.length,
            courseStats: {
                completionRate: averageCompletionRate.toFixed(1),
                averageRating: averageRating.toFixed(1)
            }
        });

    } catch (error) {
        console.error('Course analytics error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch course analytics',
            details: error.message 
        });
    }
});

// Get financial analytics
router.get('/financial-analytics', async (req, res) => {
    try {
        const payments = await Payment.find();
        
        const revenueByPlan = {
            mocktest: 0,
            normal: 0,
            premium: 0
        };

        const subscriptionMetrics = {
            weekly: { count: 0, revenue: 0 },
            monthly: { count: 0, revenue: 0 },
            yearly: { count: 0, revenue: 0 }
        };

        payments.forEach(payment => {
            revenueByPlan[payment.planType] += payment.amount;
            subscriptionMetrics[payment.frequency].count++;
            subscriptionMetrics[payment.frequency].revenue += payment.amount;
        });

        res.json({
            revenueByPlan,
            subscriptionMetrics
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get teacher analytics
router.get('/teacher-analytics', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        const courses = await Class.find();

        const teacherStats = {
            totalActive: teachers.filter(t => t.active).length,
            bySubject: {},
            averageRating: 0
        };

        // Calculate subject distribution
        teachers.forEach(teacher => {
            if (teacher.subjectassigned) {
                teacherStats.bySubject[teacher.subjectassigned] = 
                    (teacherStats.bySubject[teacher.subjectassigned] || 0) + 1;
            }
        });

        // Calculate average teacher rating
        const teachersWithRatings = teachers.filter(t => t.feedback && t.feedback.length > 0);
        teacherStats.averageRating = teachersWithRatings.reduce((acc, teacher) => {
            const teacherAvg = teacher.feedback.reduce((sum, fb) => sum + fb.rating, 0) / teacher.feedback.length;
            return acc + teacherAvg;
        }, 0) / (teachersWithRatings.length || 1);

        res.json({
            teacherStats,
            totalCourses: courses.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route for user engagement analytics
router.get('/user-engagement', async (req, res) => {
    try {
        const User = require('../model/User');
        const Class = require('../model/courses');
        const Payment = require('../model/payment');

        // Get current date and date 7 days ago
        const today = new Date();
        const lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

        // Get active users (logged in within last 7 days)
        const activeUsers = await User.countDocuments({
            lastLoginDate: { $gte: lastWeek }
        });

        // Calculate course completion rate
        const allCourses = await Class.find();
        const totalCompletions = allCourses.reduce((sum, course) => 
            sum + course.completedBy.length, 0
        );
        const completionRate = (totalCompletions / (allCourses.length || 1)) * 100;

        // Get daily active users for the past week
        const dailyActiveData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            
            const count = await User.countDocuments({
                lastLoginDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            
            dailyActiveData.push({ value: count });
        }

        // Calculate subscription-based retention
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        // Get users with active premium subscriptions
        const activeSubscribers = await User.countDocuments({
            premium: true,
            premiumExpiresAt: { $gt: today }
        });

        // Get total premium users from last month
        const lastMonthSubscribers = await Payment.countDocuments({
            createdAt: {
                $gte: lastMonth,
                $lt: thisMonth
            }
        });

        // Calculate retention rate based on premium subscriptions
        const retentionRate = lastMonthSubscribers ? 
            ((activeSubscribers / lastMonthSubscribers) * 100).toFixed(1) : 0;

        // Get subscription breakdown
        const subscriptionStats = {
            weekly: await User.countDocuments({ subscriptionPlan: 'weekly', premium: true }),
            monthly: await User.countDocuments({ subscriptionPlan: 'monthly', premium: true }),
            yearly: await User.countDocuments({ subscriptionPlan: 'yearly', premium: true })
        };

        res.json({
            activeUsers,
            completionRate: completionRate.toFixed(1),
            retentionRate,
            dailyActiveData,
            subscriptionStats,
            totalPremiumUsers: activeSubscribers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route for performance metrics
router.get('/performance-metrics', async (req, res) => {
    try {
        const Class = require('../model/courses');
        const Teacher = require('../model/Teacher');

        // Default response structure
        let response = {
            topCourse: {
                name: 'No courses available',
                teacher: 'N/A',
                completions: 0,
                rating: '0.0'
            },
            activeTeacher: {
                name: 'No active teachers',
                subject: 'N/A',
                students: 0,
                rating: '0.0'
            },
            popularSubject: {
                name: 'No subjects available',
                completions: 0,
                completionRate: '0.0',
                rating: '0.0'
            }
        };

        try {
            // Get top performing course based on feedback and completion rate
            const topCourse = await Class.aggregate([
                {
                    $match: {
                        subTopic: { $exists: true, $ne: null },
                        feedback: { $exists: true, $ne: [] }
                    }
                },
                {
                    $project: {
                        topic: 1,
                        subTopic: 1,
                        teacherName: 1,
                        completionCount: { $size: "$completedBy" },
                        averageRating: {
                            $avg: "$feedback.rating"
                        },
                        totalFeedback: { $size: "$feedback" }
                    }
                },
                {
                    $addFields: {
                        // Calculate a performance score based on ratings and completion count
                        performanceScore: {
                            $multiply: [
                                "$averageRating",
                                {
                                    $add: [
                                        1,
                                        { $divide: ["$completionCount", 10] } // Weight completions
                                    ]
                                }
                            ]
                        }
                    }
                },
                { 
                    $sort: { 
                        performanceScore: -1,
                        totalFeedback: -1 // Secondary sort by number of feedbacks
                    }
                },
                { $limit: 1 }
            ]);

            if (topCourse && topCourse.length > 0) {
                response.topCourse = {
                    name: `${topCourse[0].subTopic}`,
                    teacher: topCourse[0].teacherName || 'Not Assigned',
                    completions: topCourse[0].completionCount || 0,
                    rating: topCourse[0].averageRating.toFixed(1),
                    totalFeedback: topCourse[0].totalFeedback
                };
            }
        } catch (courseError) {
            console.error('Error fetching top course:', courseError);
        }

        try {
            // Get most active teacher based on all teaching activities
            const activeTeacher = await Teacher.aggregate([
                { 
                    $match: { active: true }
                },
                {
                    // First stage: Get teacher's basic info
                    $project: {
                        name: { $concat: ["$firstname", " ", "$lastname"] },
                        email: 1,
                        subject: "$subjectassigned",
                        studentCount: { $size: { $ifNull: ["$assignedStudents", []] } }
                    }
                },
                {
                    // Second stage: Lookup courses by this teacher
                    $lookup: {
                        from: 'courses',
                        let: { teacherEmail: "$email" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$teacherEmail", "$$teacherEmail"] }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalSubTopics: { $sum: { $size: "$subTopic" } }
                                }
                            }
                        ],
                        as: 'courseStats'
                    }
                },
                {
                    // Third stage: Lookup mock tests by this teacher
                    $lookup: {
                        from: 'mocktests',
                        let: { teacherEmail: "$email" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$email", "$$teacherEmail"] }
                                }
                            },
                            {
                                $count: "totalMockTests"
                            }
                        ],
                        as: 'mockTestStats'
                    }
                },
                {
                    // Fourth stage: Lookup live classes by this teacher
                    $lookup: {
                        from: 'liveclasses',
                        let: { teacherEmail: "$email" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$teacherEmail", "$$teacherEmail"] }
                                }
                            },
                            {
                                $count: "totalLiveClasses"
                            }
                        ],
                        as: 'liveClassStats'
                    }
                },
                {
                    // Fifth stage: Calculate total activity score
                    $addFields: {
                        courseCount: {
                            $ifNull: [{ $arrayElemAt: ["$courseStats.totalSubTopics", 0] }, 0]
                        },
                        mockTestCount: {
                            $ifNull: [{ $arrayElemAt: ["$mockTestStats.totalMockTests", 0] }, 0]
                        },
                        liveClassCount: {
                            $ifNull: [{ $arrayElemAt: ["$liveClassStats.totalLiveClasses", 0] }, 0]
                        }
                    }
                },
                {
                    // Sixth stage: Calculate total activity score
                    $addFields: {
                        activityScore: {
                            $add: [
                                "$courseCount",      // Each subtopic counts as 1
                                "$mockTestCount",    // Each mock test counts as 1
                                "$liveClassCount"    // Each live class counts as 1
                            ]
                        }
                    }
                },
                {
                    // Sort by total activity and student count
                    $sort: {
                        activityScore: -1,
                        studentCount: -1
                    }
                },
                { $limit: 1 }
            ]);

            if (activeTeacher && activeTeacher.length > 0) {
                response.activeTeacher = {
                    name: activeTeacher[0].name || 'Not Available',
                    subject: activeTeacher[0].subject || 'Not Assigned',
                    students: activeTeacher[0].studentCount || 0,
                    totalActivities: {
                        courses: activeTeacher[0].courseCount || 0,
                        mockTests: activeTeacher[0].mockTestCount || 0,
                        liveClasses: activeTeacher[0].liveClassCount || 0
                    }
                };
            }
        } catch (teacherError) {
            console.error('Error fetching active teacher:', teacherError);
        }

        try {
            // Get popular subject
            const popularSubject = await Class.aggregate([
                {
                    $group: {
                        _id: "$teacherAssignedSub",
                        totalCompletions: {
                            $sum: { $size: { $ifNull: ["$completedBy", []] } }
                        }
                    }
                },
                { $sort: { totalCompletions: -1 } },
                { $limit: 1 }
            ]);

            if (popularSubject && popularSubject.length > 0) {
                response.popularSubject = {
                    name: popularSubject[0]._id || 'Not Available',
                    completions: popularSubject[0].totalCompletions || 0,
                    completionRate: '0.0',
                    rating: '0.0'
                };
            }
        } catch (subjectError) {
            console.error('Error fetching popular subject:', subjectError);
        }

        res.json(response);

    } catch (error) {
        console.error('Performance metrics error:', error);
        res.status(500).json({
            error: 'Failed to fetch performance metrics',
            details: error.message
        });
    }
});

module.exports = router; 