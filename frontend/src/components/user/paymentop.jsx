import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './paymentop.css';

const PaymentOptionsModal = ({ closeModal, userId }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/price/view/payment-options');
        setPaymentOptions(response.data);
      } catch (error) {
        console.error('Error fetching payment options:', error);
      }
    };
    fetchPaymentOptions();

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when component unmounts
    };
  }, []);

  const handlePayment = async (option) => {
    try {
      const email = localStorage.getItem('userEmail');
  
      const response = await axios.post('http://localhost:5000/payment/process', {
        email,
        amount: option.amount,
        frequency: option.frequency,
        planType: option.planType,  // Include planType
      });
  
      const { order, userDetails, userId, planType } = response.data; // Receive planType
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Eduraa',
        description: `Payment for ${planType} Plan`,  // Dynamic description
        order_id: order.id,
        handler: async (paymentResponse) => {
          console.log('Payment Response:', paymentResponse);
  
          try {
            await axios.post('http://localhost:5000/payment/success', {
              userId,
              email,
              amount: option.amount,
              frequency: option.frequency,
              paymentId: paymentResponse.razorpay_payment_id,
              planType,  // Include planType in success request
            });
  
            navigate('/userhome');
          } catch (error) {
            console.error('Error confirming payment:', error);
          }
        },
        prefill: {
          name: userDetails.name,
          email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#F37254',
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="pr-modal-overlay">
      <div className="pr-modal-content">
        <h3>Select Payment Plan</h3>
        <div className="plan-cards-container">
          {paymentOptions.map((option) => (
            <div className="plan-card" key={option._id}>
              <h4>{option.planType.charAt(0).toUpperCase() + option.planType.slice(1)} Plan</h4>
              <p><strong>Frequency:</strong> {option.frequency.charAt(0).toUpperCase() + option.frequency.slice(1)}</p>
              <p><strong>Amount:</strong> Rs {option.amount}</p>

              {/* Explanation for Mocktest Plan */}
              {option.planType === 'mocktest' ? (
                <p><strong>Access:</strong> Only Mock Tests</p>
              ) : (
                <p><strong>Access:</strong> All Features (Mock Tests, Courses, Live Classes)</p>
              )}

              <div className="price">Rs {option.amount}</div>
              <button className="buy-btn" onClick={() => handlePayment(option)}>Buy Now</button>
            </div>
          ))}
        </div>
        <button className="close-btn" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
