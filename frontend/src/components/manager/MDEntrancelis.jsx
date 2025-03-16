import React, { useEffect, useState } from "react";
import axios from "axios";

const MDEntranceList = () => {
    const [entrances, setEntrances] = useState([]);

    // Fetch entrances from the backend
    useEffect(() => {
        const fetchEntrances = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/viewentr/managerdel`); // Adjust the endpoint if needed
                setEntrances(response.data);
            } catch (error) {
                console.error("Error fetching entrances:", error);
            }
        };

        fetchEntrances();
    }, []);

    // Function to enable entrance (set status to true)
    const handleEnable = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/delentr/managerena/${id}`, { status: true });
            // Update the local state to reflect the change in status
            setEntrances(entrances.map(entrance => 
                entrance._id === id ? { ...entrance, status: true } : entrance
            ));
        } catch (error) {
            console.error("Error enabling entrance:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Entrance List</h2>
            <div>
                {entrances.map((entrance) => (
                    <div 
                        key={entrance._id} 
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
                            <strong>{entrance.name}</strong>
                            <p>Status: {entrance.status ? "Enabled" : "Disabled"}</p>
                        </div>
                        {!entrance.status && (
                            <button 
                                onClick={() => handleEnable(entrance._id)} 
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

export default MDEntranceList;
