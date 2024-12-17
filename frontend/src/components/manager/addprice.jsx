import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addprice.css';

const AddPaymentOption = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/price/add-payment-option', {
        amount,
        frequency,
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
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <button type="submit">Add Payment Option</button>
      </form>
    </div>
  );
};

export default AddPaymentOption;
