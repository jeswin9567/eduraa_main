const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Login schema
const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default:true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    required: true
  }
}, { timestamps: true });

// Password hashing middleware for LoginModel
LoginSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
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

module.exports = LoginModel;
