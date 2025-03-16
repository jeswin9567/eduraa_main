import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './managemanager.css'; // Updated CSS styling

const VManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/man/managers`); // Adjust the URL to match your backend endpoint
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
        setError('Failed to fetch managers. Please try again later.');
      }
    };
    fetchManagers();
  }, []);

  const toggleStatus = async (managerId, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/man/managers/toggleStatus/${managerId}`, { status: !currentStatus });
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager._id === managerId ? { ...manager, status: !currentStatus } : manager
        )
      );
    } catch (error) {
      console.error('Error updating manager status:', error);
      setError('Failed to update status. Please try again later.');
    }
  };

  return (
    <div className="mmanager-list-container">
      <h2>Manager List</h2>
      {error && <p className="merror-message">{error}</p>}
      <table className="mmanager-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((manager) => (
            <tr key={manager._id}>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td className={manager.status ? 'mstatus-active' : 'mstatus-inactive'}>
                {manager.status ? 'Active' : 'Inactive'}
              </td>
              <td>
                <button id = "deactivate"
                  className={`mstatus-toggle-button ${manager.status ? 'mdeactivate' : 'mactivate'}`}
                  onClick={() => toggleStatus(manager._id, manager.status)}
                >
                  {manager.status ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VManagerList;
