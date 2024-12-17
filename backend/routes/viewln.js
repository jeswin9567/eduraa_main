const express = require('express');
const router = express.Router();
const StudentLoanModel = require('../model/StudentLoan');

// Get all Details

// In your router file

router.get('/', async (req, res) => {
    try {
        const { bankName, loanType, fieldOfStudy, amount, interestRate } = req.query;

        // Build a filter object based on provided query parameters
        const filter = {status: true};
        
        if (bankName) {
            filter.bankName = { $in: bankName.split(',') }; // If multiple bank names are selected
        }
        if (loanType) {
            filter.loanType = { $in: loanType.split(',') }; // If multiple loan types are selected
        }
        if (fieldOfStudy) {
            filter.fieldOfStudy = { $in: fieldOfStudy.split(',') }; // If multiple fields of study are selected
        }
        if (amount) {
            filter.maxAmount = { $gte: amount }; // Loans with max amount greater than or equal to the selected amount
        }
        if (interestRate) {
            filter.minInterestRate = { $lte: interestRate }; // Loans with min interest rate less than or equal to the selected interest rate
        }

        const loans = await StudentLoanModel.find(filter);
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Get loans where status is false
router.get('/managerdellaon', async (req, res) => {
    try {
        const loans = await StudentLoanModel.find({ status: false }); // Fetch loans with status false

        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: "No loans found" });
        }
        
        // If loans are found, return them with a 200 status code
        return res.status(200).json(loans); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get by Id

router.get('/:id', async (req, res) => {
    try {
        const Loans = await StudentLoanModel.findById(req.params.id);
        if (!Loans) return res.status(404).json({ message: 'Loan not found' });
        res.json(Loans);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;