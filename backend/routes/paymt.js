const express = require('express');
const router = express.Router();
const PaymentModel = require('../model/payment');
const UserModel = require('../model/User');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Payment initiation endpoint
router.post('/process', async (req, res) => {
  const { email, amount, frequency } = req.body;

  try {
    // Find user by email to get userId
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user._id;

    // Create an order on Razorpay
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    // Send response with order and user details
    res.status(201).json({
      message: 'Payment initiated successfully',
      order,
      userDetails: {
        name: user.name,
        phone: user.phone,
      },
      userId, // Include userId in response to frontend
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// Payment success confirmation endpoint
router.post('/success', async (req, res) => {
  const { userId, email, amount, frequency, paymentId } = req.body;

  try {
    // Calculate expiration date based on frequency
    const expirationDate = new Date();
    if (frequency === 'monthly') {
      expirationDate.setDate(expirationDate.getDate() + 30);
    } else if (frequency === 'yearly') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    // Save payment details to the database
    const payment = new PaymentModel({
      userId,
      amount,
      email,
      frequency,
      expirationDate,
      razorpayPaymentId: paymentId,
    });

    await payment.save();

    // Update user premium status to true
    await UserModel.findByIdAndUpdate(userId, { premium: true });

    res.status(200).json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
});

module.exports = router;
