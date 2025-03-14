const express = require('express');
const router = express.Router();
const PaymentModel = require('../model/payment');
const UserModel = require('../model/User');
const TeacherModel = require('../model/Teacher');
const FieldCourses = require('../model/entrancefieldcour');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const Class = require('../model/courses');
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Payment initiation endpoint
// Payment initiation endpoint
router.post('/process', async (req, res) => {
  const { email, amount, frequency, planType } = req.body;  // Ensure planType is received

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user._id;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      message: 'Payment initiated successfully',
      order,
      userDetails: {
        name: user.name,
        phone: user.phone,
      },
      userId,
      planType,  // Include planType in response
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// Payment success confirmation endpoint
router.post('/success', async (req, res) => {
  const { userId, email, amount, frequency, paymentId, planType } = req.body;

  try {
    // Calculate expiration date based on frequency
    const expirationDate = new Date();
    if (frequency === 'weekly') {
      expirationDate.setDate(expirationDate.getDate() + 7);
    } else if (frequency === 'monthly') {
      expirationDate.setDate(expirationDate.getDate() + 30);
    } else if (frequency === 'yearly') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    // Save payment details to the database
    const payment = new PaymentModel({
      userId,
      amount,
      email,
      frequency,
      expirationDate,
      razorpayPaymentId: paymentId,
      planType,
    });

    await payment.save();

    // Only proceed with teacher assignment for monthly and yearly plans
    if (frequency === 'monthly' || frequency === 'yearly') {
      // Get user's entrance field
      const user = await UserModel.findById(userId);
      if (!user.entranceField) {
        throw new Error('User entrance field not found');
      }

      // Get courses for the entrance field
      const fieldCourses = await FieldCourses.findOne({ field: user.entranceField });
      if (!fieldCourses) {
        throw new Error('Courses not found for the entrance field');
      }

      // Get all active teachers
      const allEligibleTeachers = await TeacherModel.find({
        subjectassigned: { $in: fieldCourses.courses },
        active: true
      });

      if (allEligibleTeachers.length === 0) {
        throw new Error('No eligible teachers found');
      }

      // Create a map to store one teacher per course
      const courseTeacherMap = new Map();

      // For each course, select one teacher with load balancing
      for (const course of fieldCourses.courses) {
        const teachersForCourse = allEligibleTeachers.filter(
          teacher => teacher.subjectassigned === course
        );
        
        if (teachersForCourse.length > 0) {
          // Sort teachers by number of assigned students (ascending)
          const sortedTeachers = teachersForCourse.sort((a, b) => 
            (a.assignedStudents?.length || 0) - (b.assignedStudents?.length || 0)
          );
          
          // Select the teacher with the least number of students
          courseTeacherMap.set(course, sortedTeachers[0]);
        }
      }

      // Get unique teacher IDs from the map
      const selectedTeachers = Array.from(courseTeacherMap.values());
      const teacherIds = selectedTeachers.map(teacher => teacher._id);

      if (teacherIds.length === 0) {
        throw new Error('No teachers could be assigned to courses');
      }

      // Update user with selected teachers
      await UserModel.findByIdAndUpdate(userId, {
        premium: true,
        premiumExpiresAt: expirationDate,
        subscriptionPlan: frequency,
        assignedTeacher: teacherIds
      });

      // Update all selected teachers with this student
      await TeacherModel.updateMany(
        { _id: { $in: teacherIds } },
        { $addToSet: { assignedStudents: userId } }
      );
    } else {
      // For weekly plans, just update premium status
      await UserModel.findByIdAndUpdate(userId, {
        premium: true,
        premiumExpiresAt: expirationDate,
        subscriptionPlan: frequency
      });
    }

    res.status(200).json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Payment confirmation failed: ' + error.message });
  }
});

// Add this new route to get total revenue
router.get('/total-revenue', async (req, res) => {
  try {
    const result = await PaymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    res.status(500).json({ error: 'Failed to fetch total revenue' });
  }
});

// Add these new routes for revenue analysis
router.get('/revenue-analysis', async (req, res) => {
  try {
    // Get current date and first day of current month
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total and current month revenue in a single aggregation
    const revenueData = await PaymentModel.aggregate([
      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ],
          currentMonth: [
            {
              $match: {
                createdAt: { $gte: currentMonth }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]
        }
      }
    ]);

    const revenue = {
      total: revenueData[0].totalRevenue[0]?.total || 0,
      currentMonth: revenueData[0].currentMonth[0]?.total || 0
    };

    res.status(200).json({ revenue });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Add this new route to get active courses count
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Get current date and first day of current month
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get revenue data
    const revenueData = await PaymentModel.aggregate([
      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ],
          currentMonth: [
            {
              $match: {
                createdAt: { $gte: currentMonth }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]
        }
      }
    ]);

    // Get active courses count
    const coursesCount = await Class.countDocuments({ activeStatus: true });

    const stats = {
      revenue: {
        total: revenueData[0].totalRevenue[0]?.total || 0,
        currentMonth: revenueData[0].currentMonth[0]?.total || 0
      },
      activeCourses: coursesCount
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Add this new route for detailed revenue information
router.get('/revenue-details', async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentMonthData, lastMonthData, recentTransactions] = await Promise.all([
      // Get current month data
      PaymentModel.aggregate([
        {
          $match: {
            createdAt: { $gte: currentMonthStart }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),

      // Get last month data
      PaymentModel.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: lastMonthStart,
              $lt: currentMonthStart
            }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),

      // Get recent transactions
      PaymentModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'email',
            foreignField: 'email',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            createdAt: 1,
            amount: 1,
            planType: 1,
            expirationDate: 1,
            userName: '$userDetails.name'
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
    ]);

    res.status(200).json({
      currentMonth: {
        revenue: currentMonthData[0]?.revenue || 0,
        count: currentMonthData[0]?.count || 0
      },
      lastMonth: {
        revenue: lastMonthData[0]?.revenue || 0,
        count: lastMonthData[0]?.count || 0
      },
      transactions: recentTransactions
    });
  } catch (error) {
    console.error('Error fetching revenue details:', error);
    res.status(500).json({ error: 'Failed to fetch revenue details' });
  }
});

module.exports = router;
