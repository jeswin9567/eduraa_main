// Assuming you already have Express and your User model set up
const express = require('express');
const router = express.Router();
const UserModel = require('../model/User'); // Adjust the path as needed

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

module.exports = router;

