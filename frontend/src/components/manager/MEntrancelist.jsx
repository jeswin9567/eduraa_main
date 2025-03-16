import React, { useEffect, useState } from 'react';
import '../../components/admin/Entrancelist.css'
import { Link } from 'react-router-dom';


const MEntranceList = () => {
    const [entrances, setEntrances] = useState([]);

    useEffect(() => {
        const fetchEntrances = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/viewentr`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEntrances(data);
            } catch (error) {
                console.error('Failed to fetch entrances:', error);
            }
        };

        fetchEntrances();
    }, []);

    return (
        <div className="entrance-list">
            {entrances.map((entrance) => (
                <div key={entrance._id} className="entrance-item">
                    <Link to={`/mventrancedetails/${entrance._id}`}>
                        <div className="entrance-name">{entrance.name}</div>
                        <div className="entrance-dates">
                            {entrance.startdate && entrance.enddate
                                ? `${new Date(entrance.startdate).toLocaleDateString()} - ${new Date(entrance.enddate).toLocaleDateString()}`
                                : 'Dates not available'}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default MEntranceList;
