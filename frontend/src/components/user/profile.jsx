import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BuyPremiumButton from './button/payment';
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expirationDate, setExpirationDate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/vuprofile', {
          headers: { Authorization: token },
        });
        setUser(response.data);

        // If user has premium, fetch the expiration date
        if (response.data.premium) {
          const paymentResponse = await axios.get('http://localhost:5000/vuprofile/payment/latest', {
            headers: { Authorization: token },
          });
          setExpirationDate(paymentResponse.data.expirationDate);
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        navigate('/login'); // Redirect to login if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle cancellation of premium
  const cancelPremium = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/vuprofile/payment/cancel', {}, {
        headers: { Authorization: token },
      });
      Swal.fire({
        title: 'Subscription Cancelled',
        text: 'Your premium access has been canceled.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setUser((prev) => ({ ...prev, premium: false }));
      setExpirationDate(null);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Could not cancel the subscription.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Confirm cancellation
  const confirmCancelPremium = () => {
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Handle confirmation modal action
  const handleConfirmCancel = async () => {
    setShowConfirmModal(false); // Hide the modal
    await cancelPremium(); // Call the cancel function after confirmation
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="uprofile-container">
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      {/* Premium Section */}
      {user.education && (
        <p><strong>Education:</strong> {user.education}</p>
      )}

      {user.courses && user.courses.length > 0 && (
        <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
      )}

      {(user.marks?.tenthMark > 0 || user.marks?.twelfthMark > 0 || user.marks?.degreeMark > 0 || user.marks?.pgMark > 0) && (
        <>
          <p><strong>Marks:</strong></p>
          <ul>
            {user.marks?.tenthMark > 0 && <li>Tenth Mark: {user.marks.tenthMark}</li>}
            {user.marks?.twelfthMark > 0 && <li>Twelfth Mark: {user.marks.twelfthMark}</li>}
            {user.marks?.degreeMark > 0 && <li>Degree Mark: {user.marks.degreeMark}</li>}
            {user.marks?.pgMark > 0 && <li>PG Mark: {user.marks.pgMark}</li>}
          </ul>
        </>
      )}
      
      {user.premium ? (
        <>
          <p className="premium-message">You have access to Eduraa Premium!</p>
          <p><strong>Subscription Expiry Date:</strong> {new Date(expirationDate).toLocaleDateString()}</p>
          <button id = "cancel" className="cancel-button" onClick={confirmCancelPremium}>Cancel Subscription</button>
        </>
      ) : (
        <BuyPremiumButton />
      )}
      <button className="uprofilebutton" onClick={() => navigate('/upro')}>Edit Profile</button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="pr-confirm-modal-overlay">
          <div className="pr-confirm-modal-content">
            <p>Are you sure you want to cancel your subscription?</p>
            <button id="yes" onClick={handleConfirmCancel}>Yes</button>
            <button onClick={() => setShowConfirmModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
