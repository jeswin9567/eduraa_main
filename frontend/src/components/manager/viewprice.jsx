import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaMoneyBillWave, FaClock, FaTag } from 'react-icons/fa';
import './viewprice.css';

const PriceTable = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/price/prices`);
        setPrices(response.data);
      } catch (error) {     
        console.error('Error fetching prices:', error);
        alert('Failed to load pricing options. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const handleEdit = (id) => {
    navigate(`/manager/eprice/${id}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="viewprice-loading">
        <div className="loading-spinner"></div>
        <p>Loading pricing details...</p>
      </div>
    );
  }

  return (
    <div className="viewprice-container">
      <div className="viewprice-header">
        <FaMoneyBillWave className="header-icon" />
        <h2>Subscription Plans</h2>
      </div>

      <div className="price-cards-container">
        {prices.map((price) => (
          <div key={price._id} className={`price-card ${price.planType.toLowerCase()}`}>
            <div className="price-card-header">
              <span className="plan-badge">{price.planType}</span>
              <h3>{price.frequency}</h3>
              <div className="price-amount">
                {formatCurrency(price.amount)}
                <span className="price-period">/{price.frequency}</span>
              </div>
            </div>

            <div className="price-card-details">
              <div className="detail-item">
                <FaClock />
                <span>Billing: {price.frequency}</span>
              </div>
              <div className="detail-item">
                <FaTag />
                <span>Plan: {price.planType}</span>
              </div>
              <div className="detail-item">
                <span className="created-date">
                  Created: {new Date(price.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button 
              className="edit-price-button"
              onClick={() => handleEdit(price._id)}
            >
              <FaEdit /> Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTable;
