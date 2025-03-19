import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert


function Login() {

  const [email, setEmail] = useState('');
  const [pass, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create axios instance with timeout
      const axiosInstance = axios.create({
        timeout: 10000, // 10 second timeout
        baseURL: import.meta.env.VITE_API_URL
      });

      const result = await axiosInstance.post('/log', { 
        email, 
        password: pass 
      });

      if (result.data.message === "success") {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('token', result.data.token);

        // Simplified navigation logic
        const roleRoutes = {
          admin: '/adhome',
          user: '/userhome',
          teacher: '/teacherhome',
          manager: '/mhome'
        };

        navigate(roleRoutes[result.data.role] || '/');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Login failed. Please try again.',
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Capture email input
            required
          />
          <input 
            type='password' 
            className='pass' 
            placeholder='password' 
            id="passwords"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}  // Capture password input
            required
          />
          <a href="/forgotpassword" className='fp'>Forgot password?</a>

          {/* Submit button */}
          <button type="submit" id="login" className='lb' disabled={isLoading}>Login</button>
        </form>

        <p className='not'>
          Not registered yet? 
          <a href="/signup" className='regis'>Create an Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
