const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  email: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true,
  },
  planType: {  // Ensure planType is stored
    type: String,
    enum: ['mocktest', 'normal', 'premium'],  
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const PaymentModel = mongoose.model('Payment', PaymentSchema);

module.exports = PaymentModel;
