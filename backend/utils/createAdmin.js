const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Load environment variables correctly
const envPath = path.resolve(__dirname, '..', '.env');
console.log(`Looking for .env file at: ${envPath}`);

if (fs.existsSync(envPath)) {
  console.log('.env file found, loading environment variables...');
  require('dotenv').config({ path: envPath });
} else {
  console.log('No .env file found in the expected location.');
}

const User = require('../models/User');

/**
 * Script to create a new admin user or verify admin exists
 * Run with: node utils/createAdmin.js
 */
const createAdmin = async () => {
  try {
    // Check environment variables
    console.log('\nEnvironment variables:');
    console.log('- MONGO_URI:', process.env.MONGO_URI || 'Not defined');
    console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '[HIDDEN]' : 'Not defined');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not defined');
    
    // Check if MONGO_URI is defined
    let mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.warn('⚠️ MONGO_URI environment variable is not defined!');
      mongoUri = 'mongodb://localhost:27017/shop_fashion';
      console.log(`Using default MongoDB URI: ${mongoUri}`);
    }
    
    console.log('\nConnecting to MongoDB...');
    console.log(`Connection URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Mask credentials
    
    // Connect to MongoDB with the URI
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully.');

    // Define admin credentials
    const adminData = {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: 'admin123', // Simple password for testing
      role: 'admin'
    };

    // Check if admin exists with the specified email
    console.log(`\nChecking if admin exists with email: ${adminData.email}`);
    let admin = await User.findOne({ email: adminData.email });
    
    if (admin) {
      console.log('Admin account already exists in the database:');
      console.log('- ID:', admin._id);
      console.log('- Email:', admin.email);
      console.log('- Name:', admin.name);
      console.log('- Role:', admin.role);
      
      console.log('\nResetting password to ensure it works...');
      
      // Use direct MongoDB operation to set the password
      // This bypasses Mongoose middleware
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      await mongoose.connection.collection('users').updateOne(
        { _id: admin._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log('Password reset successfully using direct MongoDB operation.');
    } else {
      console.log('Creating new admin account...');
      
      try {
        // First attempt - Let the User model's pre-save middleware handle password hashing
        admin = await User.create({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password, // Don't hash manually, let middleware do it
          role: 'admin'
        });
        
        console.log('Admin account created successfully:');
        console.log('- ID:', admin._id);
        console.log('- Email:', admin.email);
        console.log('- Name:', admin.name);
        console.log('- Role:', admin.role);
      } catch (error) {
        console.error('Error creating admin through Mongoose:', error);
        
        // Fallback - Try direct insertion if Mongoose model fails
        console.log('Trying direct MongoDB insertion as fallback...');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        
        const result = await mongoose.connection.collection('users').insertOne({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        });
        
        if (result.insertedId) {
          admin = await User.findOne({ _id: result.insertedId });
          console.log('Admin created via direct MongoDB insertion:');
          console.log('- ID:', admin._id);
          console.log('- Email:', admin.email);
          console.log('- Name:', admin.name);
          console.log('- Role:', admin.role);
        } else {
          throw new Error('Failed to create admin account via direct insertion');
        }
      }
    }
    
    // Verify login works by testing password match
    console.log('\nVerifying admin login credentials...');
    const userWithPassword = await User.findOne({ email: adminData.email }).select('+password');
    
    if (!userWithPassword) {
      console.error('Could not retrieve admin with password!');
      process.exit(1);
    }
    
    const isMatch = await bcrypt.compare(adminData.password, userWithPassword.password);
    
    if (isMatch) {
      console.log('✅ Password verification successful!');
      console.log('\nAdmin login credentials:');
      console.log('- Email:', adminData.email);
      console.log('- Password:', adminData.password);
      console.log('\nYou can now log in to the admin panel with these credentials.');
    } else {
      console.error('❌ Password verification failed!');
      console.error('The stored password does not match the expected password.');
      
      // Last resort - Force set plain password for debugging
      console.log('\nAttempting emergency password reset...');
      
      // Generate hash manually
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Update password directly in database
      await mongoose.connection.collection('users').updateOne(
        { email: adminData.email },
        { $set: { password: hashedPassword } }
      );
      
      console.log('Emergency password reset completed.');
      console.log('Please try again with these credentials:');
      console.log('- Email:', adminData.email);
      console.log('- Password:', adminData.password);
    }
    
    // Disconnect from database
    await mongoose.connection.close();
    console.log('MongoDB disconnected.');
    
  } catch (error) {
    console.error('Error:', error);
    
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('\n✖️ MongoDB connection failed. Please check your MongoDB Atlas credentials.');
    }
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n✖️ Connection refused. Make sure MongoDB is running on your system.');
    }
    
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
