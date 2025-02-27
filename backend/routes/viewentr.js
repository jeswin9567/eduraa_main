const express = require('express');
const router = express.Router();
const EntranceModel = require('../model/Entrance');
const Teacher = require('../model/Teacher');
const { route } = require('./delentrc');

// Get all Details
router.get('/', async (req, res) => {
    try {
        const { education, examType, state, degrees } = req.query;
        const filter = {status: true};

        if (education) {
            filter.education = { $in: education.split(',') };
        }
        if (examType) {
            filter.examType = { $in: examType.split(',') };
        }
        if (state) {
            filter.state = { $in: state.split(',') };
        }
        if (degrees) {
            filter.degree = { $in: degrees.split(',') };
        }

        // Fix: apply the filter when querying the database
        const entrances = await EntranceModel.find(filter);
        res.json(entrances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add this new route to get unique exam types
router.get('/exam-types', async (req, res) => {
  try {
    const uniqueExamTypes = await EntranceModel.distinct('examType', { status: true });
    res.json(uniqueExamTypes);
  } catch (error) {
    console.error('Error fetching exam types:', error);
    res.status(500).json({ message: 'Error fetching exam types' });
  }
});

// get the deleted
router.get('/managerdel', async (req, res) => {
    try {
        // Fetch entries where status is false
        const entrance = await EntranceModel.find({ status: false });
        
        if (!entrance || entrance.length === 0) {
            return res.status(404).json({ message: 'No entrances found with status false' });
        }

        res.json(entrance);  // Return the filtered entries
    } catch (error) {
        res.status(500).json({ message: error.message });  // Handle server errors
    }
});

// Add this new route to get entrances based on teacher's exam types
router.get('/teacher-assigned-entrances', async (req, res) => {
    try {
        const teacherEmail = req.headers.email;
        if (!teacherEmail) {
            return res.status(400).json({ message: 'Teacher email is required' });
        }

        // Get teacher's assigned exam types
        const teacher = await Teacher.findOne({ email: teacherEmail });
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (!teacher.examTypes || teacher.examTypes.length === 0) {
            return res.status(400).json({ message: 'No exam types assigned to teacher' });
        }

        // Find entrances that match teacher's exam types
        const entrances = await EntranceModel.find({
            examType: { $in: teacher.examTypes },
            status: true
        });

        res.json(entrances);
    } catch (error) {
        console.error('Error fetching teacher entrances:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get by Id
router.get('/:id', async (req, res) => {
    try {
        const entrance = await EntranceModel.findById(req.params.id);
        if (!entrance) return res.status(404).json({ message: 'Entrance not found' });
        res.json(entrance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
