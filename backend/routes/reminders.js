const express = require('express');
const router = express.Router();
const Reminder = require('../model/Reminder');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to check and send reminders
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    // Find reminders that are due (within the last minute) and still pending
    const dueReminders = await Reminder.find({
      status: 'pending',
      date: {
        $gte: new Date(now - 60000), // 1 minute ago
        $lte: now
      }
    });

    for (const reminder of dueReminders) {
      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reminder.teacherEmail,
        subject: "Reminder Alert!",
        html: `
          <h2>Reminder Alert</h2>
          <p><strong>Time:</strong> ${reminder.time}</p>
          <p><strong>Message:</strong> ${reminder.reminder}</p>
        `
      };

      await transporter.sendMail(mailOptions);

      // Update reminder status to completed
      reminder.status = 'completed';
      await reminder.save();
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Set up interval to check reminders every minute
setInterval(checkAndSendReminders, 60000); // Check every minute

router.post('/add', async (req, res) => {
  try {
    const { teacherEmail, date, reminder } = req.body;
    
    // Extract time from the date object
    const reminderTime = new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });

    const newReminder = new Reminder({
      teacherEmail,
      date,  // Stores complete date and time
      time: reminderTime,  // Stores time separately
      reminder,
      status: 'pending'
    });

    await newReminder.save();

    // Format date for email
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: teacherEmail,
      subject: "New Reminder Set",
      html: `
        <h2>New Reminder</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${reminderTime}</p>
        <p><strong>Reminder:</strong> ${reminder}</p>
        <br>
        <p>This is an automated reminder notification from your calendar.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Reminder set successfully and email sent' });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});

// Add this route to get reminders for a specific date
router.get('/view-reminders', async (req, res) => {
  try {
    const { date, email } = req.query;
    const selectedDate = new Date(date);
    
    // Set time to start of day and end of day
    const startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endDate = new Date(selectedDate.setHours(23, 59, 59, 999));

    const reminders = await Reminder.find({
      teacherEmail: email,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    res.json({ reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

module.exports = router; 