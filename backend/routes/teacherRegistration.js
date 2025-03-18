const express = require("express");
const upload = require("../config/multerStorage");
const Teacher = require("../model/Teacher");
const nodemailer = require('nodemailer'); // package to sent email
const dotenv = require('dotenv');

dotenv.config()

const router = express.Router();

// configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/register", upload.fields([
  { name: "idCard", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "experienceCertificate", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]), async (req, res) => {
  try {
    const { firstname, lastname, email, phone, gender, dateofbirth, address, subjects,altPhone,qualification,specialization, experience } = req.body;
    const files = req.files; // Files uploaded by Multer
    
    // Save the uploaded file URLs from Cloudinary
    const teacher = new Teacher({
      firstname,
      lastname,
      email,
      phone,
      altPhone,
      gender,
      dateofbirth,
      address,
      subjects,
      qualification,
      experience,
      specialization,
      idCard: files.idCard[0].path,
      photo: files.photo[0].path,
      degreeCertificate: files.degreeCertificate[0].path,
      experienceCertificate: files.experienceCertificate[0].path,
      resume: files.resume[0].path,
    });

    await teacher.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Teacher Registration successful',
      text: `Hello, ${firstname},\n\nYour registration as a teacher was successful! We are thrilled to have you on board.\n\nBest regards,\nThe Eduraa Team`
    };

    transporter.sendMail(mailOptions,(error, info) => {
      if (error) {
        console.log('Error sending email:' ,error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({
        success: true,  // Add the success flag
        message: "Teacher registration successful",
        teacher: teacher, // Include the teacher details in response
      });
      
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error during registration", error });
  }
});

module.exports = router;