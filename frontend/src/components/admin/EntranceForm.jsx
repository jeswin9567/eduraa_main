import React, { useState, useRef } from 'react';
import axios from 'axios';
import './EntranceForm.css';
import Header from './headd';
import Footer from '../common/footer';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const EntranceForm = () => {
  useAuth();
  const footerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    details: '',
    education: '',
    degree: [], 
    marksGeneral: '',
    marksBackward: '',
    syllabus: '',
    startdate: '',
    enddate: '',
    howtoapply: '',
    link: '',
    state: '', // Add this for the state
    examType: '',
  });

  const [showUGDegrees, setShowUGDegrees] = useState(false);
  const [showPGDegrees, setShowPGDegrees] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const degreesUG = ['BA', 'BSW', 'BSc', 'BCA', 'BCom', 'BTech', 'Other UG courses including mathematics','General Nursing','other'];
  const degreesPG = ['MA', 'MSW', 'MSc', 'MCA', 'MCom', 'MTech', 'Other PG courses Including mathematics','other'];
  const examType = ['B.Tech','MBA','MCA','Medical','Law','Other'];
  const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const handleDegreeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        degree: [...formData.degree, value],
      });
    } else {
      setFormData({
        ...formData,
        degree: formData.degree.filter((degree) => degree !== value),
      });
    }

    validateField('degree', formData.degree);
  };

  const handleEducationChange = (e) => {
    const selectedEducation = e.target.value;
    setFormData({
      ...formData,
      education: selectedEducation,
      degree: [], // Clear degrees if education changes
    });

    if (selectedEducation === 'Undergraduate') {
      setShowUGDegrees(true);
      setShowPGDegrees(false);
    } else if (selectedEducation === 'Postgraduate') {
      setShowUGDegrees(false);
      setShowPGDegrees(true);
    } else {
      setShowUGDegrees(false);
      setShowPGDegrees(false);
    }

    validateField('education', selectedEducation);
  };

  // Validation for individual field
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    // Name validation
    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = 'Name is required';
      } else if (value.length < 3) {
        newErrors.name = 'Name must be at least 3 characters long';
      } else {
        delete newErrors.name;
      }
    }

    // Details validation
    if (name === 'details') {
      if (!value.trim()) {
        newErrors.details = 'Details are required';
      } else if (value.length < 10) {
        newErrors.details = 'Details must be at least 10 characters long';
      } else {
        delete newErrors.details;
      }
    }

    // Marks validation
    if (name === 'marksGeneral') {
      if (!value.trim()) {
        newErrors.marksGeneral = 'Marks for General Category are required';
      } else if (isNaN(value) || value < 0 || value > 100) {
        newErrors.marksGeneral = 'Marks for General Category must be a number between 0 and 100';
      } else {
        delete newErrors.marksGeneral;
      }
    }

    if (name === 'marksBackward') {
      if (!value.trim()) {
        newErrors.marksBackward = 'Marks for Backward Category are required';
      } else if (isNaN(value) || value < 0 || value > 100) {
        newErrors.marksBackward = 'Marks for Backward Category must be a number between 0 and 100';
      } else {
        delete newErrors.marksBackward;
      }
    }

    // Syllabus validation
    if (name === 'syllabus') {
      if (!value.trim()) {
        newErrors.syllabus = 'Syllabus is required';
      } else {
        delete newErrors.syllabus;
      }
    }

    // Link validation
    if (name === 'link') {
      const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$',
        'i'
      );

      if (!value.trim()) {
        newErrors.link = 'Link is required';
      } else if (!urlPattern.test(value)) {
        newErrors.link = 'Link must be a valid URL';
      } else {
        delete newErrors.link;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure final form validation on submit
    if (!validateForm()) return; 

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/entrnc`, formData);
      alert('Entrance details entered successfully');
      setFormData({
        name: '',
        details: '',
        education: '',
        degree: [],
        marksGeneral: '',
        marksBackward: '',
        syllabus: '',
        startdate: '',
        enddate: '',
        howtoapply: '',
        link: '',
        state: '',
        examType: ''
      });
      navigate('/admin/entrance');
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to footer
  const srollToFooter = () => {
    if (footerRef.current)
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header scrollToContact={srollToFooter} />
      <div className="adminentranceadd">
        <h2>Submit an Entrance</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <label>Details:</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
            />
            {errors.details && <p className="error">{errors.details}</p>}
          </div>

          {/* Exam Type */}
          <div>
            <label>Exam Type:</label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              required
            >
              <option value="">Select Exam Type</option>
              {examType.map((examType) => (
                <option key={examType} value={examType}>
                  {examType}
                </option>
              ))}
            </select>
            {errors.examType && <p className="error">{errors.examType}</p>}
          </div>

          <div>
            <label>Education:</label>
            <select
              name="education"
              value={formData.education}
              onChange={handleEducationChange}
              required
            >
              <option value="">Select Education</option>
              <option value="10">10th</option>
              <option value="+2">12th</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
            {errors.education && <p className="error">{errors.education}</p>}
          </div>

          {showUGDegrees && (
            <div>
              <label>UG Degree:</label>
              {degreesUG.map((degree) => (
                <div key={degree}>
                  <input
                    type="checkbox"
                    name="degree"
                    value={degree}
                    checked={formData.degree.includes(degree)}
                    onChange={handleDegreeChange}
                  />
                  {degree}
                </div>
              ))}
            </div>
          )}

          {showPGDegrees && (
            <div>
              <label>PG Degree:</label>
              {degreesPG.map((degree) => (
                <div key={degree}>
                  <input
                    type="checkbox"
                    name="degree"
                    value={degree}
                    checked={formData.degree.includes(degree)}
                    onChange={handleDegreeChange}
                  />
                  {degree}
                </div>
              ))}
            </div>
          )}

          <div>
            <label>Marks (General Category):</label>
            <input
              type="text"
              name="marksGeneral"
              value={formData.marksGeneral}
              onChange={handleChange}
              required
            />
            {errors.marksGeneral && (
              <p className="error">{errors.marksGeneral}</p>
            )}
          </div>

          <div>
            <label>Marks (Backward Category):</label>
            <input
              type="text"
              name="marksBackward"
              value={formData.marksBackward}
              onChange={handleChange}
              required
            />
            {errors.marksBackward && (
              <p className="error">{errors.marksBackward}</p>
            )}
          </div>

          <div>
            <label>Syllabus:</label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              required
            />
            {errors.syllabus && <p className="error">{errors.syllabus}</p>}
          </div>

          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>How to Apply:</label>
            <textarea
              name="howtoapply"
              value={formData.howtoapply}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Link:</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
            />
            {errors.link && <p className="error">{errors.link}</p>}
          </div>

          <div>
            <label>State:</label>
            <select
              name="state"
              value={formData.state}
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
            {errors.state && <p className="error">{errors.state}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <Footer ref={footerRef} />
    </>
  );
};

export default EntranceForm;
