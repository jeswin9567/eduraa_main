const express = require('express');
const router = express.Router();
const LoginModel = require('../model/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Add caching for frequently accessed users
const NodeCache = require('node-cache');
const userCache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

// Login route with optimization
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check cache first
    const cachedUser = userCache.get(email);
    let user;

    if (cachedUser) {
      user = cachedUser;
    } else {
      // If not in cache, get from DB and cache it
      user = await LoginModel.findOne({ email }).lean().exec();
      if (user) {
        userCache.set(email, user);
      }
    }

    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    if (!user.status) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // Optimize password check
    const isMatch = user.role === 'admin' 
      ? password === user.password
      : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token with minimal payload
    const token = jwt.sign(
      { email: user.email, role: user.role }, 
      'sceret_key',
      { expiresIn: '24h' }
    );

    // Send minimal response
    res.json({ 
      message: "success", 
      role: user.role, 
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
