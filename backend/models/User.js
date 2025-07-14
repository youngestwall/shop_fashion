const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Find admin users
UserSchema.statics.findAdmins = function() {
  return this.find({ role: 'admin' });
};

// Check if any admin exists in the system
UserSchema.statics.hasAdmin = async function() {
  const adminCount = await this.countDocuments({ role: 'admin' });
  return adminCount > 0;
};

// Create a default admin user if none exists
UserSchema.statics.createDefaultAdmin = async function(adminData) {
  try {
    // Check if admin already exists
    const adminExists = await this.hasAdmin();
    
    if (!adminExists) {
      // Create a new admin user
      const admin = await this.create({
        name: adminData.name || 'Admin',
        email: adminData.email || 'admin@gmail.com',
        password: adminData.password || 'admin123',
        role: 'admin'
      });
      
      return admin;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);
