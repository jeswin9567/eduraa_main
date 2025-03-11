// Assuming you already have Express and your User model set up
const express = require('express');
const router = express.Router();
const UserModel = require('../model/User'); // Adjust the path as needed
const MockTest = require('../model/Mocktest');
const QuizAnswer = require('../model/quiz');

// Route to get participation count for a user
// Route to get participation count and premium status for a user
router.get('/user/:email', async (req, res) => {
    try {
      const email = req.params.email.toLowerCase(); // Get the email from params
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return both participate count and premium status
      res.json({ participate: user.participate, premium: user.premium });
    } catch (error) {
      console.error('Error fetching participation count and premium status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route to increment participate count
router.post('/user/incrementParticipate', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $inc: { participate: 1 } }, // Increment participate by 1
      { new: true } // Return updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Participate count incremented successfully', participate: user.participate });
  } catch (error) {
    console.error('Error incrementing participate count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// to get the user count

router.get("/users/count", async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// user premium

router.get('/users/:email', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send user data including subscriptionPlan
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// view user name

router.get("/user-details", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// to get teachers number

router.get('/assigned-teacher-count', async (req, res) => {
  try {
    const { email } = req.query; 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user and populate assignedTeacher field
    const user = await UserModel.findOne({ email }).populate('assignedTeacher');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure assignedTeacher is an array before getting length
    const assignedTeacherCount = Array.isArray(user.assignedTeacher) ? user.assignedTeacher.length : 0;

    res.json({ assignedTeacherCount });
  } catch (error) {
    console.error("Error fetching assigned teacher count:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to handle premium expiration
router.post('/user/expire-premium', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { 
        premium: false,
        subscriptionPlan: null,
        premiumExpiresAt: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Premium status updated successfully',
      premium: user.premium,
      subscriptionPlan: user.subscriptionPlan
    });
  } catch (error) {
    console.error('Error updating premium status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this function to check and update expired premiums
async function checkAndUpdateExpiredPremiums() {
  try {
    const currentDate = new Date();
    
    // Find all users whose premium has expired but still have premium status
    const expiredUsers = await UserModel.find({
      premium: true,
      premiumExpiresAt: { $lt: currentDate }
    });

    // Update each expired user
    for (const user of expiredUsers) {
      await UserModel.findByIdAndUpdate(user._id, {
        premium: false,
        subscriptionPlan: null,
        premiumExpiresAt: null
      });
      console.log(`Premium expired for user: ${user.email}`);
    }
  } catch (error) {
    console.error('Error checking expired premiums:', error);
  }
}

// Run the check every hour (3600000 milliseconds)
setInterval(checkAndUpdateExpiredPremiums, 3600000);

// Run an initial check when the server starts
checkAndUpdateExpiredPremiums();

// Route to calculate learning progress
router.get('/learning-progress/:email', async (req, res) => {
  try {
    const email = req.params.email;
    
    // Find user and their assigned teachers
    const user = await UserModel.findOne({ email }).populate('assignedTeacher');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all mocktest IDs created by assigned teachers
    const teacherEmails = user.assignedTeacher.map(teacher => teacher.email);
    const mocktests = await MockTest.find({ 
      $or: [
        { email: { $in: teacherEmails } },
        { teacherName: { $in: teacherEmails } }
      ],
      status: true
    });

    // Get user's quiz attempts for these mocktests
    const quizAttempts = await QuizAnswer.find({
      email: email,
      mockTestId: { $in: mocktests.map(test => test._id) }
    });

    // Detailed console logging
    console.log('----------------------------------------');
    console.log(`Learning Progress Details for ${email}:`);
    console.log(`Assigned Teachers:`, teacherEmails);
    console.log(`Total Available Mocktests: ${mocktests.length}`);
    console.log('Mocktest Details:', mocktests.map(m => ({
      id: m._id,
      title: m.title,
      teacher: m.email || m.teacherName
    })));
    console.log(`Total Quiz Attempts: ${quizAttempts.length}`);
    console.log('Quiz Attempts:', quizAttempts.map(q => ({
      mockTestId: q.mockTestId,
      score: q.percentageScore
    })));
    console.log('----------------------------------------');

    // Calculate progress percentage
    let progressPercentage = 0;
    if (mocktests.length > 0) {
      progressPercentage = Math.round((quizAttempts.length / mocktests.length) * 100);
    }

    res.json({ 
      progressPercentage,
      totalMocktests: mocktests.length,
      completedTests: quizAttempts.length
    });
  } catch (error) {
    console.error('Error calculating learning progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

