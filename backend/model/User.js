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
  entranceField: {
    type: String,
    enum: [
      'Engineering', 
      'Medical & Healthcare', 
      'Management', 
      'Law', 
      'Arts & Humanities'
    ],
    required: false // Entrance field selection is mandatory
  },
  premiumExpiresAt: {
    type: Date, // Store expiration date
    default: null,
  },
  subscriptionPlan: {
    type: String,
    enum: ['weekly','monthly', 'yearly', null], // Store the plan type
    default: null,
  },
  participate: {
    type: Number,
    default: 0,
  },
  assignedTeacher: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  lastActivityDate: { type: Date },
  lastLoginDate: { 
    type: Date,
    default: null
  },
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  longestStreak: { 
    type: Number, 
    default: 0 
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

// Add this to your UserSchema definition
UserSchema.index({ premiumExpiresAt: 1 }, { 
  expireAfterSeconds: 0,
  partialFilterExpression: { premium: true }
});

// Add this method to your schema
UserSchema.methods.handlePremiumExpiration = async function() {
  if (this.premiumExpiresAt && this.premiumExpiresAt < new Date()) {
    this.premium = false;
    this.subscriptionPlan = null;
    this.premiumExpiresAt = null;
    await this.save();
  }
};

// Export the User model
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
