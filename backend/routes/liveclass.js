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
    // Check for overlapping classes on the same date
    const overlappingClass = await LiveClass.findOne({
      date,
      $and: [
        { time: { $lt: endtime } }, // Existing class starts before new class ends
        { endtime: { $gt: time } }  // Existing class ends after new class starts
      ]
    });

    if (overlappingClass) {
      return res.status(400).json({ 
        error: "Another class is already scheduled during this time. Please choose a different time." 
      });
    }

    const newLiveClass = new LiveClass({
      teacherName,
      teacherEmail,
      topic,
      date,
      time,
      endtime,
      status: false,
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
    const liveClasses = await LiveClass.find().sort({ date: -1 }); // Sort by date in descending order
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch live classes" });
  }
});


// nearest live class

router.get("/next-live-class/:teacherEmail", async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    const now = new Date(); // Current date and time
    
    // Get start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // First, find the next live class scheduled for today that hasn't started yet
    let nextLiveClass = await LiveClass.findOne({
      teacherEmail: teacherEmail,
      date: { $gte: startOfToday, $lte: endOfToday }, // Matches only today's classes
      time: { $gte: now.toTimeString().slice(0, 5) } // Ensure the class hasn't started yet
    }).sort({ date: 1, time: 1 });

    // If no upcoming class is found for today, then check for future classes
    if (!nextLiveClass) {
      nextLiveClass = await LiveClass.findOne({
        teacherEmail: teacherEmail,
        date: { $gt: endOfToday }, // Only future classes
      }).sort({ date: 1, time: 1 });
    }

    if (!nextLiveClass) {
      return res.status(200).json({ message: "No upcoming live classes scheduled." });
    }

    res.status(200).json(nextLiveClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});



module.exports = router;
