import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './editprice.css';

const EditPriceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Extract ID from URL params
    const [priceData, setPriceData] = useState({ amount: '', frequency: '', planType: '' });

    useEffect(() => {
        if (!id) {
            console.error('No ID found in the URL');
            return;
        }
        const fetchPriceData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/price/vprices/${id}`);
                setPriceData(response.data);
            } catch (error) {
                console.error('Error fetching price details:', error);
            }
        };
        fetchPriceData();
    }, [id]);

    const handleFrequencyChange = (e) => {
        const selectedFrequency = e.target.value;
        setPriceData({
            ...priceData,
            frequency: selectedFrequency,
            planType: getPlanType(selectedFrequency)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPriceData({ ...priceData, [name]: value });
    };

    const getPlanType = (frequency) => {
        const planMapping = {
            weekly: 'mocktest',
            monthly: 'normal',
            yearly: 'premium'
        };
        return planMapping[frequency];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/price/prices/${id}`, priceData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Payment option updated successfully!',
            }).then(() => navigate('/manager/vprice'));
        } catch (error) {
            let errorMessage = 'Failed to update payment option. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
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
                        onChange={handleFrequencyChange}
                        className="viewpricee-input"
                        required
                    >
                        <option value="weekly">Weekly (Mock Test Only)</option>
                        <option value="monthly">Monthly (All Services)</option>
                        <option value="yearly">Yearly (Premium Services)</option>
                    </select>
                </label>
                <label className="viewpricee-label">
                    Plan Type:
                    <input type="text" value={priceData.planType} readOnly className="viewpricee-input" />
                </label>
                <button type="submit" className="viewpricee-submit-button">Save Changes</button>
                <button type="button" onClick={() => navigate('/manager/vprice')} className="viewpricee-cancel-button">Cancel</button>
            </form>
        </div>
    );
};

export default EditPriceForm;
