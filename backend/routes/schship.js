const express = require('express');
const router = express.Router();
const ScholarshipModel = require('../model/scholarship');

// POST route to create a new scholarship
router.post('/', async (req, res) => {
  const {
    name,
    description,
    award,
    eligibility,
    subEligibility, // Add subEligibility from frontend
    gender,
    category,
    document,
    startdate,
    enddate,
    link,
    howToApply,
    states,
    awardDuration,
    annualIncome,
    marks
  } = req.body;

  // Validate required fields
  if (!name || !description || !award || !eligibility || !gender || !category || !startdate  || !states|| !enddate || !awardDuration || !annualIncome || !marks) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  // Validate date range
  if (new Date(startdate) >= new Date(enddate)) {
    return res.status(400).json({ message: 'Start date must be before the end date.' });
  }

  // Optional: URL validation for the link field
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (link && !urlPattern.test(link)) {
    return res.status(400).json({ message: 'Invalid URL format for the link.' });
  }

  try {
    // Check if a scholarship with the same name already exists
    const existingScholarship = await ScholarshipModel.findOne({ name });
    if (existingScholarship) {
      return res.status(409).json({ message: 'Scholarship with this name already exists.' }); // HTTP 409 Conflict
    }

    // Create new Scholarship document
    const newScholarship = new ScholarshipModel({
      name,
      description,
      award,
      eligibility,
      subEligibility, // Save subEligibility options
      gender,
      category,
      document,
      startdate,
      enddate,
      link,
      howToApply,
      states,
      awardDuration,
      annualIncome,
      marks
    });

    // Save to database
    await newScholarship.save();

    // Return success response
    res.status(201).json({
      message: 'Scholarship created successfully',
      scholarship: newScholarship
    });

  } catch (error) {
    console.error('Error creating scholarship:', error.message);
    res.status(500).json({ message: 'Server error, unable to create scholarship' });
  }
});

module.exports = router;
