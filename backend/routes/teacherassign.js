const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher");

// Fetch assigned students for a teacher using their email
router.get("/assigned-students", async (req, res) => {
  try {
    const { email } = req.query; // Get teacher's email from query

    if (!email) {
      return res.status(400).json({ message: "Teacher email is required" });
    }

    // Find teacher and populate assigned students
    const teacher = await Teacher.findOne({ email }).populate("assignedStudents", "name email phone education");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ assignedStudents: teacher.assignedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
