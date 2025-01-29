import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './viewprice.css';

const PriceTable = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/price/prices'); // Adjust the endpoint
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
    console.log('Editing price with ID:', id);
  };

  return (
    <div className="viewprice-container">
      <h2 className="viewprice-title">Pricing Options</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="viewprice-table">
          <thead>
            <tr>
              <th className="viewprice-header">Amount</th>
              <th className="viewprice-header">Frequency</th>
              <th className="viewprice-header">Plan Type</th>
              <th className="viewprice-header">Created At</th>
              <th className="viewprice-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price._id} className="viewprice-row">
                <td className="viewprice-data">₹{price.amount}</td>
                <td className="viewprice-data">{price.frequency}</td>
                <td className="viewprice-data">{price.planType || 'N/A'}</td>
                <td className="viewprice-data">
                  {new Date(price.createdAt).toLocaleString()}
                </td>
                <td className="viewprice-data">
                  <button 
                    onClick={() => handleEdit(price._id)} 
                    className="viewprice-edit-button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceTable;
