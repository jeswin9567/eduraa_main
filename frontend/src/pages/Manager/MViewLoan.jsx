import React, { useEffect, useState } from 'react';
import '../../components/admin/ViewLoan.css';
import MVLHeader from '../../components/manager/mviewservicehead/mloanhead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const MVLoanDetails = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);

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
            }
        };

        fetchLoanDetails();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this loan?");
        if (!confirmDelete) return; // Cancel deletion if user chooses not to proceed

        try {
            const response = await fetch(`http://localhost:5000/delln/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Loan deleted successfully');
                navigate('/manager/loan'); // Redirect to the loan list or desired page
            } else {
                const errorMessage = await response.text();
                alert(`Failed to delete the loan: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting loan:', error);
            alert('Could not delete loan. Please try again later.');
        }
    };

    if (!loan) return <div>Loading...</div>;

    return (
        <div>
            <MVLHeader/>
            <div className="loan-details">
    <h1>{loan.loanName}</h1>
    
    <div className="section-heading">Bank Information</div>
    <p><strong>Bank Name:</strong> {loan.bankName}</p>
    <p><strong>Bank Website:</strong> <a href={loan.bankWebsite} target="_blank" rel="noopener noreferrer">{loan.bankWebsite}</a></p>
    <p><strong>Contact Number:</strong> {loan.contactNumber}</p>
    <p><strong>Email:</strong> {loan.email}</p>

    <div className="section-heading">Loan Details</div>
    <p><strong>Loan Type:</strong> {loan.loanType}</p>
    <p>
                    <strong>Field of Study:</strong> 
                    {Array.isArray(loan.fieldOfStudy) 
                        ? loan.fieldOfStudy.join(', ') // Join array values with commas and space
                        : loan.fieldOfStudy} {/* If it's not an array, just render it directly */}
                </p>
    <p><strong>Repayment period:</strong>{loan.repayment}</p>
    <p><strong>Minimum Amount:</strong> {loan.minAmount}</p>
    <p><strong>Maximum Amount:</strong> {loan.maxAmount}</p>
    <p><strong>Minimum Interest Rate:</strong> {loan.minInterestRate}%</p>
    <p><strong>Maximum Interest Rate:</strong> {loan.maxInterestRate}%</p>
    <p><strong>Collateral Required:</strong> {loan.collateral}</p>
    <p><strong>Application Process:</strong> {loan.applicationProcess}</p>

    <div className="button-container">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <button className="delete-button" onClick={handleDelete}>Delete</button>
        <button className="update-button" onClick={() => navigate(`/mupdateloan/${id}`)}>Update</button>
    </div>
</div>

        </div>
    );
};

export default MVLoanDetails;
