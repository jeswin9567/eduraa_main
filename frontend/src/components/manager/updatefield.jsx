import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateFieldCourses = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);

  // Predefined subjects list
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science",
  ];

  // Fetch available fields from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/entrancefield/getfields") // Endpoint to fetch fields
      .then((response) => setFields(response.data))
      .catch((error) => console.error("Error fetching fields:", error));
  }, []);

  // Fetch existing courses when a field is selected
  useEffect(() => {
    if (selectedField) {
      axios
        .get(`http://localhost:5000/api/entrancefield/getfield/${selectedField}`)
        .then((response) => {
          setExistingCourses(response.data.courses);
          setSelectedCourses(response.data.courses);
        })
        .catch((error) => console.error("Error fetching field courses:", error));
    }
  }, [selectedField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedField || selectedCourses.length === 0) {
      alert("Please select a field and at least one course.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/entrancefield/updatefield/${selectedField}`, {
        courses: selectedCourses,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating field courses:", error);
      alert("Failed to update field courses.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Update Field Courses</h2>
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
                checked={selectedCourses.includes(subject)}
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
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}>
          Update Field Courses
        </button>
      </form>
    </div>
  );
};

export default UpdateFieldCourses;
    