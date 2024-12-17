import React, { useState } from "react";
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  let timeout;
  const navigate = useNavigate();

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      setNameError("Full name is required");
      return false;
    } else if (!nameRegex.test(name)) {
      setNameError("Full name must contain only alphabets");
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (email.includes(' ')) {
      setEmailError("Email cannot contain spaces");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format or domain");
      return false;
    }
    setEmailError('');
    return true;
  };
  
  

  const validateForm = () => {
    return validateName(name) && validateEmail(email) && validatePhone(phone) && validatePassword(password, confirmPassword);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const invalidSequences = [
      "0123456789",
      "1234567890",
      "9876543210",
      "0987654321"
    ];

    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Invalid phone number. Must be a 10-digit number starting with 6-9.");
      return false;
    } else if (invalidSequences.includes(phone)) {
      setPhoneError("Invalid phone number.");
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("At least 8 characters long, include special character");
      return false;
    }
    setPasswordError('');

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    axios.post('http://localhost:5000/sign', { name, email, phone, password, confirmPassword })
      .then(result => {
        Swal.fire("Success!", "OTP sent to your email. Please check your inbox.", "success");
        setIsOtpSent(true);
        showOtpPopup();
      })
      .catch(error => {
        Swal.fire("Error", error.response?.data?.message || "An unexpected error occurred.", "error");
      });
  };

  const showOtpPopup = () => {
    Swal.fire({
      title: 'Verify OTP',
      input: 'text',
      inputLabel: 'Enter the OTP sent to your email',
      inputPlaceholder: 'OTP',
      showCancelButton: true,
      confirmButtonText: 'Verify',
      cancelButtonText: 'Cancel',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Please enter the OTP');
          return false;
        }
        return value;
      }
    }).then((result) => {
      clearTimeout(timeout);
      if (result.isConfirmed) {
        handleOtpSubmit(result.value);
      }
    });

    timeout = setTimeout(() => {
      Swal.close();
      Swal.fire("Time's up!", "The OTP verification window has closed.", "info");
    }, 60000);
  };

  const handleOtpSubmit = (otp) => {
    axios.post('http://localhost:5000/sign/verify-otp', { email, otp })
      .then(result => {
        Swal.fire("Success!", "Your account has been created successfully.", "success");
        navigate('/login');
      })
      .catch(error => {
        Swal.fire("Error", error.response?.data?.message || "Invalid OTP", "error");
      });
  };

  return (
    <div className="container">
      <div className="left-page">
        <img src="/images/girl1.jpg" alt="Girl" className="gl1" />
        <h1 className="wel">
          Empowering students with knowledge, guiding them to their brightest future.
        </h1>
        <img src="/images/mainl.png" alt="logo" className="mainl" />
      </div>

      <div className="right-page">
        <img src="/images/logo 3.png" alt="smlg" className="smalllogo" />
        <h1 className='crac'>CREATE ACCOUNT</h1>

        {/* Form submission */}
        <form onSubmit={handleSubmit}>
          <input 
            type='text' 
            name='name' 
            className='fn' 
            placeholder='Full Name' 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateName(e.target.value); // Validate as user types
            }} 
            required 
          />
          {nameError && <span className="usigerror">{nameError}</span>}
          
          <input 
            type='email' 
            name='email' 
            className='el' 
            placeholder='Email' 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value); // Live validation
            }} 
            required 
          />
          {emailError && <span className="usigerror">{emailError}</span>}
          
          <input 
            type='text' 
            name='phone' 
            className='phn' 
            placeholder='Phone' 
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              validatePhone(e.target.value); // Live validation
            }} 
            required 
          />
          {phoneError && <span className="usigerror">{phoneError}</span>}
          
          <input 
            type='password' 
            name='password' 
            className='psw' 
            placeholder='Password' 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value, confirmPassword); // Live validation
            }} 
            required 
          />
          {passwordError && <span className="usigerror">{passwordError}</span>}
          
          <input 
            type='password' 
            name='confirmPassword' 
            className='cnfp' 
            placeholder='Confirm Password' 
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validatePassword(password, e.target.value); // Live validation
            }} 
            required 
          />
          {confirmPasswordError && <span className="usigerror">{confirmPasswordError}</span>}
          
          <button type="submit" className='signbut'>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
