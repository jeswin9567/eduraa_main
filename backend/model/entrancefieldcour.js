const mongoose = require("mongoose");

const fieldCoursesSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: [
      "Engineering",
      "Medical & Healthcare",
      "Management",
      "Law",
      "Arts & Humanities",
    ],
    required: true,
    unique: true, // Ensure each field is stored only once
  },
  courses: {
    type: [String], // List of courses under this field
    required: true,
  },
});

const FieldCourses = mongoose.model("FieldCourses", fieldCoursesSchema);

module.exports = FieldCourses;
