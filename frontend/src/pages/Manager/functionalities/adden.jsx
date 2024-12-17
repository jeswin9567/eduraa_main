import React, { useState } from 'react';
import axios from 'axios';
import './adden.css';
import Header from '../../../components/manager/head';
import Footer from '../../../components/common/footer';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';

const MEntranceForm = () => {
  useAuth();

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
    state: '',
    examType: '',
  });

  const [showUGDegrees, setShowUGDegrees] = useState(false);
  const [showPGDegrees, setShowPGDegrees] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const examType = ['B.Tech','MBA','MCA','Medical','Law','Other'];
  const degreesUG = ['BSW', 'BSc', 'BCA', 'BCom', 'BA', 'BTech', 'Other UG Courses including Mathematics','General Nursing','Other'];
  const degreesPG = ['MSW', 'MSc', 'MCA', 'MCom', 'MA', 'MTech', 'Other PG Courses including Mathematics','Other'];
  const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    const newErrors = { ...errors };
    if (name === 'name') {
      const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
      const validCombination = /^[a-zA-Z0-9() ]+$/; // Alphabets, numbers, spaces, and parentheses
  
      if (value.trim() === '') {
          newErrors.name = 'Name cannot be empty or contain only spaces';
      } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
          newErrors.name = 'Name cannot consist of only numbers';
      } else if (!validCombination.test(value)) { 
          newErrors.name = 'Name can only contain alphabets, numbers, spaces, and parentheses';
      } else if (!/\d|\(|\)/.test(value) && !onlyAlphabets.test(value)) {
          newErrors.name = 'Only alphabets allowed if not using a combination';
      } else {
          delete newErrors.name; // Clear errors
      }
  }
    
  if (name === 'details') {
    const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
    const validCombination = /^[a-zA-Z0-9(),. ]+$/; // Alphabets, numbers, commas, periods, and spaces

    if (value.trim() === '') {
        newErrors.details = 'Details cannot be empty or contain only spaces';
    } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
        newErrors.details = 'Details cannot consist of only numbers';
    } else if (!validCombination.test(value)) { 
        newErrors.details = 'Details can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
    } else if (!/[\d(),.]/.test(value) && !onlyAlphabets.test(value)) {
        newErrors.details = 'Only alphabets allowed if not using a combination';
    } else {
        delete newErrors.details; // Clear errors
    }
}
 

    if (
      name === 'marksGeneral' &&
      (!/^(0|[1-9][0-9]?|100)$/.test(value))
    ) {
      newErrors.marksGeneral = 'Marks for General Category must be a number between 0 and 100 without leading zeros or invalid repetitions';
    } else {
      delete newErrors.marksGeneral;
    }
    
    if (name === 'marksBackward' && (!/^(0|[1-9][0-9]?|100)$/.test(value))){
      newErrors.marksBackward = 'Marks should be a number between 0 and 100'
    }
    else {
      delete newErrors.marksBackward;
    }

    if (name === 'syllabus') {
      const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
      const validCombination = /^[a-zA-Z0-9(),. ]+$/; // Alphabets, numbers, commas, periods, and spaces
  
      if (value.trim() === '') {
          newErrors.syllabus = 'Syllabus cannot be empty or contain only spaces';
      } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
          newErrors.syllabus = 'Syllabus cannot consist of only numbers';
      } else if (!validCombination.test(value)) { 
          newErrors.syllabus = 'Syllabus can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
      } else if (!/[\d(),.]/.test(value) && !onlyAlphabets.test(value)) {
          newErrors.syllabus = 'Only alphabets allowed if not using a combination';
      } else {
          delete newErrors.syllabus; // Clear errors
      }
  }
  
    
  if (name === 'howtoapply') {
    const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
    const validCombination = /^[a-zA-Z0-9(),. ]+$/; // Alphabets, numbers, commas, periods, and spaces

    if (value.trim() === '') {
        newErrors.howtoapply = 'How to Apply cannot be empty or contain only spaces';
    } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
        newErrors.howtoapply = 'How to Apply cannot consist of only numbers';
    } else if (!validCombination.test(value)) { 
        newErrors.howtoapply = 'How to Apply can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
    } else if (!/[\d(),.]/.test(value) && !onlyAlphabets.test(value)) {
        newErrors.howtoapply = 'Only alphabets allowed if not using a combination';
    } else {
        delete newErrors.howtoapply; // Clear errors
    }
}

    

    if (name === 'link' && !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/.test(value)) {
      newErrors.link = 'Please enter a valid link';
    } else {
      delete newErrors.link;
    }

    if (name === 'startdate') {
      const currentYear = new Date().getFullYear();
      const selectedStartDate = new Date(value);
      if (selectedStartDate.getFullYear() !== currentYear) {
        newErrors.startdate = 'Start date must be within the current year';
      } else {
        delete newErrors.startdate;
      }
    }
  
    if (name === 'enddate') {
      const selectedEndDate = new Date(value);
      const selectedStartDate = new Date(formData.startdate);
      if (selectedEndDate < selectedStartDate) {
        newErrors.enddate = 'End date must not be before the start date';
      } else {
        delete newErrors.enddate;
      }
    }

    setErrors(newErrors);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDegreeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        degree: [...formData.degree, value]
      });
    } else {
      setFormData({
        ...formData,
        degree: formData.degree.filter((degree) => degree !== value)
      });
    }
  };

  const handleEducationChange = (e) => {
    const selectedEducation = e.target.value;
    setFormData({
      ...formData,
      education: selectedEducation,
      degree: [] // Clear degrees if education changes
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/entrnc', formData);
      console.log(response.data);
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
        examType:'' 
      });
      navigate('/manager/entrance');
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="maddentracn">
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
              <label>Select Undergraduate Degrees:</label>
              {degreesUG.map((degree) => (
                <div key={degree}>
                  <input
                    type="checkbox"
                    name="degree"
                    value={degree}
                    onChange={handleDegreeChange}
                  />
                  <label>{degree}</label>
                </div>
              ))}
              {errors.degree && <p className="error">{errors.degree}</p>}
            </div>
          )}

          {showPGDegrees && (
            <div>
              <label>Select Postgraduate Degrees:</label>
              {degreesPG.map((degree) => (
                <div key={degree}>
                  <input
                    type="checkbox"
                    name="degree"
                    value={degree}
                    onChange={handleDegreeChange}
                  />
                  <label>{degree}</label>
                </div>
              ))}
              {errors.degree && <p className="error">{errors.degree}</p>}
            </div>
          )}
          <div>
            <label>Select State:</label>
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

          <div>
            <label>Marks (General Category):</label>
            <input
              type="text"
              name="marksGeneral"
              value={formData.marksGeneral}
              onChange={handleChange}
              required
            />
            {errors.marksGeneral && <p className="error">{errors.marksGeneral}</p>}
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
            {errors.marksBackward && <p className="error">{errors.marksBackward}</p>}
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
            {errors.startdate && <p className="error">{errors.startdate}</p>}
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
            {errors.enddate && <p className='error'>{errors.enddate}</p>}
          </div>

          <div>
            <label>How to Apply:</label>
            <textarea
              name="howtoapply"
              value={formData.howtoapply}
              onChange={handleChange}
              required
            />
            {errors.howtoapply && <p className="error">{errors.howtoapply}</p>}
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

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default MEntranceForm;
