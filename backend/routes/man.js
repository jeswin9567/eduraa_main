const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ManagerModel = require('../model/Manager');
const nodemailer = require('nodemailer');
const LoginModel = require('../model/login');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config();

// Function to validate email domain using DNS
const validateEmailDomain = (email) => {
  const domain = email.split('@')[1]; // Extract domain from email
  return new Promise((resolve, reject) => {
    // Lookup MX records for the domain
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        resolve(false); // Domain is not valid if there's an error or no MX records
      } else {
        resolve(true); // Domain is valid
      }
    });
  });
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.get('/managers', async (req, res) => {
  try {
    const managers = await ManagerModel.find(); // Retrieve all managers
    res.json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Failed to fetch managers' });
  }
});

// Route to toggle manager status (already provided for reference)
router.put('/managers/toggleStatus/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update status in ManagerModel
    const manager = await ManagerModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    // Update status in LoginModel
    await LoginModel.findOneAndUpdate({ email: manager.email }, { status });

    // Send deactivation email if status is set to false
    if (!status) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: manager.email,
        subject: 'Account Deactivation Notification',
        text: `Hello ${manager.name},\n\nYour manager account has been deactivated due to certain policy requirements or performance concerns.\n\nIf you believe this was done in error or would like to discuss further, please contact the admin at admin@example.com.\n\nThank you,\nAdmin Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending deactivation email:', error);
        } else {
          console.log('Deactivation email sent:', info.response);
        }
      });
    }

    res.json({ message: 'Status updated successfully', status: manager.status });
  } catch (error) {
    console.error('Error updating manager status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/', async (req, res) => {
  const { name, email, password, confirmPass } = req.body;

  // Check if passwords match
  if (password !== confirmPass) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Validate email domain
  const isDomainValid = await validateEmailDomain(email);
  if (!isDomainValid) {
    return res.status(400).json({ message: 'Invalid email domain' });
  }

  try {
    // Check if the manager already exists
    const existingManager = await ManagerModel.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: 'Manager already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create manager in ManagerModel
    const manager = await ManagerModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPass: hashedPassword
    });

    // Create login in LoginModel with role as 'manager'
    const login = await LoginModel.create({
      email,
      password: password,
      role: 'manager'
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Ensure you use the environment variable for sender email
      to: email,  // Send to the manager's email
      subject: 'Manager Account Created',
      text: `Hello ${name},\n\nYour manager account has been created successfully.\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after your first login.\n\nBest regards,\nAdmin Team`
    };

    // Send email with login details
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Manager created but error sending email', error });
      } else {
        console.log('Email sent:', info.response);
        res.status(201).json({ message: "Manager created and email sent successfully", manager, login });
      }
    });

  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Error creating manager', error });
  }
});

module.exports = router;
