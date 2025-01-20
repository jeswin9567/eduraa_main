const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher"); // Adjust path if needed
const jwt = require("jsonwebtoken");

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

module.exports = router;
