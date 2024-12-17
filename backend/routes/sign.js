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
  const domain = email.split('@')[1]; // Extract the domain from the email
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return reject(new Error("Invalid email domain or no MX records found"));
      }
      resolve(true); // Valid domain with MX records
    });
  });
};



// Signup route
router.post('/', async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  // Validate if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Validate email domain with DNS MX lookup
  try {
    await validateEmailDomain(email);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpDetails = {
    otp,
    name,
    phone,
    password,
    generatedAt: Date.now(), // Store the time when OTP is generated
  };
  OTPs[email] = otpDetails; // Store OTP and user details

  // Send OTP email
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });

  // Respond with a message to enter OTP
  res.status(200).json({ message: "OTP sent to your email", email });
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
