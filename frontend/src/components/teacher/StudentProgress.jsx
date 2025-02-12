import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StudentProgress.css';

const StudentProgress = () => {
  const { studentEmail } = useParams();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const teacherEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/viewassign/student-progress/${studentEmail}`,
          {
            params: { teacherEmail }
          }
        );
        setProgress(response.data.progress);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student progress');
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, [studentEmail, teacherEmail]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="student-progress">
      <h2>Progress for {progress.length > 0 ? progress[0].studentName : studentEmail}</h2>
      {progress.length > 0 ? (
        <div className="progress-table">
          <table>
            <thead>
              <tr>
                <th>Mock Test</th>
                <th>Score</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((result, index) => (
                <tr key={index}>
                  <td>{result.mockTestTitle}</td>
                  <td>{result.score}</td>
                  <td>{result.totalMarks}</td>
                  <td>{((result.score / result.totalMarks) * 100).toFixed(2)}%</td>
                  <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No mock tests attempted yet.</p>
      )}
    </div>
  );
};

export default StudentProgress; 