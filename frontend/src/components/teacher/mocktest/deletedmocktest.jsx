import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './deletedmocktest.css';

const TeacherDeletedMockTestsCom = ({ examId }) => {
  const [mockTests, setMockTests] = useState([]);
  const email = localStorage.getItem('userEmail'); // Get teacher's email from local storage

  useEffect(() => {
    // Fetch deleted mock tests with email
    axios
      .get(`http://localhost:5000/mocktest/teacherdeletedmocktests`, {
        headers: { email }, // Pass email in headers
      })
      .then((response) => {
        setMockTests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching deleted mock tests:', error);
      });
  }, [examId, email]);

  const enableMockTest = (mockTestId) => {
    axios
      .put(`http://localhost:5000/mocktest/enablemocktest/${mockTestId}`)
      .then((response) => {
        alert('Mock test enabled successfully');
        setMockTests(mockTests.filter((test) => test._id !== mockTestId)); // Remove the enabled test from the list
      })
      .catch((error) => {
        console.error('Error enabling mock test:', error);
      });
  };

  return (
    <div className="teacher-deletedmocktest-container">
      <h2 className="teacher-deletedmocktest-header">Deleted Mock Tests</h2>
      {mockTests.length === 0 ? (
        <p className="teacher-deletedmocktest-message">No deleted mock tests found.</p>
      ) : (
        <ul className="teacher-deletedmocktest-list">
          {mockTests.map((test) => (
            <li key={test._id} className="teacher-deletedmocktest-item">
              <h4 className="teacher-deletedmocktest-title">{test.title}</h4>
              <p className="teacher-deletedmocktest-duration">Duration: {test.duration} minutes</p>
              <p className="teacher-deletedmocktest-totalMarks">Total Marks: {test.totalMarks}</p>
              <p className="teacher-deletedmocktest-entranceName">
                Entrance Exam: {test.examId.name}
              </p>
              <button
                className="teacher-deletedmocktest-enableButton"
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

export default TeacherDeletedMockTestsCom;
