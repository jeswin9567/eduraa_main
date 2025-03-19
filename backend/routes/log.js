const express = require('express');
const router = express.Router();
const LoginModel = require('../model/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login route with performance improvements
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use lean() for faster query execution
    const user = await LoginModel.findOne({ email: email }).lean();

    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    // Check if the user's status is active
    if (!user.status) {
      return res.status(403).json({ message: "Account is inactive. Please contact the administrator." });
    }

    // Simplified password comparison logic
    const isMatch = user.role === 'admin' 
      ? password === user.password
      : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token with minimal payload
    const token = jwt.sign({ email: user.email }, 'sceret_key', { expiresIn: '24h' });
    return res.json({ 
      message: "success", 
      role: user.role, 
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
