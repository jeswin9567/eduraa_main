const express = require('express');
const router = express.Router();
const Loan = require('../model/StudentLoan');

// Search for Entrance
router.get('/searchln', async (req, res) => {
    const { query } = req.query; // Get the search query from URL parameters

    try {
        // Perform a case-insensitive search in 'name', 'description', and 'eligibility' fields
        const loans = await Loan.find({
            $or: [
                { loanName: { $regex: query, $options: 'i' } }, // case-insensitive search on 'name'
                { bankName: { $regex: query, $options: 'i' } }, // case-insensitive search on 'description'
                { loanType: { $regex: query, $options: 'i' } }, // case-insensitive search on 'eligibility'
            ]
        });

        res.status(200).json(loans); // Return the matching scholarships
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching for Loans', error });
    }
});

module.exports = router;
