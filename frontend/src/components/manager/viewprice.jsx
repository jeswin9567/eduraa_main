import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './viewprice.css';

const PriceTable = () => {
    const navigate = useNavigate();
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/price/prices'); // Adjust the endpoint to match your API
        setPrices(response.data);
      } catch (error) {     
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  const handleEdit = (id) => {
    navigate(`/manager/eprice/${id}`)
    
    // Add your edit functionality here, e.g., open a modal or navigate to an edit page
    console.log('Editing price with ID:', id);
  };

  return (
    <div className="viewprice-container">
      <h2 className="viewprice-title">Pricing Options</h2>
      <table className="viewprice-table">
        <thead>
          <tr>
            <th className="viewprice-header">Amount</th>
            <th className="viewprice-header">Frequency</th>
            <th className="viewprice-header">Created At</th>
            <th className="viewprice-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price._id} className="viewprice-row">
              <td className="viewprice-data">{price.amount}</td>
              <td className="viewprice-data">{price.frequency}</td>
              <td className="viewprice-data">
                {new Date(price.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default PriceTable;
