const express = require('express');
const router = express.Router();
const LoginModel = require('../model/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login route
router.post('/', (req, res) => {
  const { email, password } = req.body;

  LoginModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Incorrect email or password" });
      }

      // Check if the user's status is active
      if (!user.status) {
        return res.status(403).json({ message: "Account is inactive. Please contact the administrator." });
      }

      // If the user is an admin, directly compare plaintext passwords
      if (user.role === 'admin') {
        if (password === user.password) { // direct comparison for admin's plain password
          const token = jwt.sign({ email: user.email }, 'sceret_key'); 
          return res.json({ message: "success", role: user.role, token: token });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      } 
      
      // For non-admins, compare hashed passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Error: " + err.message });
        }

        if (isMatch) {
          const token = jwt.sign({ email: user.email }, 'sceret_key'); 
          return res.json({ message: "success", role: user.role, token: token });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      });
    })
    .catch(error => res.status(500).json({ message: "Error: " + error.message }));
});

module.exports = router;
