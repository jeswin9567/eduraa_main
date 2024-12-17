const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Include Nodemailer for sending emails
const UserModel = require('../model/User');
const LoginModel = require('../model/login');
const router = express.Router();
const dotenv = require('dotenv')

dotenv.config()

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

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like Outlook or SMTP-based
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS   // Replace with your email password or app-specific password
  }
});

// Route to change password
router.put('/', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by email in LoginModel
    const login = await LoginModel.findOne({ email: req.email });
    if (!login) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, login.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Directly assign the new password without hashing for UserModel
    login.password = newPassword; // Not hashed
    await login.save();

    // Update password in UserModel as well
    const user = await UserModel.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "Login details not found." });
    }

    // Directly assign the new password without hashing
    user.password = newPassword; // Not hashed
    await user.save();

    // Send an email to the user notifying about the password change
    const mailOptions = {
      from: 'your-email@gmail.com', // Sender address
      to: req.email, // Receiver's email address
      subject: 'Password Changed Successfully',
      text: `Hello, your password has been changed successfully. If you did not perform this action, please contact support immediately.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Password changed but failed to send email.' });
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: "Password updated successfully and notification email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

module.exports = router;
