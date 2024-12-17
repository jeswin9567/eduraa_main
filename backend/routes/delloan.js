const express = require('express');
const router = express.Router();
const LoanModel = require('../model/StudentLoan');


// DELETE route to remove an entrance by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the entrance by ID and delete it
        const loan = await LoanModel.findByIdAndUpdate(id, {status: false}, {new: true});

        // Check if the entrance was found and deleted
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' }); // HTTP 404 Not Found
        }

        // Return success response
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        console.error('Error deleting entrance:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/managerloan/:id', async (req, res) => {
    try {
        const loan = await LoanModel.findByIdAndUpdate(req.params.id, {status: true}, {new: true});

        if(!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        res.json(loan);
    } catch (error){
        console.error({message:error.message});
    }
});

module.exports = router;
