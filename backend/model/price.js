const mongoose = require('mongoose');

const PaymentOptionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0  // Ensures the amount is positive
  },
  frequency: {
    type: String,
    enum: ['weekly','monthly', 'yearly'],  // Only allows "monthly" or "yearly"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // Automatically sets the creation date
  }
});

const PaymentOption = mongoose.model('PaymentOption', PaymentOptionSchema);

module.exports = PaymentOption;
