const express = require("express");
const router = express.Router();
const FieldCourses = require("../model/entrancefieldcour");
const Teacher = require("../model/Teacher");

// Route to add field courses
router.post("/addfield", async (req, res) => {
  try {
    const { field, courses } = req.body;

    if (!field || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: "Field and courses are required" });
    }

    // Check if the field already exists
    let fieldCourse = await FieldCourses.findOne({ field });

    if (fieldCourse) {
      return res.status(400).json({ message: "Field already exists" });
    }

    // Create and save new field course
    fieldCourse = new FieldCourses({ field, courses });
    await fieldCourse.save();

    res.status(201).json({ message: "Field courses added successfully", fieldCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding field courses", error });
  }
});

// update

router.put("/updatefield/:field", async (req, res) => {
    try {
      const { field } = req.params;
      const { courses } = req.body;
  
      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ message: "Courses array is required" });
      }
  
      // Find and update the field courses
      const updatedFieldCourse = await FieldCourses.findOneAndUpdate(
        { field },
        { $set: { courses } },
        { new: true }
      );
  
      if (!updatedFieldCourse) {
        return res.status(404).json({ message: "Field not found" });
      }
  
      res.status(200).json({ message: "Field courses updated successfully", updatedFieldCourse });
    } catch (error) {
      res.status(500).json({ message: "Error updating field courses", error });
    }
  });

  router.get("/getfields", async (req, res) => {
    try {
      const fields = await FieldCourses.find({}, "field");
      res.status(200).json(fields.map((f) => f.field));
    } catch (error) {
      res.status(500).json({ message: "Error fetching fields", error });
    }
  });
  
  // Route to get field courses by field name
  router.get("/getfield/:field", async (req, res) => {
    try {
      const { field } = req.params;
      const fieldCourse = await FieldCourses.findOne({ field });
  
      if (!fieldCourse) {
        return res.status(404).json({ message: "Field not found" });
      }
  
      res.status(200).json(fieldCourse);
    } catch (error) {
      res.status(500).json({ message: "Error fetching field courses", error });
    }
  });

module.exports = router;
