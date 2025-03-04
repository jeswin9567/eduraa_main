import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StudentProgress.css';

const StudentProgress = () => {
  const { studentEmail } = useParams();
  const [progress, setProgress] = useState([]);
  const [classProgress, setClassProgress] = useState(null);
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
        setClassProgress(response.data.classProgress);
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
      
      {/* Class Participation Section */}
      {classProgress && (
        <div className="class-participation">
          <h3>Class Participation</h3>
          <div className="participation-stats">
            <div className="stat-box">
              <span className="stat-number">{classProgress.completed}</span>
              <span className="stat-label">Classes Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{classProgress.total}</span>
              <span className="stat-label">Total Classes</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {((classProgress.completed / classProgress.total) * 100).toFixed(1)}%
              </span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Progress Section */}
      <div className="mock-test-progress">
        <h3>Mock Test Progress</h3>
        {progress.length > 0 ? (
          <div className="progress-table">
            <table>
              <thead>
                <tr>
                  <th>Mock Test</th>
                  <th>Description</th>
                  <th>Score</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Attempts</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((result, index) => (
                  <tr key={index}>
                    <td>{result.mockTestTitle}</td>
                    <td>{result.description}</td>
                    <td>{result.score}</td>
                    <td>{result.totalMarks}</td>
                    <td>{result.percentageScore.toFixed(2)}%</td>
                    <td>{result.attempts || 1}</td>
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
    </div>
  );
};

export default StudentProgress; 