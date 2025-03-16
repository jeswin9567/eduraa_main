import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MockTestList.css'; // Optional CSS file for styling

const MockTestList = () => {
  const { examId } = useParams(); // Get the exam ID from the URL
  const [mockTests, setMockTests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch mock tests for the specific entrance exam
  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mocktest/viewmocktests/${examId}`); // Adjust URL to your API endpoint
        setMockTests(response.data);
      } catch (error) {
        setError('Error fetching mock tests');
        console.error('Error fetching mock tests:', error);
      }
    };
    fetchMockTests();
  }, [examId]);

  // Handle delete mock test
  const handleDelete = async (mockTestId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/mocktest/mockTest/deactivate/${mockTestId}`);
      // Filter out the deleted mock test from the list
      setMockTests(mockTests.filter((mockTest) => mockTest._id !== mockTestId));
    } catch (error) {
      setError('Error deleting mock test');
      console.error('Error deleting mock test:', error);
    }
  };

  // Handle navigation to the update form
  const handleUpdate = (mockTestId) => {
    navigate(`/manager/updatemocktest/${mockTestId}`); // Adjust route as needed
  };

  // Handle navigation to the mock test details page
  const handleView = (mockTestId) => {
    navigate(`/manager/mocktestdetails/${mockTestId}`); // Adjust route as needed
  };

  return (
    <div className="manvmoc-list">
      <h2>Mock Tests for Entrance Exam</h2>
      {error && <p className="manvmoc-error-message">{error}</p>}
      <div className="mocktest-grid">
        {mockTests.map((mockTest) => (
          <div key={mockTest._id} className="manvmoc-item">
            <h3>{mockTest.title}</h3>
            <p>Duration: {mockTest.duration} minutes</p>
            <p>Total Marks: {mockTest.totalMarks}</p>
            <p>Questions: {mockTest.numberOfQuestions}</p>
            <p>Passing Marks: {mockTest.passingMarks}</p>
            
            {/* Update button */}
            <button 
              className="manvmoc-update-button" 
              onClick={() => handleUpdate(mockTest._id)}
            >
              Update
            </button>

            {/* Delete button */}
            <button 
              className="manvmoc-delete-button" 
              onClick={() => handleDelete(mockTest._id)}
            >
              Delete
            </button>

            {/* View button */}
            <button 
              className="manvmoc-view-button" 
              onClick={() => handleView(mockTest._id)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTestList;
