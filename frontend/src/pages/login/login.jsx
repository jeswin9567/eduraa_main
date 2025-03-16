import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert


function Login() {

  const [email, setEmail] = useState('');
  const [pass, setPassword] = useState('');

  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Use the environment variable for the API URL
    axios.post(`${import.meta.env.VITE_API_URL}/log`, { email, password: pass })
      .then(result => {
        // If login is successful, navigate to home
        if(result.data.message === "success"){
          localStorage.setItem('userEmail', email);
          localStorage.setItem('token',result.data.token)
          
          const userRole =result.data.role;

          if(userRole === "admin"){
            navigate('/adhome');
          }

          else if(userRole === "user"){
            navigate('/userhome');
          }
          else if(userRole === "teacher"){
            navigate('/teacherhome');
          }

          else if(userRole === "manager"){
            navigate('/mhome');
          }
        }
      })
      .catch(error => {
        // Show appropriate error message
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error(error);
      });
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
          <button type="submit" id="login" className='lb'>Login</button>
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
