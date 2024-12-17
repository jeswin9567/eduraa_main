const express = require('express');
const router = express.Router();
const EntranceModel = require('../model/Entrance');

// DELETE route to remove an entrance by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the entrance by ID and delete it
        const entrance = await EntranceModel.findByIdAndUpdate(id, {status: false}, {new: true});

        // Check if the entrance was found and deleted
        if (!entrance) {
            return res.status(404).json({ message: 'Entrance not found' }); // HTTP 404 Not Found
        }

        // Return success response
        res.status(200).json({ message: 'Entrance deleted successfully' });
    } catch (error) {
        console.error('Error deleting entrance:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/managerena/:id', async (req, res) => {
    try {
        const entrance = await EntranceModel.findByIdAndUpdate(req.params.id, { status: true }, { new: true });
        
        if (!entrance) {
            return res.status(404).json({ message: 'Entrance not found' });
        }

        res.json(entrance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
