const express = require("express");
const upload = require("../config/multerStorage");
const Teacher = require("../model/Teacher");

const router = express.Router();

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