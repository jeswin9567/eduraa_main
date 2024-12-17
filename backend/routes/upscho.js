const express = require('express');
const router = express.Router();
const ScholarshipModel = require('../model/scholarship');

// PUT route to update a loan by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedScholarship = await ScholarshipModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedScholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }
        res.status(200).json(updatedScholarship);
    } catch (error) {
        res.status(500).json({ message: 'Error updating scholarship', error });
    }
});

module.exports = router;
