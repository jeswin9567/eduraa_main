import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './RevenueDetails.css';
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";

function RevenueDetails() {
    const [revenueData, setRevenueData] = useState({
        currentMonth: {
            revenue: 0,
            count: 0
        },
        lastMonth: {
            revenue: 0,
            count: 0
        },
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    useEffect(() => {
        fetchRevenueDetails();
    }, []);

    const fetchRevenueDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/payment/revenue-details');
            setRevenueData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching revenue details:', error);
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const calculateChange = () => {
        if (!revenueData?.lastMonth?.revenue || !revenueData?.currentMonth?.revenue) {
            return 0;
        }
        if (revenueData.lastMonth.revenue === 0) {
            return revenueData.currentMonth.revenue > 0 ? 100 : 0;
        }
        return ((revenueData.currentMonth.revenue - revenueData.lastMonth.revenue) / revenueData.lastMonth.revenue) * 100;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const downloadCSV = () => {
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Plan Type', 'Frequency', 'Amount'];
        const data = revenueData.transactions.map(t => [
            formatDate(t.createdAt),
            t.userName,
            t.email,
            t.phone,
            t.planType,
            t.frequency,
            t.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue_details_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = revenueData.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(revenueData.transactions.length / transactionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        return (
            <div className="revedetne-pagination">
                <button 
                    className="revedetne-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="revedetne-page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    className="revedetne-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const renderContent = () => {
        const percentageChange = calculateChange();
        const isProfit = percentageChange >= 0;

        return (
            <div className="revedetne-summary-cards">
                <div className="revedetne-summary-card">
                    <h3>Current Month Revenue</h3>
                    <p className="revedetne-amount">
                        {formatCurrency(revenueData?.currentMonth?.revenue || 0)}
                    </p>
                    <p className="revedetne-count">
                        {revenueData?.currentMonth?.count || 0} subscriptions
                    </p>
                </div>
                
                <div className="revedetne-summary-card">
                    <h3>Revenue Change</h3>
                    <div className={`revedetne-change ${isProfit ? 'profit' : 'loss'}`}>
                        {isProfit ? <FaArrowUp /> : <FaArrowDown />}
                        <span className="revedetne-percentage">
                            {Math.abs(percentageChange).toFixed(2)}%
                        </span>
                        <p className="revedetne-change-label">
                            {isProfit ? 'Profit' : 'Loss'} from last month
                        </p>
                    </div>
                    <p className="revedetne-previous">
                        Last Month: {formatCurrency(revenueData?.lastMonth?.revenue || 0)}
                    </p>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="revedetne-loading">Loading...</div>;
    }

    return (
        <div>
            <ManHomHeader />
            <div className="mhomevisible-container">
                <Managersidebrcom />
                <div className="revedetne-container">
                    <div className="revedetne-header">
                        <h1>Revenue Analysis</h1>
                        <button className="revedetne-download-btn" onClick={downloadCSV}>
                            <FaFileDownload /> Export to CSV
                        </button>
                    </div>

                    {renderContent()}

                    <div className="revedetne-table-container">
                        <div className="revedetne-table-header">
                            <h3>All Transactions</h3>
                            <p className="revedetne-total-count">
                                Total Transactions: {revenueData.transactions.length}
                            </p>
                        </div>
                        <table className="revedetne-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Plan Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(transaction.createdAt)}</td>
                                        <td>{transaction.userName}</td>
                                        <td>{transaction.planType}</td>
                                        <td>{formatCurrency(transaction.amount)}</td>
                                        <td>
                                            <span className={`revedetne-status ${
                                                new Date(transaction.expirationDate) > new Date() ? 'active' : 'expired'
                                            }`}>
                                                {new Date(transaction.expirationDate) > new Date() ? 'Active' : 'Expired'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueDetails; 