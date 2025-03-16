import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './deletedmocktest.css';

const DeletedMockTests = ({ examId }) => {
  const [mockTests, setMockTests] = useState([]);

  useEffect(() => {
    // Fetch deleted mock tests
    axios.get(`${import.meta.env.VITE_API_URL}/mocktest/deletedmocktests`)
      .then(response => {
        setMockTests(response.data);
      })
      .catch(error => {
        console.error('Error fetching deleted mock tests:', error);
      });
  }, [examId]);

  const enableMockTest = (mockTestId) => {
    axios.put(`${import.meta.env.VITE_API_URL}/mocktest/enablemocktest/${mockTestId}`)
      .then(response => {
        alert('Mock test enabled successfully');
        // Optionally, refetch the deleted mock tests to update the list
        setMockTests(mockTests.filter(test => test._id !== mockTestId));
      })
      .catch(error => {
        console.error('Error enabling mock test:', error);
      });
  };

  return (
    <div className="deletedmocktest-container">
      <h2 className="deletedmocktest-header">Deleted Mock Tests</h2>
      {mockTests.length === 0 ? (
        <p className="deletedmocktest-message">No deleted mock tests found.</p>
      ) : (
        <ul className="deletedmocktest-list">
{mockTests.map(test => (
  <li key={test._id} className="deletedmocktest-item">
    <h4 className="deletedmocktest-title">{test.title}</h4>
    <p className="deletedmocktest-duration">Duration: {test.duration} minutes</p>
    <p className="deletedmocktest-totalMarks">Total Marks: {test.totalMarks}</p>
    <p className="deletedmocktest-entranceName">Entrance Exam: {test.examId.name}</p> {/* Display Entrance exam name */}
    <button 
      className="deletedmocktest-enableButton" 
      onClick={() => enableMockTest(test._id)}
    >
      Enable
    </button>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default DeletedMockTests;
