import React, { useState, useEffect } from "react";
import axios from "axios";

const MDLoanList = () => {
    const [loans, setLoans] = useState([]);

    // Fetch loan details when the component is mounted
    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/viewln/managerdellaon`); // This should fetch loans with status false

                setLoans(response.data);
            } catch (error) {
                console.error("Error fetching loans:", error);
            }
        };

        fetchLoanDetails();
    }, []);

    // Handle enabling the loan (change status to true)
    const handleEnable = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/delln/managerloan/${id}`, { status: true });  // Adjust the endpoint
            setLoans(loans.map(loan =>
                loan._id === id ? { ...loan, status: true } : loan
            ));
        } catch (error) {
            console.log("Error enabling loan:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Loan List</h2>
            <div>
                {loans.map((loan) => (
                    <div 
                        key={loan._id} 
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <strong>{loan.loanName}</strong>
                            <p>Status: {loan.status ? "Enabled" : "Disabled"}</p>
                        </div>
                        {!loan.status && (
                            <button 
                                onClick={() => handleEnable(loan._id)} 
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    padding: "5px 10px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Enable
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MDLoanList;
