import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VLHeader from '../aviewservicehead/aloanhead';
import './uplon.css';
import useAuth from '../../../../function/useAuth';

const UpdateLoan = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    // State to manage loan data
    const [loan, setLoan] = useState({
        loanName: '',
        bankName: '',
        bankWebsite: '',
        contactNumber: '',
        email: '',
        loanType: '',
        fieldOfStudy: [],    // Changed to an array to support multiple selections
        repayment: '',
        minAmount: '',
        maxAmount: '',
        minInterestRate: '',
        maxInterestRate: '',
        collateral: '',
        applicationProcess: '',
        eligibilityCriteria: ''  
    });

    // List of fields of study options
    const fieldsOfStudyOptions = [
        'Engineering',
        'Medicine',
        'Business',
        'Law',
        'Arts',
        'Science',
        'Technology',
    ];

    // Fetch existing loan details
    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/viewln/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch loan details');
                }
                const data = await response.json();
                setLoan(data);  // Set fetched loan data
            } catch (error) {
                console.error('Error fetching loan details:', error);
                alert('Could not fetch loan details. Please try again.');
            }
        };

        fetchLoanDetails();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'fieldOfStudy') {
            // Handle checkboxes for fields of study
            if (checked) {
                setLoan((prevLoan) => ({
                    ...prevLoan,
                    fieldOfStudy: [...prevLoan.fieldOfStudy, value]  // Add selected field
                }));
            } else {
                setLoan((prevLoan) => ({
                    ...prevLoan,
                    fieldOfStudy: prevLoan.fieldOfStudy.filter((field) => field !== value)  // Remove unselected field
                }));
            }
        } else {
            setLoan((prevLoan) => ({ ...prevLoan, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upln/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loan),
            });

            if (response.ok) {
                alert('Loan updated successfully');
                navigate(`/admin/loan`); // Redirect to the loan list page
            } else {
                const errorMessage = await response.text();
                alert(`Failed to update the loan: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating loan:', error);
            alert('Could not update loan. Please try again later.');
        }
    };

    return (
        <div>
          <VLHeader />  
          <div className="uplon">
              <h1 className="uplon-title">Update Loan</h1>
              <form onSubmit={handleSubmit} className="uplon-form">
                  <label className="uplon-label">
                      Loan Name:
                      <input
                          type="text"
                          name="loanName"
                          value={loan.loanName}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Bank Name:
                      <input
                          type="text"
                          name="bankName"
                          value={loan.bankName}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Bank Website:
                      <input
                          type="url"
                          name="bankWebsite"
                          value={loan.bankWebsite}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Contact Number:
                      <input
                          type="text"
                          name="contactNumber"
                          value={loan.contactNumber}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Email:
                      <input
                          type="email"
                          name="email"
                          value={loan.email}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Loan Type:
                      <select
                          name="loanType"
                          value={loan.loanType}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      >
                          <option value="domestic">Domestic</option>
                          <option value="international">International</option>
                      </select>
                  </label>

                  <label className="uplon-label">Field of Study:</label>
                  <div className="uplon-checkbox-group">
                      {fieldsOfStudyOptions.map((field) => (
                          <label key={field} className="uplon-checkbox-label">
                              <input
                                  type="checkbox"
                                  name="fieldOfStudy"
                                  value={field}
                                  checked={loan.fieldOfStudy.includes(field)}
                                  onChange={handleChange}
                              />
                              {field}
                          </label>
                      ))}
                  </div>

                  <label className="uplon-label">
                      Repayment:
                      <input
                          type="text"
                          name="repayment"
                          value={loan.repayment}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Minimum Amount:
                      <input
                          type="number"
                          name="minAmount"
                          value={loan.minAmount}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Maximum Amount:
                      <input
                          type="number"
                          name="maxAmount"
                          value={loan.maxAmount}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Minimum Interest Rate:
                      <input
                          type="text"
                          name="minInterestRate"
                          value={loan.minInterestRate}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Maximum Interest Rate:
                      <input
                          type="text"
                          name="maxInterestRate"
                          value={loan.maxInterestRate}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <label className="uplon-label">
                      Collateral Required:
                      <input
                          type="text"
                          name="collateral"
                          value={loan.collateral}
                          onChange={handleChange}
                          className="uplon-input"
                      />
                  </label>
                  <label className="uplon-label">
                      Eligibility Criteria:
                      <textarea
                          name="eligibilityCriteria"
                          value={loan.eligibilityCriteria}
                          onChange={handleChange}
                          className="uplon-input"
                      />
                  </label>
                  <label className="uplon-label">
                      Application Process:
                      <textarea
                          name="applicationProcess"
                          value={loan.applicationProcess}
                          onChange={handleChange}
                          className="uplon-input"
                          required
                      />
                  </label>
                  <button type="submit" className="uplon-button">Update Loan</button>
              </form>
          </div>
        </div>
    );
};

export default UpdateLoan;
    