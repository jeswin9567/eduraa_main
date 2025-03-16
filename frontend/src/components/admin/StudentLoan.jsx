import React, { useState, useRef } from 'react';
import './StudentLoan.css';
import axios from 'axios';
import Header from './headd';
import Footer from '../common/footer';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const fieldOfStudyOptions = [
  'Engineering', 'Medicine', 'Business', 'Law', 'Arts', 'Science', 'Technology'
];

const StudentLoanForm = () => {
  useAuth();
  const footerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    loanName: '',
    bankName: '',
    bankWebsite: '',
    contactNumber: '',
    email: '',
    loanType: '',
    fieldOfStudy: [],
    repayment: '',
    minAmount: '',
    maxAmount: '',
    minInterestRate: '',
    maxInterestRate: '',
    collateral: '',
    applicationProcess: '',
    eligibilityCriteria: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (name, value) => {
    let error = '';

    switch (name) {
      case 'loanName':
      case 'bankName':
              if (!/^[a-zA-Z0-9() ]+$/.test(value)) {
        error = 'Name can only contain letters, numbers, and ().';
      } else if (!/[a-zA-Z]/.test(value)) {
        error = 'Name must contain at least one letter.';
      } else if (!value.trim()) {
        error = 'Name is required.';
      }
        break;
      case 'bankWebsite':
        if (!/^https?:\/\/\S+$/.test(value)) error = 'Enter a valid URL';
        break;
      case 'contactNumber':
        if (!/^[6-9]\d{9}$/.test(value)) error = 'Enter a valid 10-digit contact number';
        break;
      case 'email':
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Enter a valid email address';
        break;
      case 'minAmount':
      case 'maxAmount':
        if (value <= 0) error = 'Amount must be positive';
        break;
      case 'minInterestRate':
      case 'maxInterestRate':
        if (isNaN(value) || value <= 0 || value > 100) error = 'Interest rate must be between 0 and 100';
        break;
        case 'collateral':
          case 'eligibilityCriteria':
          case 'applicationProcess':
            if (!/^[a-zA-Z0-9() ]+$/.test(value)) {
              error = 'Name can only contain letters, numbers, and ().';
            } else if (!/[a-zA-Z]/.test(value)) {
              error = 'Name must contain at least one letter.';
            } else if (!value.trim()) {
              error = 'Name is required.';
            }
            break;
      case 'repayment':
        if (value.trim() === '') error = 'This field is required';
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'fieldOfStudy') {
      // Handle multiple checkbox selections for fieldOfStudy
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          fieldOfStudy: [...prevData.fieldOfStudy, value]
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          fieldOfStudy: prevData.fieldOfStudy.filter((field) => field !== value)
        }));
      }
    } else {
      const error = validate(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/studln`, formData);
        console.log(response.data);
        alert('Student loan submitted successfully');
        setFormData({
          loanName: '',
          bankName: '',
          bankWebsite: '',
          contactNumber: '',
          email: '',
          loanType: '',
          fieldOfStudy: [],
          repayment: '',
          minAmount: '',
          maxAmount: '',
          minInterestRate: '',
          maxInterestRate: '',
          collateral: '',
          applicationProcess: '',
          eligibilityCriteria: ''
        });
        navigate('/admin/loan');
      } catch (error) {
        console.error(error);
        alert('Error submitting loan: ' + (error.response?.data?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fix the errors before submitting');
    }
  };

  return (
    <>
      <Header scrollToContact={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <div className="formdata">
        <h2>Submit a Student Loan</h2>
        <form onSubmit={handleSubmit}>
          <div className="namefld">
            <label>Loan Name:</label>
            <input
              type="text"
              name="loanName"
              value={formData.loanName}
              onChange={handleChange}
              required
            />
            {errors.loanName && <span className="error">{errors.loanName}</span>}
          </div>
          <div className="bankfld">
            <label>Bank Name:</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
            {errors.bankName && <span className="error">{errors.bankName}</span>}
          </div>
          <div className="bankwebsitefld">
            <label>Bank Website Link:</label>
            <input
              type="url"
              name="bankWebsite"
              value={formData.bankWebsite}
              onChange={handleChange}
              required
            />
            {errors.bankWebsite && <span className="error">{errors.bankWebsite}</span>}
          </div>
          <div className="contactfld">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
          </div>
          <div className="emailfld">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="loantypefld">
            <label>Type of Loan:</label>
            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              required
            >
              <option value="">Select Loan Type</option>
              <option value="domestic">Domestic Loan</option>
              <option value="international">International Loan</option>
            </select>
            {errors.loanType && <span className="error">{errors.loanType}</span>}
          </div>
          <div className="fieldoffld">
            <label>Field of Study:</label>
            <div className="uplon-checkbox-group">
              {fieldOfStudyOptions.map((field) => (
                <label key={field} className="uplon-checkbox-label">
                  <input
                    type="checkbox"
                    name="fieldOfStudy"
                    value={field}
                    checked={formData.fieldOfStudy.includes(field)}
                    onChange={handleChange}
                  />
                  {field}
                </label>
              ))}
            </div>
          </div>
          <div className="repayment">
            <label>Repayment:</label>
            <input
              type="text"
              name="repayment"
              value={formData.repayment}
              onChange={handleChange}
              required
            />
            {errors.repayment && <span className="error">{errors.repayment}</span>}
          </div>
          <div className="amountfld">
            <label>Minimum Amount:</label>
            <input
              type="number"
              name="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              required
            />
            {errors.minAmount && <span className="error">{errors.minAmount}</span>}
          </div>
          <div className="amountfld">
            <label>Maximum Amount:</label>
            <input
              type="number"
              name="maxAmount"
              value={formData.maxAmount}
              onChange={handleChange}
              required
            />
            {errors.maxAmount && <span className="error">{errors.maxAmount}</span>}
          </div>
          <div className="intrfld">
            <label>Minimum Interest Rate:</label>
            <input
              type="text"
              name="minInterestRate"
              value={formData.minInterestRate}
              onChange={handleChange}
              required
            />
            {errors.minInterestRate && <span className="error">{errors.minInterestRate}</span>}
          </div>
          <div className="intrfld">
            <label>Maximum Interest Rate:</label>
            <input
              type="text"
              name="maxInterestRate"
              value={formData.maxInterestRate}
              onChange={handleChange}
              required
            />
            {errors.maxInterestRate && <span className="error">{errors.maxInterestRate}</span>}
          </div>
          <div className="collateralfld">
            <label>Collateral Required:</label>
            <textarea
              type="text"
              name="collateral"
              value={formData.collateral}
              onChange={handleChange}
            />
            {errors.collateral && <span className="error">{errors.collateral}</span>}
          </div>
          <div className="eligibilityfld">
            <label>Eligibility Criteria:</label>
            <textarea
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={handleChange}
            />
            {errors.eligibilityCriteria && <span className="error">{errors.eligibilityCriteria}</span>}
          </div>
          <div className="applyfld">
            <label>Application Process:</label>
            <textarea
              name="applicationProcess"
              value={formData.applicationProcess}
              onChange={handleChange}
            />
            {errors.applicationProcess && <span className="error">{errors.applicationProcess}</span>}
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

export default StudentLoanForm;
