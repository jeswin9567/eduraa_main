const express = require('express');
const router = express.Router();
const UserModel = require('../model/User');
const LoginModel = require('../model/login');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dns = require('dns'); // Import the dns package

require('dotenv').config();

let OTPs = {}; // Temporary store for OTPs
const OTP_EXPIRY_TIME = 30 * 1000; // 30 seconds in milliseconds

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Helper function to validate email domain
const validateEmailDomain = (email) => {
  return new Promise((resolve, reject) => {
    const domain = email.split('@')[1];
    if (!domain) {
      return reject(new Error("Invalid email format"));
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      return reject(new Error("Invalid email domain format"));
    }

    // Optional: DNS check (you can comment this out if causing issues)
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        // Instead of rejecting, we'll accept the email if the domain format is valid
        console.log("DNS MX lookup failed:", err);
        resolve(true);
        return;
      }
      resolve(true);
    });
  });
};

// Signup route
router.post('/', async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  try {
    // Basic validations
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate email domain with more lenient checks
    try {
      await validateEmailDomain(email);
    } catch (error) {
      return res.status(400).json({ 
        message: "Please enter a valid email address",
        details: error.message 
      });
    }

    // Generate OTP and continue with the signup process
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpDetails = {
      otp,
      name,
      phone,
      password,
      generatedAt: Date.now(),
    };
    OTPs[email] = otpDetails;

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for Signup',
      text: `Your OTP code is ${otp}. This code will expire in 30 seconds.`,
    });

    res.status(200).json({ message: "OTP sent to your email", email });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "An error occurred during signup",
      details: error.message 
    });
  }
});

// OTP Verification Route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (OTPs[email]) {
    const { otp: storedOtp, generatedAt } = OTPs[email];

    // Check if the OTP is valid and not expired
    if (storedOtp === otp && (Date.now() - generatedAt) <= OTP_EXPIRY_TIME) {
      const { name, phone, password } = OTPs[email]; // Get stored user details
      try {
        // Update emailVerified to true after OTP verification
        const user = await UserModel.create({
          name,
          email,
          phone,
          password,
          emailVerified: true // Set emailVerified to true
        });

        // Create login details
        const login = await LoginModel.create({ email, password, role: 'user' });

        delete OTPs[email]; // Remove OTP after successful registration

        res.status(201).json({ message: "User created successfully", user, login });
      } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
        console.log(error)
      }
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

module.exports = router;
