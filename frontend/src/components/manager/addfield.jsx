import React, { useState } from "react";
import axios from "axios";

const AddFieldCourses = () => {
  const [fields] = useState([
    "Engineering",
    "Medical & Healthcare",
    "Management",
    "Law",
    "Arts & Humanities",
  ]);
  const [selectedField, setSelectedField] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Predefined subjects list
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedField || selectedCourses.length === 0) {
      alert("Please select a field and at least one course.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/entrancefield/addfield`, {
        field: selectedField,
        courses: selectedCourses,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding field courses:", error);
      alert("Failed to add field courses.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Add Field Courses</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Field */}
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Choose a Field:</label>
        <select
          onChange={(e) => setSelectedField(e.target.value)}
          value={selectedField}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select a Field</option>
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>

        {/* Select Courses */}
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Select Courses:</label>
        <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
          {subjects.map((subject) => (
            <div key={subject} style={{ marginBottom: "5px" }}>
              <input
                type="checkbox"
                value={subject}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCourses((prev) =>
                    prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
                  );
                }}
                style={{ marginRight: "5px" }}
              />
              {subject}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}>
          Add Field Courses
        </button>
      </form>
    </div>
  );
};

export default AddFieldCourses;
