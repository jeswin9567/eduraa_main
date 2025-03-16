import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VEHeader from "../aviewservicehead/aenhead";
import "./upent.css"; // Update your CSS file name if necessary
import useAuth from "../../../../function/useAuth";

const UpdateEntrance = () => {
  useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrance, setEntrance] = useState({
    name: "",
    details: "",
    education: "",
    degree: [], // Array for selected degrees
    marksGeneral: "",
    marksBackward: "",
    syllabus: "",
    howtoapply: "",
    link: "",
    startdate: "",
    enddate: "",
    state:'',
    examType: '',
  });

  const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  const examType = ['B.Tech','MBA','MCA','Medical','Law','Other'];
  useEffect(() => {
    const fetchEntranceDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/viewentr/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch entrance details");
        }
        const data = await response.json();
        setEntrance(data);
      } catch (error) {
        console.error("Error fetching entrance details:", error);
        alert("Could not fetch entrance details. Please try again later.");
      }
    };

    fetchEntranceDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the changed field is education
    if (name === "education") {
      // Reset degrees if the education level changes
      setEntrance((prev) => ({
        ...prev,
        education: value,
        degree: [], // Reset degree selections
      }));
    } else {
      setEntrance((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDegreeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEntrance((prev) => ({
        ...prev,
        degree: [...prev.degree, value],
      }));
    } else {
      setEntrance((prev) => ({
        ...prev,
        degree: prev.degree.filter((deg) => deg !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upentr/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entrance),
      });

      if (response.ok) {
        alert("Entrance updated successfully");
        navigate(`/admin/entrance`);
      } else {
        const errorMessage = await response.text();
        alert(`Failed to update the entrance: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating entrance:", error);
      alert("Could not update entrance. Please try again later.");
    }
  };

  return (
    <div>
      <VEHeader />
      <div className="adupdentr">
        <h1>Update Entrance Details</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={entrance.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <textarea
            name="details"
            value={entrance.details}
            onChange={handleChange}
            placeholder="Details"
            required
          />
                    {/* State Selection */}
                    <label>Exam Type</label>
          <select
            name="examType"
            value={entrance.examType}
            onChange={handleChange}
            required
          >
            <option value="">Exam Type</option>
            {examType.map((examType) => (
              <option key={examType} value={examType}>
                {examType}
              </option>
            ))}
          </select>
          <select
            name="education"
            value={entrance.education}
            onChange={handleChange}
            required
          >
            <option value="">Select Education Level</option>
            <option value="10">Class 10</option>{" "}
            {/* Added Class 10 option */}
            <option value="+2">Class 12</option>{" "}
            {/* Added Class 12 option */}
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
          <div>
            <label>Select Degrees:</label>
            {entrance.education === "Undergraduate" && (
              <>
                <div>
                  <input
                    type="checkbox"
                    value="BSW"
                    checked={entrance.degree.includes("BSW")}
                    onChange={handleDegreeChange}
                  />
                  <label>BSW</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="Other UG Courses including Mathematics"
                    checked={entrance.degree.includes(
                      "Other UG Courses including Mathematics"
                    )}
                    onChange={handleDegreeChange}
                  />
                  <label>Other UG Courses including Mathematics</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="BSc"
                    checked={entrance.degree.includes("BSc")}
                    onChange={handleDegreeChange}
                  />
                  <label>BSc</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="BCA"
                    checked={entrance.degree.includes("BCA")}
                    onChange={handleDegreeChange}
                  />
                  <label>BCA</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="BCom"
                    checked={entrance.degree.includes("BCom")}
                    onChange={handleDegreeChange}
                  />
                  <label>BCom</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="BA"
                    checked={entrance.degree.includes("BA")}
                    onChange={handleDegreeChange}
                  />
                  <label>BA</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="BTech"
                    checked={entrance.degree.includes("BTech")}
                    onChange={handleDegreeChange}
                  />
                  <label>BTech</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="other"
                    checked={entrance.degree.includes("other")}
                    onChange={handleDegreeChange}
                  />
                  <label>Other</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="General Nursing"
                    checked={entrance.degree.includes("General Nursing")}
                    onChange={handleDegreeChange}
                  />
                  <label>General Nursing</label>
                </div>
              </>
            )}
            {entrance.education === "Postgraduate" && (
              <>
                <div>
                  <input
                    type="checkbox"
                    value="MSW"
                    checked={entrance.degree.includes("MSW")}
                    onChange={handleDegreeChange}
                  />
                  <label>MSW</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    value="MSc"
                    checked={entrance.degree.includes("MSc")}
                    onChange={handleDegreeChange}
                  />
                  <label>MSc</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="MCA"
                    checked={entrance.degree.includes("MCA")}
                    onChange={handleDegreeChange}
                  />
                  <label>MCA</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="MCom"
                    checked={entrance.degree.includes("MCom")}
                    onChange={handleDegreeChange}
                  />
                  <label>MCom</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="MA"
                    checked={entrance.degree.includes("MA")}
                    onChange={handleDegreeChange}
                  />
                  <label>MA</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="MTech"
                    checked={entrance.degree.includes("MTech")}
                    onChange={handleDegreeChange}
                  />
                  <label>MTech</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    value="Other PG Courses including Mathematics"
                    checked={entrance.degree.includes(
                      "Other PG Courses including Mathematics"
                    )}
                    onChange={handleDegreeChange}
                  />
                  <label>Other PG Courses including Mathematics</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="other"
                    checked={entrance.degree.includes("other")}
                    onChange={handleDegreeChange}
                  />
                  <label>other</label>
                </div>
              </>
            )}
          </div>
          <label>Marks for General</label>
          <input
            type="text"
            name="marksGeneral"
            value={entrance.marksGeneral}
            onChange={handleChange}
            placeholder="Marks for General Category"
            required
          />
          <label>Marks for Backward Categories</label>
          <input
            type="text"
            name="marksBackward"
            value={entrance.marksBackward}
            onChange={handleChange}
            placeholder="Marks for Backward Category"
            required
          />
          {/* State Selection */}
          <label>Select State</label>
          <select
            name="state"
            value={entrance.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <label>Syllabus</label>
          <textarea
            type="text"
            name="syllabus"
            value={entrance.syllabus}
            onChange={handleChange}
            placeholder="Syllabus"
            required
          />
          <label>How to apply</label>
          <textarea
            type="text"
            name="howtoapply"
            value={entrance.howtoapply}
            onChange={handleChange}
            placeholder="How to Apply"
            required
          />
          <label>Link</label>
          <input
            type="url"
            name="link" // Corrected to match the state property
            value={entrance.link}
            onChange={handleChange}
            placeholder="Link"
            required
          />

          <label>Start date</label>
          <input
            type="date"
            name="startdate"
            value={entrance.startdate.split("T")[0]}
            onChange={handleChange}
            required
          />
          <label>End Date</label>
          <input
            type="date"
            name="enddate"
            value={entrance.enddate.split("T")[0]}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Entrance</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEntrance;
