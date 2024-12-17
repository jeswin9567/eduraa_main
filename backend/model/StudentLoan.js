const mongoose = require('mongoose');

const StudentLoanSchema = new mongoose.Schema({
    loanName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    bankWebsite: { type: String, required: true, trim: true },
    status : { type: Boolean, default: true},
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    loanType: { type: String, required: true, enum: ['domestic', 'international'] },
    fieldOfStudy: { type: [String], required: true },  // Array of selected categories
    repayment: { type: String, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    minInterestRate: { type: Number, required: true },
    maxInterestRate: { type: Number, required: true },
    collateral: { type: String },
    applicationProcess: { type: String, required: true, minlength: 10 },
    eligibilityCriteria: { type: String }
});

const StudentLoanModel = mongoose.model("loan", StudentLoanSchema);
module.exports = StudentLoanModel;

