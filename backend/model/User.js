const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  // New fields
  education: {
    type: String,
    enum: ['10', '+2', 'Undergraduate', 'PostGraduate'], // Dropdown options
    required: false 
  },
  courses: {
    type: [String], // Array of courses based on education level
    default: []
  },
  marks: {
    tenthMark: {
      type: Number,
      default: 0
    },
    twelfthMark: {
      type: Number,
      default: 0
    },
    degreeMark: {
      type: Number,
      default: 0
    },
    pgMark: {
      type: Number,
      default: 0
    }
  },
  premium: {
    type: Boolean,
    default: false,
  },

  participate: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
