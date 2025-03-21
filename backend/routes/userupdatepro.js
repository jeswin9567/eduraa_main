const express = require('express');
const router = express.Router();
const UserModel = require('../model/User'); // Ensure the path is correct
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

// Route to update profile details
router.put('/', verifyToken, (req, res) => {
  const { name, phone, education, courses, marks, entranceField } = req.body;

  UserModel.findOneAndUpdate(
    { email: req.email },
    {
      name,
      phone,
      education,
      courses,
      marks,
      entranceField // Add this field
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          education: user.education,
          courses: user.courses,
          marks: user.marks,
          entranceField: user.entranceField // Send updated field
        }
      });
    })
    .catch(error => res.status(500).json({ message: "Error: " + error.message }));
});

module.exports = router;
