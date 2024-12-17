import React, { useEffect, useState } from 'react';
import '../../../components/admin/ViewLoan.css'; // Assuming your CSS path is correct
import VHeader from '../../../components/user/vhead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../../function/useAuth'; // Assuming this function is for authentication

const UVLoanDetails = () => {
    useAuth(); // Handle authentication logic
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true); // To manage loading state

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/viewln/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch loan details');
                }
                const data = await response.json();
                setLoan(data);
            } catch (error) {
                console.error('Error fetching loan details:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchLoanDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>; // Show loading indicator

    if (!loan) return <div>Loan details not found.</div>; // Handle case where loan data isn't available

    return (
        <div>
            <VHeader />
            <div className="loan-details">
                <h1>{loan.loanName}</h1> {/* Loan Name heading */}
                
                <h2 className="section-heading">Bank Details</h2>
                <p><strong>Bank Name:</strong> {loan.bankName}</p>
                <p><strong>Bank Website:</strong> <a href={loan.bankWebsite} target="_blank" rel="noopener noreferrer">{loan.bankWebsite}</a></p>
                <p><strong>Contact Number:</strong> {loan.contactNumber}</p>
                <p><strong>Email:</strong> {loan.email}</p>

                <h2 className="section-heading">Loan Scheme</h2>
                <p><strong>Loan Type:</strong> {loan.loanType}</p>
                <p>
                    <strong>Field of Study:</strong> 
                    {Array.isArray(loan.fieldOfStudy) 
                        ? loan.fieldOfStudy.join(', ') // Join array values with commas and space
                        : loan.fieldOfStudy} {/* If it's not an array, just render it directly */}
                </p>

                <p><strong>Repayment Period:</strong> {loan.repayment } years</p>

                <h2 className="section-heading">Interest Rate & Loan Amount</h2>
                <p><strong>Amount:</strong> {loan.minAmount} - {loan.maxAmount} INR</p>
                <p><strong>Interest Rate:</strong> {loan.minInterestRate}% - {loan.maxInterestRate}%</p>

                <h2 className="section-heading">Collateral Details</h2>
                <p><strong>Collateral Required:</strong> {loan.collateral || 'Not required'}</p>

                <h2 className="section-heading">Application Process</h2>
                <p>{loan.applicationProcess}</p>

                {loan.eligibilityCriteria && (
                    <>
                        <h2 className="section-heading">Eligibility Criteria</h2>
                        <p>{loan.eligibilityCriteria}</p>
                    </>
                )}

                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>

                </div>
            </div>
        </div>
    );
};

export default UVLoanDetails;
