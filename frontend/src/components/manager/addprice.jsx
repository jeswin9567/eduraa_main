import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addprice.css';

const AddPaymentOption = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [planType, setPlanType] = useState('mocktest');
  const [message, setMessage] = useState('');

  // Handle frequency change and update planType accordingly
  const handleFrequencyChange = (e) => {
    const selectedFrequency = e.target.value;
    setFrequency(selectedFrequency);

    // Auto-set planType based on frequency
    const planMapping = {
      weekly: 'mocktest',
      monthly: 'normal',
      yearly: 'premium'
    };

    setPlanType(planMapping[selectedFrequency]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/price/add-payment-option`, {
        amount,
        frequency,
        planType
      });

      setMessage('Payment option added successfully!');
      setAmount('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to add payment option. Please try again.');
      }
      console.error('Error adding payment option:', error);
    }
  };

  return (
    <div className="adp-payment-option-container">
      <h2>Add Payment Option</h2>
      {message && <p className="adp-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Subscription Type:
          <select value={frequency} onChange={handleFrequencyChange}>
            <option value="weekly">Weekly (Mock Test Only)</option>
            <option value="monthly">Monthly (All Services)</option>
            <option value="yearly">Yearly (Premium Services)</option>
          </select>
        </label>
        <label>
          Plan Type:
          <input type="text" value={planType} disabled />
        </label>
        <button type="submit">Add Payment Option</button>
      </form>
    </div>
  );
};

export default AddPaymentOption;
