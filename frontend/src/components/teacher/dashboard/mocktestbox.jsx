import React, { useEffect, useState } from 'react';
import './MockTestStatusBox.css'; // Import the CSS file

const MockTestStatusBox = () => {
    const [status, setStatus] = useState({ active: 0, nonActive: 0 });
    const [loading, setLoading] = useState(true);
    const email = localStorage.getItem('userEmail'); // Assuming email is stored in localStorage

    useEffect(() => {
        const fetchMockTestStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/mocktest/mocktest-status?email=${email}`);
                const data = await response.json();
                setStatus({ active: data.activeMockTests, nonActive: data.nonActiveMockTests });
            } catch (error) {
                console.error('Error fetching mock test status:', error);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchMockTestStatus();
        }
    }, [email]);

    if (loading) {
        return <div className="mktbxcon loading">Loading...</div>;
    }

    return (
        <div className="mktbxcon">
            <h2>Mock Test Status</h2>
            <div className="mktbxcon__statusItem">
                <span>Active Tests:</span>
                <span className="mktbxcon__active">{status.active}</span>
            </div>
            <div className="mktbxcon__statusItem">
                <span>Non-Active Tests:</span>
                <span className="mktbxcon__nonActive">{status.nonActive}</span>
            </div>
        </div>
    );
};

export default MockTestStatusBox;
