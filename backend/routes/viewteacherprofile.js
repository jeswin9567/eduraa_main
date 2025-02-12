const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher"); // Adjust path if needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Login = require('../model/login');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config()

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(403).json({message:"No token provided."});
    }

    jwt.verify(token, 'sceret_key', (err,decoded) => {
        if (err) {
            return res.status(500).json({message:"Failed to authenticate token."});
        }
        req.email = decoded.email;
        next();
    });
};

// Route to fetch teacher profile
router.get("/teacher-profile", verifyToken, async (req, res) => {
    try {
        const teacher = await Teacher.findOne({email:req.email});
        if (!teacher) {
            return res.status(404).json({ error: "Teacher profile not found." });
        }
        res.json(teacher);
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// check password

router.post("/verify-password", async (req, res) => {
    const { email, currentPassword } = req.body;

    try {
        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error verifying password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or use an app password
    }
});

// Update password and send email
router.post("/update-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Login.findOneAndUpdate({ email }, { password: hashedPassword });

        // Send email notification
        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Your Password Has Been Changed",
            text: `Hello,\n\nYour password has been successfully changed. If this wasn't you, please contact support immediately.\n\nBest regards,\nEduraa Support Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ success: false, message: "Password updated but email notification failed." });
            }
            console.log("Email sent: " + info.response);
            res.json({ success: true, message: "Password updated successfully. Email notification sent." });
        });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
