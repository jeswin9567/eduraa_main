const express = require("express");
const Teacher = require("../model/Teacher"); // Adjust the path as per your folder structure
const router = express.Router();

// Route to get all teachers
router.get("/teachers", async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
});

module.exports = router;
