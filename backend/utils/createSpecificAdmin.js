const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

// Plain text password - NOT RECOMMENDED for production
const plainTextPassword = 'admin123';

/**
 * Script to create an admin user with plain text password
 * WARNING: This bypasses security best practices
 * Run with: node utils/createSpecificAdmin.js
 */
const createAdminWithPlainPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');

    // Check if the specified admin exists
    const email = 'admin@gmail.com';
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log(`Admin with email ${email} already exists.`);
      console.log('Admin details:');
      console.log(`- ID: ${admin._id}`);
      console.log(`- Name: ${admin.name}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Role: ${admin.role}`);
      
      // Directly update password in MongoDB to bypass password hashing
      console.log('\nSetting plain text password for this admin...');
      
      // Use updateOne which bypasses Mongoose middleware
      await mongoose.connection.collection('users').updateOne(
        { _id: admin._id },
        { $set: { password: plainTextPassword } }
      );
      
      console.log('Plain text password set successfully!');
      console.log('WARNING: This is insecure and should only be used for testing!');
    } else {
      // First create user with temporary password through regular means
      const tempUser = await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'temporary', // This will be hashed
        role: 'admin'
      });
      
      // Then directly update with plain password to bypass hashing
      await mongoose.connection.collection('users').updateOne(
        { _id: tempUser._id },
        { $set: { password: plainTextPassword } }
      );
      
      console.log('Admin created successfully with plain text password:');
      console.log(`- ID: ${tempUser._id}`);
      console.log(`- Name: ${tempUser.name}`);
      console.log(`- Email: ${tempUser.email}`);
      console.log(`- Role: ${tempUser.role}`);
      console.log(`- Password: ${plainTextPassword} (stored as plain text - NOT SECURE!)`);
    }
    
    // Display warning about security
    console.log('\n⚠️ SECURITY WARNING ⚠️');
    console.log('Storing passwords as plain text is a serious security risk!');
    console.log('This should only be used for development/testing purposes.');
    
    // Disconnect from database
    await mongoose.connection.close();
    console.log('MongoDB disconnected.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Execute the function
createAdminWithPlainPassword();
