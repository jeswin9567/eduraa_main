import React, { useState, useCallback } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000 // 5 second timeout
});

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // React Router's navigation hook

  // Memoize the handleChange function
  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id === 'emailid' ? 'email' : 'password']: value
    }));
  }, []);

  // Optimized submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data } = await api.post('/log', credentials);

      if (data.message === "success") {
        // Store minimal data
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('token', data.token);

        // Optimized navigation
        switch (data.role) {
          case 'admin': navigate('/adhome'); break;
          case 'user': navigate('/userhome'); break;
          case 'teacher': navigate('/teacherhome'); break;
          case 'manager': navigate('/mhome'); break;
          default: throw new Error('Invalid role');
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Login failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-page">
        <img src="/images/girl1.jpg" alt="Girl" className="gl" />
        <h1 className="welcome-text">
          Empowering students with knowledge, guiding them to their brightest future.
        </h1>
        <img src="/images/mainl.png" alt="logo" className="mainlogo" />
      </div>

      <div className="right-page">
        <img src="/images/logo 3.png" alt="smalllogo" className="smalllogo" />
        <h1 className='login_text'>LOGIN</h1>

        {/* Form for login */}
        <form onSubmit={handleSubmit}>
          <input 
            type='text' 
            className='un' 
            placeholder='username/email' 
            id="emailid"
            value={credentials.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <input 
            type='password' 
            className='pass' 
            placeholder='password' 
            id="passwords"
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <a href="/forgotpassword" className='fp'>Forgot password?</a>

          {/* Submit button */}
          <button 
            type="submit" 
            id="login" 
            className='lb'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='not'>
          Not registered yet? 
          <a href="/signup" className='regis'>Create an Account</a>
        </p>
      </div>
    </div>
  );
}

export default React.memo(Login);
