const express = require('express');
const router = express.Router();
const Scholarship = require('../model/scholarship'); // Import your Scholarship model

// Search for scholarships
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search query from URL parameters

    try {
        // Perform a case-insensitive search in 'name', 'description', and 'eligibility' fields
        const scholarships = await Scholarship.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive search on 'name'
                { description: { $regex: query, $options: 'i' } }, // case-insensitive search on 'description'
                { eligibility: { $regex: query, $options: 'i' } } // case-insensitive search on 'eligibility'
            ]
        });

        res.status(200).json(scholarships); // Return the matching scholarships
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching for scholarships', error });
    }
});

module.exports = router;
