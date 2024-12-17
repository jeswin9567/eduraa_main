import React, { useState, useEffect } from "react";
import axios from "axios";

const MDScholarshipList = () => {
    const [scholarships, setScholarships] = useState([]);

    // Fetch scholarship details when the component is mounted
    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/viewscho/managerdelscho'); // Correct URL
                setScholarships(response.data);
            } catch (error) {
                console.error("Error fetching scholarships:", error);
            }
        };

        fetchScholarshipDetails();
    }, []);

    // Handle enabling the scholarship (change status to true)
    const handleEnable = async (id) => {
        try {
            await axios.put(`http://localhost:5000/delscho/managerescho/${id}`, { status: true });  // Correct URL
            setScholarships(scholarships.map(scholarship =>
                scholarship._id === id ? { ...scholarship, status: true } : scholarship
            ));
        } catch (error) {
            console.log("Error enabling scholarship:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Scholarship List</h2>
            <div>
                {scholarships.map((scholarship) => (
                    <div 
                        key={scholarship._id} 
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
                            <strong>{scholarship.name}</strong>
                            <p>Status: {scholarship.status ? "Enabled" : "Disabled"}</p>
                        </div>
                        {!scholarship.status && (
                            <button 
                                onClick={() => handleEnable(scholarship._id)} 
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

export default MDScholarshipList;
