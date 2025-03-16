const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher");
const LiveClass = require("../model/liveClass");
const User = require("../model/User")
const dotenv = require("dotenv");
dotenv.config();  

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

router.get("/get-teacher-classes", async (req, res) => {
  const { email } = req.query; // Get the email from the query parameter

  if (!email) {
    return res.status(400).json({ message: "Teacher email is required" });
  }

  try {
    const liveClasses = await LiveClass.find({ teacherEmail: email });
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live classes" });
  }
});

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

// view scheduled classes for student


router.get("/user/scheduled-classes", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email and populate assigned teachers
    const user = await User.findOne({ email }).populate("assignedTeacher");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract teacher details from assigned teachers
    const teacherDetails = user.assignedTeacher.map((teacher) => ({
      teacherEmail: teacher.email,
      teacherName: teacher.firstname,
      subject: teacher.subject,
    }));

    // Get the current date and time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Fetch only upcoming classes
    const scheduledClasses = await LiveClass.find({
      teacherEmail: { $in: teacherDetails.map((t) => t.teacherEmail) },
      $or: [
        { date: { $gt: now } }, // Future dates
        { date: currentDate, endtime: { $gte: currentTime } }, // Ongoing classes
      ],
    });

    if (scheduledClasses.length === 0) {
      return res.json({ message: "No scheduled classes available" });
    }

    // Map classes to include teacher details
    const responseClasses = scheduledClasses.map((liveClass) => {
      const teacherInfo = teacherDetails.find((t) => t.teacherEmail === liveClass.teacherEmail);
      return {
        _id: liveClass._id,
        topic: liveClass.topic,
        date: liveClass.date,
        time: liveClass.time,
        endtime: liveClass.endtime,
        status: liveClass.status,
        teacherName: teacherInfo ? teacherInfo.teacherName : "Unknown",
        teacherEmail: teacherInfo ? teacherInfo.teacherEmail : "Unknown",
      };
    });

    res.json(responseClasses);
  } catch (error) {
    console.error("Error fetching scheduled classes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Start live class
router.put("/start/:id", async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }

    liveClass.status = true;
    await liveClass.save();

    res.status(200).json({ message: "Live class started successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get live class details
router.get("/:id", async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }

    res.status(200).json(liveClass);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// End live class
router.put("/end/:id", async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }

    liveClass.status = false;
    await liveClass.save();

    res.status(200).json({ message: "Live class ended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route to handle class ending
router.put('/end/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    await LiveClass.findByIdAndUpdate(classId, { status: false });
    res.status(200).json({ message: 'Class ended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error ending class', error: error.message });
  }
});

const nodemailer = require("nodemailer");

// Reminder route to send emails to assigned students
router.post("/remind/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    // Find the live class
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }

    // Find the teacher
    const teacher = await Teacher.findOne({ email: liveClass.teacherEmail }).populate("assignedStudents");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!teacher.assignedStudents || teacher.assignedStudents.length === 0) {
      return res.status(400).json({ message: "No students assigned to this teacher." });
    }

    // Extract student emails
    const studentEmails = teacher.assignedStudents.map(student => student.email);

    // Setup Nodemailer transporter (using Gmail as an example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with an App Password for security
      },
    });

    // Email options
    const mailOptions = {
      from: "your-email@gmail.com",
      to: studentEmails.join(","),
      subject: `Reminder: Upcoming Live Class - ${liveClass.topic}`,
      text: `Dear Student,\n\nThis is a reminder that your upcoming live class on "${liveClass.topic}" is scheduled for ${liveClass.date} at ${liveClass.time}.\n\nPlease be on time.\n\nBest regards,\nEduraa Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reminder emails sent successfully" });
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    res.status(500).json({ message: "Error sending reminder emails" });
  }
});

// Add this new route for today's schedule
router.get("/today-schedule/:teacherEmail", async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    
    // Get start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all classes scheduled for today for this teacher
    const todayClasses = await LiveClass.find({
      teacherEmail: teacherEmail,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    }).sort({ time: 1 }); // Sort by time ascending

    if (!todayClasses || todayClasses.length === 0) {
      return res.status(200).json({ 
        message: "No classes scheduled for today",
        classes: []
      });
    }

    // Format the response
    const formattedClasses = todayClasses.map(cls => ({
      id: cls._id,
      subject: cls.topic,
      time: cls.time,
      endTime: cls.endtime,
      status: cls.status
    }));

    res.status(200).json({
      message: "Today's schedule retrieved successfully",
      classes: formattedClasses
    });

  } catch (error) {
    console.error("Error fetching today's schedule:", error);
    res.status(500).json({ 
      message: "Error fetching today's schedule",
      error: error.message 
    });
  }
});

module.exports = router;
