const express = require('express');
const router = express.Router();
const Entrance = require('../model/Entrance');

// Search for Entrance
router.get('/searchentr', async (req, res) => {
    const { query } = req.query; // Get the search query from URL parameters

    try {
        // Perform a case-insensitive search in 'name', 'description', and 'eligibility' fields
        const entrances = await Entrance.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive search on 'name'
                { details: { $regex: query, $options: 'i' } }, // case-insensitive search on 'description'
                { education: { $regex: query, $options: 'i' } }, // case-insensitive search on 'eligibility'
                { examType: {$regex: query, $options:'i'}}
            ]
        });

        res.status(200).json(entrances); // Return the matching scholarships
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching for entrances', error });
    }
});

module.exports = router;
