const express = require('express');
const router = express.Router();
const PaymentOption = require('../model/price');

router.post('/add-payment-option', async (req, res) => {
  const { amount, frequency } = req.body;

  try {
    // Check if a payment option with the given frequency already exists
    const existingOption = await PaymentOption.findOne({ frequency });

    if (existingOption) {
      return res.status(400).json({
        message: `A payment option for '${frequency}' already exists.`,
        existingOption,
      });
    }

    // If no existing option is found, create a new payment option
    const paymentOption = new PaymentOption({ amount, frequency });
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
    const paymentOptions = await PaymentOption.find({}, 'amount frequency'); // Select only amount and frequency
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
    // Check for duplicate price with the same frequency
    const existingPrice = await PaymentOption.findOne({
      _id: { $ne: req.params.id }, // Exclude the current document from the check
      amount,
      frequency,
    });

    if (existingPrice) {
      return res.status(400).json({ message: 'A price with the same amount and frequency already exists.' });
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
