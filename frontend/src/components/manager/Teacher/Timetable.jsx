import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Timetable.css';
import * as XLSX from 'xlsx';

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [allTimetables, setAllTimetables] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    teacherId: '',
    days: [],
    startTime: '',
    endTime: '',
    topic: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      fetchAllTimetables();
    }
  }, [teachers]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher-timetable/teachers`);
      setTeachers(response.data);
    } catch (error) {
      setError('Error fetching teachers');
    }
  };

  const fetchAllTimetables = async () => {
    try {
      const timetables = {};
      for (const teacher of teachers) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher-timetable/timetable/${teacher._id}`);
        timetables[teacher._id] = response.data?.timeSlots || [];
      }
      setAllTimetables(timetables);
    } catch (error) {
      setError('Error fetching timetables');
    }
  };

  const downloadTemplate = () => {
    const sampleData = [
      {
        teacherEmail: "teacher@example.com",
        days: "Monday,Tuesday,Wednesday",
        startTime: "09:00",
        endTime: "10:00",
        topic: "Mathematics"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    ws['!cols'] = [
      { wch: 30 }, // teacherEmail
      { wch: 30 }, // days
      { wch: 15 }, // startTime
      { wch: 15 }, // endTime
      { wch: 30 }  // topic
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable Template");
    XLSX.writeFile(wb, "timetable_template.xlsx");
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const row of jsonData) {
        const teacher = teachers.find(t => t.email === row.teacherEmail);
        if (!teacher) {
          setError(`Teacher with email ${row.teacherEmail} not found`);
          continue;
        }

        const timeSlot = {
          days: row.days.split(',').map(day => day.trim()),
          startTime: row.startTime,
          endTime: row.endTime,
          topic: row.topic
        };

        await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher-timetable/timetable`, {
          teacherId: teacher._id,
          timeSlots: [timeSlot]
        });
      }

      setSuccess('Timetable data uploaded successfully');
      fetchAllTimetables(); // Refresh the timetables
    } catch (error) {
      setError('Error processing Excel file: ' + error.message);
    }
  };

  const handleDeleteSlot = async (teacherId, slotId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/teacher-timetable/timetable/${teacherId}/slot/${slotId}`);
      fetchAllTimetables(); // Refresh all timetables
      setSuccess('Time slot deleted successfully');
    } catch (error) {
      setError('Error deleting time slot');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (manualEntry.days.length === 0) {
      setError('Please select at least one day');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher-timetable/timetable`, {
        teacherId: manualEntry.teacherId,
        timeSlots: [{
          days: manualEntry.days,
          startTime: manualEntry.startTime,
          endTime: manualEntry.endTime,
          topic: manualEntry.topic
        }]
      });

      setSuccess('Time slot added successfully');
      fetchAllTimetables();
      setManualEntry({
        teacherId: '',
        days: [],
        startTime: '',
        endTime: '',
        topic: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding time slot');
    }
  };

  const handleDaySelection = (day) => {
    setManualEntry(prev => {
      const updatedDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: updatedDays };
    });
  };

  return (
    <div className="mteaan-timetable-container">
      <h2 className="mteaan-title">Teacher Timetables</h2>

      <div className="mteaan-excel-controls">
        <button 
          type="button" 
          onClick={downloadTemplate}
          className="mteaan-template-btn"
        >
          <i className="fas fa-download"></i> Download Excel Template
        </button>
        
        <div className="mteaan-upload-section">
          <label htmlFor="excel-upload" className="mteaan-upload-label">
            <i className="fas fa-file-excel"></i> Upload Excel File
          </label>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="mteaan-file-input"
          />
        </div>
      </div>

      <div className="mteaan-manual-entry">
        <button 
          className="mteaan-add-btn"
          onClick={() => setShowManualForm(!showManualForm)}
        >
          <i className="fas fa-plus"></i> {showManualForm ? 'Hide Form' : 'Add Time Slot Manually'}
        </button>

        {showManualForm && (
          <form onSubmit={handleManualSubmit} className="mteaan-manual-form">
            <div className="mteaan-form-group">
              <label>Select Teacher:</label>
              <select
                value={manualEntry.teacherId}
                onChange={(e) => setManualEntry({...manualEntry, teacherId: e.target.value})}
                required
              >
                <option value="">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.firstname} {teacher.lastname}
                  </option>
                ))}
              </select>
            </div>

            <div className="mteaan-form-group">
              <label>Select Days:</label>
              <div className="mteaan-days-checkbox-group">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="mteaan-day-checkbox">
                    <input
                      type="checkbox"
                      id={`manual-${day}`}
                      checked={manualEntry.days.includes(day)}
                      onChange={() => handleDaySelection(day)}
                    />
                    <label htmlFor={`manual-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mteaan-form-row">
              <div className="mteaan-form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={manualEntry.startTime}
                  onChange={(e) => setManualEntry({...manualEntry, startTime: e.target.value})}
                  required
                />
              </div>

              <div className="mteaan-form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  value={manualEntry.endTime}
                  onChange={(e) => setManualEntry({...manualEntry, endTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="mteaan-form-group">
              <label>Topic:</label>
              <input
                type="text"
                value={manualEntry.topic}
                onChange={(e) => setManualEntry({...manualEntry, topic: e.target.value})}
                required
                placeholder="Enter topic"
              />
            </div>

            <button type="submit" className="mteaan-submit-btn">
              <i className="fas fa-plus-circle"></i> Add Time Slot
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="mteaan-error-message">
          {error.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
      {success && <div className="mteaan-success-message">{success}</div>}

      <div className="mteaan-all-timetables">
        {teachers.map(teacher => (
          <div key={teacher._id} className="mteaan-teacher-timetable-section">
            <div className="mteaan-teacher-header">
              <h3>{teacher.firstname} {teacher.lastname}'s Timetable</h3>
              <span className="mteaan-teacher-email">{teacher.email}</span>
            </div>
            {allTimetables[teacher._id]?.length > 0 ? (
              <div className="mteaan-table-wrapper">
                <table className="mteaan-timetable">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>Time</th>
                      <th>Topic</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTimetables[teacher._id].map((slot) => (
                      <tr key={slot._id}>
                        <td className="mteaan-days-cell">
                          {Array.isArray(slot.days) ? slot.days.map(day => (
                            <span key={day} className="mteaan-day-tag">{day}</span>
                          )) : slot.day}
                        </td>
                        <td>{slot.startTime} - {slot.endTime}</td>
                        <td>{slot.topic}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteSlot(teacher._id, slot._id)}
                            className="mteaan-delete-btn"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mteaan-no-slots">No time slots scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTimetable; 