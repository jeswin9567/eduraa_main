const express = require('express');
const router = express.Router();
const LoanModel = require('../model/StudentLoan');

// PUT route to update a loan by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        loanName, 
        bankName, 
        bankWebsite, 
        contactNumber, 
        email, 
        loanType, 
        fieldOfStudy, 
        repayment,
        minAmount, 
        maxAmount, 
        minInterestRate, 
        maxInterestRate, 
        collateral, 
        applicationProcess, 
        eligibilityCriteria // Added eligibility criteria
    } = req.body;

    try {
        // Find the loan by ID and update it
        const loan = await LoanModel.findByIdAndUpdate(
            id,
            {
                loanName,
                bankName,
                bankWebsite,
                contactNumber,
                email,
                loanType,
                fieldOfStudy,
                repayment,
                minAmount,
                maxAmount,
                minInterestRate,
                maxInterestRate,
                collateral,
                applicationProcess,
                eligibilityCriteria // Update eligibility criteria
            },
            { new: true, runValidators: true }
        );

        // Check if the loan was found and updated
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Return the updated loan
        res.status(200).json(loan);
    } catch (error) {
        console.error('Error updating loan:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
