import React, { useState } from "react";
import './amanager.css';
import Header from "../../../components/admin/headd";
import Footer from "../../../components/common/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../../function/useAuth";

function AManager() {
  useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // States for errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const navigate = useNavigate();

  // Name Validation
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    } else if (!nameRegex.test(name)) {
      setNameError("Name must contain only alphabets and spaces");
      return false;
    }
    setNameError('');
    return true;
  };

  // Email Validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (email.includes(' ')) {
      setEmailError("Email cannot contain spaces");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password Validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long, include an uppercase, a lowercase, a number, and a special character");
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Confirm Password Validation
  const validateConfirmPass = (confirmPass) => {
    if (!confirmPass) {
      setConfirmPassError("Please confirm your password");
      return false;
    } else if (confirmPass !== password) {
      setConfirmPassError("Passwords do not match");
      return false;
    }
    setConfirmPassError('');
    return true;
  };

  const validateForm = () => {
    return validateName(name) && validateEmail(email) && validatePassword(password) && validateConfirmPass(confirmPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/man', { name, email, password, confirmPass });
  
      Swal.fire("Manager added successfully", "", "success");
      navigate('/adhome');
    } catch (error) {
      if (error.response?.data?.message === 'Invalid email domain') {
        Swal.fire("Invalid email domain", "", "error");
      } else {
        Swal.fire("Error adding manager", error.response?.data?.message || "Server error", "error");
      }
    }
  };
  

  return (
    <>
      <Header />
      <div className="manager-form-container">
        <h2 className="manager-form-title">Add New Manager</h2>
        <form onSubmit={handleSubmit} className="manager-form">
          
          <div className="manager-form-group">
            <label className="manager-form-label">Name:</label>
            <input
              type="text"
              id="name"
              className="manager-form-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value); // Live validation
              }}
              required
            />
            {nameError && <span className="adderror-message">{nameError}</span>}
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="manager-form-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value); // Live validation
              }}
              required
            />
            {emailError && <span className="adderror-message">{emailError}</span>}
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Password:</label>
            <input
              type="password"
              id="password"
              className="manager-form-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value); // Live validation
              }}
              required
            />
            {passwordError && <span className="adderror-message">{passwordError}</span>}
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="manager-form-input"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                validateConfirmPass(e.target.value); // Live validation
              }}
              required
            />
            {confirmPassError && <span className="adderror-message">{confirmPassError}</span>}
          </div>

          <button id = "submitManager" type="submit" className="manager-form-btn">
            Add Manager
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AManager;
