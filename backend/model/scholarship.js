const mongoose = require('mongoose');

// Define the Scholarship Schema
const ScholarShipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is mandatory
        trim: true // Removes leading/trailing spaces
    },
    description: {
        type: String,
        required: true,
        minlength: 10 // Ensure description is not too short
    },
    status: {
        type: Boolean,
        default: true,
    },
    award: {
        type: Number,
        required: true
    },
    eligibility: {
        type: String,
        required: true,
        enum: ['School', 'Undergraduate', 'Postgraduate', 'Diploma'] // Restrict eligibility to specific values
    },
    subEligibility: {
        type: [String], // Store the selected sub-options (e.g., classes, degrees, etc.)
        default: []
    },
    document: {
        type: String
    },
    startdate: {
        type: Date // Consider storing dates as actual Date objects
    },
    enddate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startdate;
            },
            message: 'End date must be after the start date'
        }
    },
    link: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v); // Basic URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    howToApply: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Common', 'Other'],
        required: true
    },
    category : {
        type:[String],
        default: []
    },
    states: {   
        type: String,
        required: true
    },
    awardDuration: {
        type: String,
        required:true
    },
    annualIncome: {
        type: Number,
        required: true
    },
    marks: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Automatically add `createdAt` and `updatedAt` timestamps
});

// Create the Scholarship Model from the Schema
const ScholarShipModel = mongoose.model("Scholarship", ScholarShipSchema);

// Export the Scholarship Model
module.exports = ScholarShipModel;
