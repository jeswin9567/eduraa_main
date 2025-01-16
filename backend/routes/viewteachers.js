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
        res.status(200).json(teachers);
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
      const { active } = req.body;
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { active },
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
        password: randomPassword, // Store the generated password
        role: "teacher",
      });
  
      await login.save();
  
      // Send email notification to the teacher
      const mailOptions = {
        from: "your-email@gmail.com",
        to: teacher.email,
        subject: "Congratulations! You have been selected as a teacher.",
        text: `Dear ${teacher.firstname} ${teacher.lastname},\n\nYou have been selected as a teacher. Your login details are as follows:\n\nEmail: ${teacher.email}\nPassword: ${randomPassword}\n\nPlease use these details to log in to your account.\n\nBest regards,\nYour Team`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
  
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Error updating teacher status" });
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

  router.patch("/viewteachers/disable/:id", async (req, res) => {
    try {
      const teacher = await Teacher.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
  
      // Update status in Login model
      await LoginModel.findOneAndUpdate({ email: teacher.email }, { status: false });
  
      res.status(200).json({ message: "Teacher disabled successfully", teacher });
    } catch (error) {
      console.error("Error disabling teacher:", error);
      res.status(500).json({ error: "Failed to disable teacher" });
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
  

module.exports = router;

