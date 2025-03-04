import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Performance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/quiz/performance/${userEmail}`);
                console.log('Performance data received:', response.data);
                setPerformanceData(response.data);
            } catch (error) {
                console.error('Error fetching performance:', error);
            }
        };

        if (userEmail) {
            fetchPerformance();
        }
    }, [userEmail]);

    if (!performanceData.length) {
        return <div>No performance data available</div>;
    }

    return (
        <div>
            <h2>Your Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Average Score</th>
                    </tr>
                </thead>
                <tbody>
                    {performanceData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.subject}</td>
                            <td>{item.topic}</td>
                            <td>{item.averagePercentage}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Performance; 