const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Script to test admin login credentials
 * Run with: node utils/adminLoginTest.js <email> <password>
 */
const adminLoginTest = async (email, password) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');

    // Look for admin with provided email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      console.log(`❌ User ${email} exists but is not an admin (role: ${user.role})`);
      return;
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log(`✅ Login successful for admin: ${user.name} (${user.email})`);
      console.log('Admin details:');
      console.log(`- ID: ${user._id}`);
      console.log(`- Name: ${user.name}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Created: ${user.createdAt}`);
    } else {
      console.log(`❌ Password incorrect for user: ${email}`);
    }
    
    // Disconnect from database
    await mongoose.connection.close();
    console.log('MongoDB disconnected.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node adminLoginTest.js <email> <password>');
    console.log('Example: node adminLoginTest.js admin@gmail.com password123');
    process.exit(1);
  }
  
  const [email, password] = args;
  adminLoginTest(email, password);
}

module.exports = adminLoginTest;
