const express = require('express');
const router = express.Router();
const EntranceModel = require('../model/Entrance')// Make sure the path is correct

// Middleware to validate dates
const validateDates = (startdate, enddate) => {
    const start = new Date(startdate);
    const end = new Date(enddate);
    const today = new Date();

    if (start < today) {
        return { valid: false, message: 'Start date must be today or in the future.' };
    }
    if (end <= start) {
        return { valid: false, message: 'End date must be after the start date.' };
    }
    return { valid: true };
};

// POST route to create a new entrance
router.post('/', async (req, res) => {
    const { 
        name, 
        details, 
        education, 
        degree, 
        marksGeneral, 
        marksBackward, 
        syllabus, 
        startdate, 
        enddate, 
        howtoapply, 
        link ,
        state,
        examType
    } = req.body;


    // Check for missing fields
    if (!name || !details || !education || !marksGeneral || !marksBackward || !syllabus || !startdate || !enddate || 
        !howtoapply || !link || !state || !examType) {
        return res.status(400).json({ message: 'All required fields must be complete' });
    }

    // Validate date fields
    // const dateValidation = validateDates(startdate, enddate);
    // if (!dateValidation.valid) {
    //     return res.status(400).json({ message: dateValidation.message });
    // }

    try {
        // Check if the entrance with the same name already exists
        const existingEntrance = await EntranceModel.findOne({ name });
        if (existingEntrance) {
            return res.status(409).json({ message: 'Entrance with this name already exists' }); // HTTP 409 Conflict
        }

        // Create a new entrance if it doesn't exist
        const newEntrance = new EntranceModel({
            name,
            details,
            education,
            degree,
            marksGeneral,
            marksBackward,
            syllabus,
            startdate,
            enddate,
            howtoapply,
            link,
            state,
            examType
        });

        // Save to database
        await newEntrance.save();

        // Return success response
        res.status(201).json({
            message: 'Entrance created successfully',
            entrance: newEntrance
        });
    } catch (error) {
        console.error('Error creating entrance:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
