const express = require('express');
const router = express.Router();
const ScholarShipModel = require('../model/scholarship');

// GET all scholarships
router.get('/', async (req, res) => {
    try {
        const { eligibility, subEligibility, gender, category, states, awardDuration, annualIncome, marks } = req.query;
        const filter = {status: true};

        if (eligibility) {
            filter.eligibility = { $in: eligibility.split(',') };
        }
        if (subEligibility) {
            filter.subEligibility = { $in: subEligibility.split(',') };
        }
        if (gender) {
            filter.gender = { $in: gender.split(',') };
        }
        if (category) {
            filter.category = { $in: category.split(',') };
        }
        if (states) {
            filter.states = { $in: states.split(',') };
        }
        if (awardDuration) {
            filter.awardDuration = { $in: awardDuration.split(',') };
        }
        if (annualIncome) {
            const incomeLimit = parseFloat(annualIncome); // Convert to number
            if (!isNaN(incomeLimit)) {
                filter.annualIncome = { $lte: incomeLimit }; // Compare as number
            }
        }
        
        if (marks) {
            filter.marks = { $gte: marks }; // Ensure it's a number
        }

        const scholarships = await ScholarShipModel.find(filter);
        res.json(scholarships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// to get deleted

router.get('/managerdelscho', async(req, res) => {
    try {
        const scholarship = await ScholarShipModel.find({status:false});

        if(!scholarship || scholarship.length === 0) {
            return res.status(404).json({ message: 'No scholarship found' });
        }

        res.json(scholarship);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
})

// GET a specific scholarship by ID
router.get('/:id', async (req, res) => {
    try {
        const scholarship = await ScholarShipModel.findById(req.params.id); // Fetch by ID
        if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
        res.json(scholarship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
