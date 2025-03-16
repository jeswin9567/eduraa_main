import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import './teacher.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaBook, FaGraduationCap, FaFileAlt } from 'react-icons/fa';


const TeacherRegistration = () => {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    dateofbirth: "",
    idCard: null,
    photo: null,
    degreeCertificate: null,
    experienceCertificate: null,
    resume: null,
    subjects: "",
    altPhone: "",
    qualification: "",
    specialization: "",
    experience: "",
    declaration: false,
  });

  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false); // State for displaying the modal
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstname":
        if (!value.trim()) {
          error = "First name is required.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "First name can only contain alphabets.";
        }
        break;
      case "lastname":
        if (!value.trim()) {
          error = "Last name is required.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Last name can only contain alphabets.";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email address.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone is required.";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";
        }
        break;
      case "gender":
        if (!value) {
          error = "Gender is required.";
        }
        break;
      case "dateofbirth":
        if (!value) {
          error = "Date of birth is required.";
        } else {
          const today = new Date();
          const dob = new Date(value);
          if (dob > today) {
            error = "Date of birth cannot be in the future.";
          }
        }
        break;
        case "altPhone":
  if (value && !/^[6-9]\d{9}$/.test(value)) {
    error = "Alternative phone must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.";
  }
  break;

case "qualification":
  if (!value) {
    error = "Please select your highest qualification.";
  }
  break;

case "specialization":
  if (!value.trim()) {
    error = "Specialization cannot be empty.";
  }
  break;

case "experience":
  if (!value || isNaN(value) || value <= 0) {
    error = "Please enter a valid number of years of experience.";
  }
  break;


case "declaration":
  if (!value) {
    error = "You must accept the terms and conditions.";
  }
  break;

        case "subjects":
  if (!value) {
    error = "Please select a subject.";
  }
  break;

      case "address":
        if (!value.trim()) {
          error = "Address is required.";
        } else if (/[^a-zA-Z.,\s]/.test(value)) {
          error = "Address must be in the correct format.";
        }
        break;
        case "photo":
          if (!value) {
            error = "Photo is required.";
          } else if (value.type !== "image/jpeg") {
            error = "Only JPG files are allowed.";
          } else if (value.size > 2 * 1024 * 1024) {
            error = "File size should not exceed 2MB.";
          }
          break;
        case "idCard":
            case "degreeCertificate":
            case "experienceCertificate":
            case "resume":
              if (!value) {
                error = `${name.replace(/([A-Z])/g, " $1")} is required.`; // Convert camelCase to spaced words
              } else if (value && value.name && value.name.split('.').pop().toLowerCase() !== 'pdf') {
                error = `${name.replace(/([A-Z])/g, " $1")} must be a PDF file.`;
              }
              break;            
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      axios.post(`${import.meta.env.VITE_API_URL}/api/teachers/register`, formDataToSend)
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              title: 'Success!',
              text: 'Teacher registered successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              navigate('/teacher-dashboard');
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.data.message || 'An unexpected error occurred.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  };
  

  return (
    <div className="teachreg-container">
      <div className="teachreg-header">
        <h1>Join Our Teaching Team</h1>
        <p>Share your knowledge and inspire the next generation</p>
      </div>

      <form onSubmit={handleSubmit} className="teachreg-form">
        <div className="form-sections">
          {/* Personal Information Section */}
          <div className="form-section">
            <h2><FaUser /> Personal Information</h2>
            <div className="input-grid">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                {errors.firstname && <span className="error">{errors.firstname}</span>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                {errors.lastname && <span className="error">{errors.lastname}</span>}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>

            <div className="gender-group">
              <label>Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Female
                </label>
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="form-section">
            <h2><FaGraduationCap /> Professional Details</h2>
            <div className="input-grid">
              <div className="input-group">
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>Select Qualification</option>
                  <option value="B.Ed">B.Ed</option>
                  <option value="M.Ed">M.Ed</option>
                  <option value="PhD">PhD</option>
                </select>
                {errors.qualification && <span className="error">{errors.qualification}</span>}
              </div>

              <div className="input-group">
                <select
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
                {errors.subjects && <span className="error">{errors.subjects}</span>}
              </div>

              <div className="input-group full-width">
                <textarea
                  placeholder="Specialization Areas"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
                {errors.specialization && <span className="error">{errors.specialization}</span>}
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="form-section">
            <h2><FaFileAlt /> Document Upload</h2>
            <div className="upload-grid">
              <div className="upload-group">
                <label>Profile Photo (JPG)</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg"
                  onChange={handleChange}
                  className="file-input"
                />
                {errors.photo && <span className="error">{errors.photo}</span>}
              </div>

              <div className="upload-group">
                <label>ID Card (PDF)</label>
                <input
                  type="file"
                  name="idCard"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="file-input"
                />
                {errors.idCard && <span className="error">{errors.idCard}</span>}
              </div>

              <div className="upload-group">
                <label>Degree Certificate (PDF)</label>
                <input
                  type="file"
                  name="degreeCertificate"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="file-input"
                />
                {errors.degreeCertificate && <span className="error">{errors.degreeCertificate}</span>}
              </div>

              <div className="upload-group">
                <label>Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="file-input"
                />
                {errors.resume && <span className="error">{errors.resume}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <label className="declaration-label">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
            />
            <span className="checkbox-custom"></span>
            I agree to the <span className="terms-link" onClick={() => setShowTerms(true)}>terms and conditions</span>
          </label>
          {errors.declaration && <span className="error">{errors.declaration}</span>}

          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>

      {showTerms && (
        <div className="terms-modal">
          <div className="modal-content">
            <h2>Terms and Conditions</h2>
            <p>
              As a teacher on the Eduraa platform, you agree to the following:
            </p>
            <ul>
              <li>Complete the training period as per guidelines.</li>
              <li>Upload classes and schedule live sessions as per deadlines.</li>
              <li>Maintain professionalism during interactions with students.</li>
              <li>Adhere to the platform's content standards and guidelines.</li>
              <li>Provide accurate and truthful information during registration.</li>
            </ul>
            <p>
              Failing to meet these terms may result in termination of your account.
            </p>
            <button onClick={() => setShowTerms(false)} className="modal-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRegistration;
