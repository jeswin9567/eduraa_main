import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './manprofile.css'

function MProfile () {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // fetch Manager Profile

        const fetchManagerProfile = async () => {
            const token = localStorage.getItem('token');
            try{
                const response = await axios.get('http://localhost:5000/manprof', {
                    headers: { Authorization: token}

        });
        setUser(response.data);
    }catch (error) {
        Swal.fire({
            title:'Error!',
            text: error.response?.data?.message || "An unexpected error occured",
            icon: 'error',
            confirmButtonText: 'OK'
        });
        navigate('/login');
    }finally {
        setLoading(false)
    }
    };
    fetchManagerProfile();
}, [navigate]);
if (loading){
    return <div>Loading...</div>;
}
if(!user) {
    return <div>No User found.</div>
}

const handleChangePassword = async() => {
    const {value:currentPassword} = await Swal.fire({
        title: 'Enter Current Password',
        input: 'password',
        inputLabel:'current password',
        inputPlaceholder: 'Enter your current password',
        showCancelButton: true
    });
    if(currentPassword){
        const {value:newPassword} = await Swal.fire({
            title: 'Enter New Password',
            input: 'password',
            inputLabel:'New Password',
            inputPlaceholder: 'Enter your new password',
            showCancelButton: true
    });

    if(newPassword) {
        const {value:confirmPassword} = await Swal.fire({
            title: 'Confirm New Password',
            input: 'password',
            inputLabel: 'Confirm New Password',
            inputPlaceholder:'Re-enter your new password',
            showCancelButton: true
        });

        if(newPassword === confirmPassword){
            const token = localStorage.getItem('token');
            try {
                await axios.put('http://localhost:5000/manchangepass', { currentPassword, newPassword }, {
                    headers: { Authorization: token }
                  });
                  Swal.fire('Success!', 'Your password has been updated.', 'success');
                } catch (error) {
                  Swal.fire('Error!', error.response?.data?.message || 'An unexpected error occurred.', 'error');
                }
              } else {
                Swal.fire('Error!', 'New password and confirmation do not match.', 'error');
              }
            }
          }
        };
            
return (
    <div className="manprofile">
        <h1>Manager Profile</h1>
        <h3>Name</h3>
        <p>{user.name}</p>
        <h3>Email</h3>
        <p>{user.email}</p>
        <button type ='submit' onClick={handleChangePassword}>Change Password</button>
        <button onClick={ () => navigate(-1)}>Back</button>
    </div>
);
}

export default MProfile;