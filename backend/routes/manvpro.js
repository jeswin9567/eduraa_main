const express = require('express');
const bcrypt = require('bcryptjs')
const router = express.Router();
const ManagerModel = require('../model/Manager');
const LoginModel = require('../model/login');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, 'sceret_key', (err, decoded) => {
        if (err) {
            return res.status(400).json({message: "Failed to authenticate token."})

        }
        req.email = decoded.email; 
        next ();
    });
};

//configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service:'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get('/manprof',verifyToken, (req,res) => {
    ManagerModel.findOne({email: req.email})
    .then(user => {
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({
            name: user.name,
            email: user.email,

        });

    })
    .catch(error => res.status(500).json({message:"Error:"+error.message}));
});

router.put('/manchangepass', verifyToken, async(req, res) => {
    const {currentPassword, newPassword } = req.body;

    try{
        const login = await LoginModel.findOne({email: req.email});
        if(!login) {
            return res.status(404).json({message: "User not found"});
        }

        //check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword,login.password);
        if(!isMatch) {
            return res.status(400).json({message: "Current Password is incorrect"});
    
        }
        login.password = newPassword;
        await login.save();

        const user = await ManagerModel.findOne({email: req.email});
        if (!user){
            return res.status(404).json({message: "Login not found"});

        }
        user.password = newPassword;
        await user.save();

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