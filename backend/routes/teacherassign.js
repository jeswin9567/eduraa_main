const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher");
const User = require('../model/User')

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



// Route to get the count of assigned students
router.get("/assigned-students/count", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Teacher email is required." });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).populate("assignedStudents");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const studentCount = teacher.assignedStudents.length;
    res.status(200).json({ studentCount });
  } catch (error) {
    console.error("Error fetching assigned students count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// assinged teacher

router.get("/assigned-teachers", async (req, res) => {
  try {
    const { email } = req.query; // Get users's email from query

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    // Find teacher and populate assigned students
    const user = await User.findOne({ email }).populate("assignedTeacher", "firstname email phone subjectassigned");

    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({  assignedTeacher: user.assignedTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
