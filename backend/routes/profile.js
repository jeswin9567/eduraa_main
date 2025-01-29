// profile.js (New file for profile routes)
const express = require('express');
const router = express.Router();
const UserModel = require('../model/User'); // Import UserModel
const PaymentModel = require('../model/payment');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, 'sceret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    req.email = decoded.email; // Save email for further use
    next();
  });
};

// Profile GET route
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      education: user.education,
      courses: user.courses,
      marks: user.marks,
      premium: user.premium,
      participate: user.participate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

// Profile PUT route (for updating user details)
router.put('/', verifyToken, async (req, res) => {
  const { name, phone, education, courses, marks } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { email: req.email },
      { name, phone, education, courses, marks },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

// Route to get the latest payment details (e.g., expiration date)
router.get('/payment/latest', verifyToken, async (req, res) => {
  try {
    // Assuming you have a separate PaymentModel with userId reference and expirationDate field
    const latestPayment = await PaymentModel.findOne({ email: req.email })
      .sort({ createdAt: -1 }); // Get the latest payment

    if (!latestPayment) {
      return res.status(404).json({ message: "No payment record found." });
    }

    res.json({ expirationDate: latestPayment.expirationDate });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

// Route to cancel premium subscription
router.post('/payment/cancel', verifyToken, async (req, res) => {
  try {
    // Update the user's premium status and reset related fields
    await UserModel.findOneAndUpdate(
      { email: req.email },
      {
        premium: false,  // Set premium to false
        premiumExpiresAt: null,  // Reset expiration date
        subscriptionPlan: null,  // Reset subscription plan
      }
    );

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});


module.exports = router;
