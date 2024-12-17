import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './editprice.css';

const EditPriceForm = ({ onClose, onUpdate }) => {
    const navigate = useNavigate();
    const { id } = useParams(); // Extract ID from URL params
    const [priceData, setPriceData] = useState({ amount: '', frequency: '' });

    useEffect(() => {
        if (!id) {
            console.error('No ID found in the URL');
            return; // If no ID, exit early
        }
        const fetchPriceData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/price/vprices/${id}`);
                setPriceData({
                    amount: response.data.amount,
                    frequency: response.data.frequency,
                });
            } catch (error) {
                console.error('Error fetching price details:', error);
            }
        };
        fetchPriceData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPriceData({ ...priceData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.put(`http://localhost:5000/price/prices/${id}`, priceData);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Payment option updated successfully!',
          }).then(() => navigate('/manager/vprice')); // Redirect after confirmation
        } catch (error) {
          let errorMessage = 'Failed to update payment option. Please try again.';
          if (error.response) {
            if (error.response.status === 400) {
              errorMessage = error.response.data.message; // Duplicate price error
            } else if (error.response.status === 404) {
              errorMessage = 'Payment option not found';
            }
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
          console.error('Error updating payment option:', error);
        }
      };
    

    return (
        <div className="viewpricee-edit-form-container">
            <h3>Edit Price Details</h3>
            <form onSubmit={handleSubmit}>
                <label className="viewpricee-label">
                    Amount:
                    <input
                        type="number"
                        name="amount"
                        value={priceData.amount}
                        onChange={handleInputChange}
                        className="viewpricee-input"
                        required
                    />
                </label>
                <label className="viewpricee-label">
                    Frequency:
                    <select
                        name="frequency"
                        value={priceData.frequency}
                        onChange={handleInputChange}
                        className="viewpricee-input"
                        required
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </label>
                <button type="submit" className="viewpricee-submit-button">Save Changes</button>
                <button type="button" onClick={() =>navigate('/manager/vprice')} className="viewpricee-cancel-button">Cancel</button>
            </form>
        </div>
    );
};

export default EditPriceForm;
