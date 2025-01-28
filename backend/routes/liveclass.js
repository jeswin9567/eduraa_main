const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher");
const LiveClass = require("../model/liveClass");

// Get teacher by email
router.get("/teacher/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json({ firstname: teacher.firstname, lastname: teacher.lastname });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule live class
router.post("/schedule-live-class", async (req, res) => {
  const { teacherName, teacherEmail, topic, date, time, endtime } = req.body;

  if (!teacherName || !teacherEmail || !topic || !date || !time || !endtime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newLiveClass = new LiveClass({
      teacherName,
      teacherEmail,
      topic,
      date,
      time,
      endtime,
    });

    await newLiveClass.save();
    res.status(201).json({ message: "Live class scheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all teachers live classes scheduled

// Get all live classes
router.get("/get-all", async (req, res) => {
  try {
    const liveClasses = await LiveClass.find(); // Fetch all live classes
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch live classes" });
  }
});

// nearest live class

router.get("/next-live-class/:teacherEmail", async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    const now = new Date();
    
    // Find the next live class for the teacher where the date is greater than or equal to the current time
    const nextLiveClass = await LiveClass.findOne({
      teacherEmail: teacherEmail, // Filter by teacher email
      date: { $gte: now }, // Ensure the class is in the future
    }).sort({ date: 1 }); // Sort by date in ascending order
    
    if (!nextLiveClass) {
      // Return an empty response with a message
      return res.status(200).json({ message: "No upcoming live classes scheduled." });
    }
    
    res.status(200).json(nextLiveClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;
