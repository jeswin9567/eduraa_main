const mongoose = require('mongoose');

const PaymentOptionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  planType: {
    type: String,
    enum: ['mocktest', 'normal', 'premium'],  // Defines service level
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentOption = mongoose.model('PaymentOption', PaymentOptionSchema);

module.exports = PaymentOption;
