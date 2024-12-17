const express = require('express');
const router = express.Router();
const EntranceModel = require('../model/Entrance');
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
