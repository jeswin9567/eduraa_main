import React, { useState } from "react";
import './teacherCalendar.css';

const TeacherCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminder, setReminder] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [dateReminders, setDateReminders] = useState([]);
  
  // Get current month details
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Month names array
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
  };

  const getAvailableHours = (selectedDate) => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    
    let startHour = isToday ? currentHour : 8;
    const endHour = 21; // 9 PM
    
    const hours = [];
    for (let hour = startHour; hour < endHour; hour++) {
      hours.push(hour.toString().padStart(2, '0'));
    }
    
    return hours;
  };

  const getAvailableMinutes = (selectedDate, hour) => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    const minutes = [];
    const startMinute = (isToday && parseInt(hour) === currentHour) ? currentMinute : 0;
    
    for (let minute = startMinute; minute < 60; minute++) {
      minutes.push(minute.toString().padStart(2, '0'));
    }
    
    return minutes;
  };

  const fetchReminders = async (date) => {
    try {
      const teacherEmail = localStorage.getItem("userEmail");
      const response = await fetch(
        `http://localhost:5000/api/teachercalendar/view-reminders?date=${date.toISOString()}&email=${teacherEmail}`
      );
      const data = await response.json();
      setDateReminders(data.reminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setSelectedDate(selected);
    fetchReminders(selected);
    setShowViewModal(true);
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHour || !selectedMinute) {
      alert("Please select both hour and minute!");
      return;
    }

    const selectedTime = `${selectedHour}:${selectedMinute}`;
    const teacherEmail = localStorage.getItem("userEmail");
    const reminderDateTime = new Date(selectedDate);
    reminderDateTime.setHours(parseInt(selectedHour), parseInt(selectedMinute), 0, 0);
    
    try {
      const response = await fetch('http://localhost:5000/api/teachercalendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherEmail,
          date: reminderDateTime,
          reminder,
        }),
      });

      if (response.ok) {
        setShowReminderModal(false);
        setReminder("");
        setSelectedHour("");
        setSelectedMinute("");
        setShowSuccessMessage(true);
        
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Failed to set reminder');
    }
  };

  // Create calendar grid
  const createCalendarGrid = () => {
    const grid = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDate = today.getDate();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isBeforeToday = 
        new Date(currentYear, currentMonth, day) < new Date().setHours(0, 0, 0, 0);
      
      grid.push(
        <div 
          key={day} 
          className={`calendar-day 
            ${isCurrentMonth && day === todayDate ? 'today' : ''} 
            ${isBeforeToday ? 'past-date' : ''}`
          }
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return grid;
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="success-message">
          Reminder set successfully!
        </div>
      )}
      
      <div className="calendar-box">
        <div className="calendar-nav">
          <div className="year-nav">
            <button onClick={handlePrevYear}>&lt;&lt;</button>
            <span>{currentYear}</span>
            <button onClick={handleNextYear}>&gt;&gt;</button>
          </div>
          <div className="month-nav">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{monthNames[currentMonth]}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-grid">
          {createCalendarGrid()}
        </div>
      </div>

      {/* View Reminders Modal */}
      {showViewModal && (
        <div className="reminder-modal-overlay">
          <div className="reminder-modal view-reminders">
            <h3>Reminders for {selectedDate?.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            
            <div className="reminders-list">
              {dateReminders.length > 0 ? (
                dateReminders.map((reminder, index) => (
                  <div key={index} className="reminder-item">
                    <div className="reminder-time">{reminder.time}</div>
                    <div className="reminder-text">{reminder.reminder}</div>
                    <div className="reminder-status">
                      Status: {reminder.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-reminders">No reminders for this date</p>
              )}
            </div>

            <div className="modal-buttons">
              <button 
                className="add-reminder-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setShowReminderModal(true);
                }}
              >
                Add New Reminder
              </button>
              <button 
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated Reminder Modal */}
      {showReminderModal && (
        <div className="reminder-modal-overlay">
          <div className="reminder-modal">
            <h3>Set Reminder</h3>
            <p className="selected-date">
              {selectedDate?.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <form onSubmit={handleReminderSubmit}>
              <div className="time-select">
                <label>Select Time:</label>
                <div className="time-inputs">
                  <select 
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    required
                  >
                    <option value="">Hour</option>
                    {getAvailableHours(selectedDate).map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  :
                  <select 
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    required
                  >
                    <option value="">Minute</option>
                    {getAvailableMinutes(selectedDate, selectedHour).map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                placeholder="Enter your reminder..."
                required
              />
              <div className="reminder-modal-buttons">
                <button type="submit">Set Reminder</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowReminderModal(false);
                    setReminder("");
                    setSelectedHour("");
                    setSelectedMinute("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherCalendar; 