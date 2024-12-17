const express = require('express');
const router = express.Router();
const ScholarshipModel = require('../model/scholarship'); // Adjust the path based on your file structure

// DELETE route to remove a scholarship by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {   
        // Find the scholarship by ID and delete it
        const scholarship = await ScholarshipModel.findByIdAndUpdate(id, {status: false}, {new: true});

        // Check if the scholarship was found and deleted
        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' }); // HTTP 404 Not Found
        }

        // Return success response
        res.status(200).json({ message: 'Scholarship deleted successfully' });
    } catch (error) {
        console.error('Error deleting scholarship:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/managerescho/:id', async (req, res) => {
    try {
        const scholarship = await ScholarshipModel.findByIdAndUpdate(req.params.id, { status: true }, { new: true });
        
        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        res.json(scholarship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
