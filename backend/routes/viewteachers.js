const express = require("express");
const Teacher = require("../model/Teacher"); // Adjust the path as per your folder structure
const router = express.Router();
const LoginModel = require("../model/login");
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config()

// setup the email transporter 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route to get all teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({active:true});
    const teacherWithStatus = await Promise.all(
      teachers.map(async (teacher) => {
        const login = await LoginModel.findOne({ email: teacher.email });
        return {
          ...teacher.toObject(),
          status: login ? login.status : false, // Add status from Login model
        };
      })
    );

    res.status(200).json(teacherWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error: error.message });
  }
});



// Route to get all teachers request

router.get("/teachersreq", async (req, res) => {
    try {
        const teachers = await Teacher.find({active:false});
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
});

// to get specific by id

router.get("/viewteacherdet/:id", async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Error fetching teacher details" });
    }
  });

  // accept teacher

  router.patch("/teacheraccept/:id", async (req, res) => {
    try {
      const { active, subjectassigned } = req.body; // Get active and subjectassigned from request body
  
      // Find and update the teacher's active status and assigned subject
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { active, subjectassigned },
        { new: true }
      );
  
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
  
      // Generate a random password for the teacher's login
      const randomPassword = crypto.randomBytes(8).toString("hex");
  
      // Create a new login entry for the teacher
      const login = new LoginModel({
        email: teacher.email,
        password: randomPassword,
        role: "teacher",
        status: true, // Ensure the status is set to active
      });
  
      await login.save();
  
      // Email notification to the teacher
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: teacher.email,
        subject: "Congratulations! You've been selected as a teacher",
        text: `
          Dear ${teacher.firstname} ${teacher.lastname},
  
          You have been selected as a teacher. Here are your login credentials:
  
          Email: ${teacher.email}
          Password: ${randomPassword}
  
          Assigned Subject: ${subjectassigned}
  
          Please log in to your account and start managing your responsibilities.
  
          Regards,
          Eduraa Team
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully: " + info.response);
        }
      });
  
      res.status(200).json({ message: "Teacher accepted and email sent!", teacher });
    } catch (error) {
      console.error("Error updating teacher status:", error);
      res.status(500).json({ error: "Failed to accept teacher" });
    }
  });
  

  // Delete a teacher
  router.delete("/teacherreject/:id", async (req, res) => {
    try {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting teacher" });
    }
  });

  // disable teacher

// Disable teacher (updates only Login model)
router.patch("/viewteachers/disable/:id", async (req, res) => {
  try {
    // Find the teacher in the Teacher model to get the email (optional)
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Update the status in the Login model based on the teacher's email
    const loginUpdate = await LoginModel.findOneAndUpdate(
      { email: teacher.email },
      { status: false }, // Assuming "status" is the field to disable the user
      { new: true }
    );

    if (!loginUpdate) {
      return res.status(404).json({ error: "Login record not found" });
    }

    res.status(200).json({ message: "Teacher disabled successfully in Login model", login: loginUpdate });
  } catch (error) {
    console.error("Error disabling teacher:", error);
    res.status(500).json({ error: "Failed to disable teacher" });
  }
});

// Activate teacher
router.patch("/viewteachers/activate/:id", async (req, res) => {
  try {
    // Find the teacher in the Teacher model to get the email
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Update the status in the Login model based on the teacher's email
    const loginUpdate = await LoginModel.findOneAndUpdate(
      { email: teacher.email },
      { status: true }, // Assuming "status" is the field to enable the user
      { new: true }
    );

    if (!loginUpdate) {
      return res.status(404).json({ error: "Login record not found" });
    }

    res.status(200).json({ message: "Teacher activated successfully in Login model", login: loginUpdate });
  } catch (error) {
    console.error("Error activating teacher:", error);
    res.status(500).json({ error: "Failed to activate teacher" });
  }
});



  // box component 
  router.get("/inactive-teachers", async (req, res) => {
    try {
      const inactiveTeachers = await Teacher.find({ active: false });
      res.json(inactiveTeachers);
    } catch (error) {
      console.error("Error fetching inactive teachers:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  //box active

  router.get("/active-teachers", async (req, res) => {
    try {
      const activeTeachers = await Teacher.find({ active: true });
      res.json(activeTeachers);
    } catch (error) {
      console.error("Error fetching active teachers:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Add this new route to update exam types
router.patch("/update-exam-types/:id", async (req, res) => {
  try {
    const { examTypes } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { examTypes },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    
    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error updating exam types:", error);
    res.status(500).json({ error: "Failed to update exam types" });
  }
});

// Get teacher's average rating
router.get("/teacher-rating/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Calculate average rating
    if (!teacher.feedback || teacher.feedback.length === 0) {
      return res.json({ 
        averageRating: 0,
        totalFeedbacks: 0
      });
    }

    const totalRating = teacher.feedback.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / teacher.feedback.length;

    res.json({
      averageRating,
      totalFeedbacks: teacher.feedback.length
    });
  } catch (error) {
    console.error('Error fetching teacher rating:', error);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

module.exports = router;

