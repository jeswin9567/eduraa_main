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
      });
  
      const { order, userDetails, userId } = response.data; // userId is returned here
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Eduraa',
        description: 'Purchase Description',
        order_id: order.id,
        handler: async (paymentResponse) => {
          console.log('Payment Response:', paymentResponse);
  
          // After payment success, confirm the payment in the backend
          try {
            await axios.post('http://localhost:5000/payment/success', {
              userId, // Pass userId here
              email,
              amount: option.amount,
              frequency: option.frequency,
              paymentId: paymentResponse.razorpay_payment_id,
            });
  
            navigate('/userhome');
          } catch (error) {
            console.error('Error confirming payment:', error);
          }
        },
        prefill: {
          name: userDetails.name,
          email: email,
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
        <ul>
          {paymentOptions.map((option) => (
            <li key={option._id}>
              {option.frequency.charAt(0).toUpperCase() + option.frequency.slice(1)} - Rs{option.amount}
              <button onClick={() => handlePayment(option)}>Buy Now</button>
            </li>
          ))}
        </ul>
        <button className="close-btn" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
