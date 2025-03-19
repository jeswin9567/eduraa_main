const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Login schema
const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager', 'teacher', 'agent'],
    required: true
  }
}, { 
  timestamps: true,
  autoIndex: process.env.NODE_ENV !== 'production'
});

// Password hashing middleware for LoginModel
LoginSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.role !== 'admin') {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords for login attempts
LoginSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the Login model
const LoginModel = mongoose.model('Login', LoginSchema);

// Add index for common queries
LoginModel.collection.createIndex({ email: 1, status: 1 });

module.exports = LoginModel;
