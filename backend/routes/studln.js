const express = require('express');
const router = express.Router();
const StudentLoanModel = require('../model/StudentLoan');

// Route to create a new student loan
router.post('/', async (req, res) => {
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
        eligibilityCriteria
    } = req.body;

    // Check if all required fields are present
    if (
        !loanName ||
        !bankName ||
        !bankWebsite ||
        !contactNumber ||
        !email ||
        !loanType ||
        !fieldOfStudy||
        !repayment ||
        !minAmount ||
        !maxAmount ||
        !minInterestRate ||
        !maxInterestRate ||
        !applicationProcess
    ) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        // Check if a loan with the same name already exists
        const existingLoan = await StudentLoanModel.findOne({ loanName });
        if (existingLoan) {
            return res.status(409).json({ message: 'Student Loan with this name already exists' }); // HTTP 409 Conflict
        }

        // Create a new student loan
        const newStudentLoan = new StudentLoanModel({
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
            eligibilityCriteria, // Optional fielda
            status:true,
        });

        // Save the new loan
        await newStudentLoan.save();
        res.status(201).json({
            message: 'Loan created successfully',
            loan: newStudentLoan
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
