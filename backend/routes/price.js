const express = require('express');
const router = express.Router();
const PaymentOption = require('../model/price');

router.post('/add-payment-option', async (req, res) => {
  const { amount, frequency, planType } = req.body;

  try {
    // Validate planType based on frequency
    const planMapping = {
      weekly: 'mocktest',
      monthly: 'normal',
      yearly: 'premium'
    };

    if (planMapping[frequency] !== planType) {
      return res.status(400).json({
        message: `Invalid plan type '${planType}' for ${frequency} subscription.`
      });
    }

    // Check if a payment option with the given frequency already exists
    const existingOption = await PaymentOption.findOne({ frequency });

    if (existingOption) {
      return res.status(400).json({
        message: `A payment option for '${frequency}' already exists.`,
        existingOption
      });
    }

    // Create new payment option
    const paymentOption = new PaymentOption({ amount, frequency, planType });
    await paymentOption.save();

    res.status(201).json({ 
      message: 'Payment option added successfully', 
      paymentOption 
    });
  } catch (error) {
    console.error('Error adding payment option:', error);
    res.status(500).json({ 
      message: 'Error adding payment option', 
      error 
    });
  }
});



// Payment options retrieval route
router.get('/view/payment-options', async (req, res) => {
  try {
    const paymentOptions = await PaymentOption.find({}, 'amount frequency planType'); // Include planType
    res.json(paymentOptions);
  } catch (error) {
    console.error('Error fetching payment options:', error);
    res.status(500).json({ message: 'Server error. Failed to fetch payment options.' });
  }
});


// to see the prices

router.get('/prices', async (req, res) => {
  try {
    const paymentOptions = await PaymentOption.find();
    res.status(200).json(paymentOptions);
  } catch (error) {
    console.error('Error fetching payment options:', error);
    res.status(500).json({ error: 'Failed to fetch payment options' });
  }
});

// Route to get details of a specific price by ID
router.get('/vprices/:id', async (req, res) => {
  try {
    const price = await PaymentOption.findById(req.params.id);
    if (!price) {
      return res.status(404).json({ error: 'Price not found' });
    }
    res.status(200).json(price);
  } catch (error) {
    console.error('Error fetching price details:', error);
    res.status(500).json({ error: 'Failed to fetch price details' });
  }
}); 


// In routes/paymentOptions.js
router.put('/prices/:id', async (req, res) => {
  const { amount, frequency } = req.body;

  try {
    // Validate the plan type for the given frequency
    const planMapping = {
      weekly: 'mocktest',
      monthly: 'normal',
      yearly: 'premium'
    };

    const validPlanType = planMapping[frequency];

    if (!validPlanType) {
      return res.status(400).json({ message: `Invalid frequency: '${frequency}'.` });
    }

    // Ensure the correct planType is set
    req.body.planType = validPlanType;

    // Check if a payment option with the same frequency already exists (excluding the current one)
    const existingPrice = await PaymentOption.findOne({
      _id: { $ne: req.params.id },
      frequency
    });

    if (existingPrice) {
      return res.status(400).json({ message: `A payment option for '${frequency}' already exists.` });
    }

    // Proceed with the update if no duplicate found
    const updatedPrice = await PaymentOption.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPrice) {
      return res.status(404).json({ message: 'Payment option not found.' });
    }

    res.status(200).json(updatedPrice);
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'Failed to update price' });
  }
});




module.exports = router;


// module.exports = router;
