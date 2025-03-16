// Assuming you already have Express and your User model set up
const express = require('express');
const router = express.Router();
const UserModel = require('../model/User'); // Adjust the path as needed
const MockTest = require('../model/Mocktest');
const QuizAnswer = require('../model/quiz');  
const Class = require('../model/courses');

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
    
    // Get classes from assigned teachers
    const classes = await Class.find({
      teacherEmail: { $in: teacherEmails },
      activeStatus: true
    });

    // Get completed classes count
    const completedClasses = classes.filter(cls => 
      cls.completedBy.some(completion => completion.studentEmail === email)
    );

    // Calculate progress percentage based only on classes
    let progressPercentage = 0;
    if (classes.length > 0) {
      progressPercentage = Math.round((completedClasses.length / classes.length) * 100);
    }

    // Ensure percentage doesn't exceed 100
    progressPercentage = Math.min(progressPercentage, 100);

    // Detailed console logging
    console.log('----------------------------------------');
    console.log(`Learning Progress Details for ${email}:`);
    console.log(`Assigned Teachers:`, teacherEmails);
    console.log(`Total Classes: ${classes.length}`);
    console.log(`Completed Classes: ${completedClasses.length}`);
    console.log(`Progress Percentage: ${progressPercentage}%`);
    console.log('----------------------------------------');

    res.json({ 
      progressPercentage,
      totalClasses: classes.length,
      completedClasses: completedClasses.length
    });
  } catch (error) {
    console.error('Error calculating learning progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this new route to update and get streak information
router.get('/learning-streak/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        const lastActivity = user.lastActivityDate;
        
        // If this is the first activity
        if (!lastActivity) {
            user.lastActivityDate = today;
            user.currentStreak = 1;
            user.longestStreak = 1;
        } else {
            const timeDiff = today - lastActivity;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                // Already logged activity today
                // Do nothing
            } else if (daysDiff === 1) {
                // Consecutive day
                user.currentStreak += 1;
                user.lastActivityDate = today;
                if (user.currentStreak > user.longestStreak) {
                    user.longestStreak = user.currentStreak;
                }
            } else {
                // Streak broken
                user.currentStreak = 1;
                user.lastActivityDate = today;
            }
        }
        
        await user.save();
        
        res.json({
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak
        });
    } catch (error) {
        console.error('Error updating learning streak:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new route to update last activity
router.post('/update-activity', async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        const lastActivity = user.lastActivityDate;
        
        // Only update if it's a new day
        if (!lastActivity || !isSameDay(today, lastActivity)) {
            user.lastActivityDate = today;
            
            // Update streak
            if (!lastActivity) {
                // First activity ever
                user.currentStreak = 1;
                user.longestStreak = 1;
            } else {
                const daysDiff = getDaysDifference(today, lastActivity);
                
                if (daysDiff === 1) {
                    // Consecutive day
                    user.currentStreak += 1;
                    if (user.currentStreak > user.longestStreak) {
                        user.longestStreak = user.currentStreak;
                    }
                } else if (daysDiff > 1) {
                    // Streak broken
                    user.currentStreak = 1;
                }
            }
            
            await user.save();
        }

        res.json({
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastActivityDate: user.lastActivityDate
        });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper functions
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date1 - date2);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Add this route to handle login streaks
router.post('/login-streak', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentDate = new Date();
        const lastLogin = user.lastLoginDate;

        // If first time login
        if (!lastLogin) {
            user.currentStreak = 1;
            user.longestStreak = 1;
            user.lastLoginDate = currentDate;
        } else {
            // Calculate days between logins
            const lastLoginDay = new Date(lastLogin).setHours(0, 0, 0, 0);
            const currentDay = new Date(currentDate).setHours(0, 0, 0, 0);
            const dayDifference = Math.floor((currentDay - lastLoginDay) / (1000 * 60 * 60 * 24));

            if (dayDifference === 0) {
                // Same day login - do nothing
            } else if (dayDifference === 1) {
                // Consecutive day login
                user.currentStreak += 1;
                user.lastLoginDate = currentDate;
                
                // Update longest streak if current is higher
                if (user.currentStreak > user.longestStreak) {
                    user.longestStreak = user.currentStreak;
                }
            } else {
                // Streak broken
                user.currentStreak = 1;
                user.lastLoginDate = currentDate;
            }
        }

        await user.save();

        res.json({
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastLoginDate: user.lastLoginDate
        });

    } catch (error) {
        console.error('Error updating login streak:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new route to get all users (add it in the existing user.js file)
router.get('/users', async (req, res) => {
    try {
        // Find all users with role 'user', excluding admin and manager accounts
        const users = await UserModel.find({ role: 'user' })
            .select('-password') // Exclude password from the response
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

