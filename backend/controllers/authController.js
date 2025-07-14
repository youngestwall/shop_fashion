const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login admin user
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user and explicitly include the password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to admin users',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Log successful login
    console.log(`Admin login successful: ${user.email}`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    next(error);
  }
};

// @desc    Login admin with plain text password (development only)
// @route   POST /api/auth/admin-debug-login
// @access  Public
exports.adminDebugLogin = async (req, res, next) => {
  try {
    console.log('Admin debug login attempt:', req.body.email);
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user but don't select password since we'll do direct comparison
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Debug login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('Debug login failed: User is not admin');
      return res.status(403).json({
        success: false,
        message: 'Access restricted to admin users',
      });
    }

    // Special debug: Compare directly with stored password
    // WARNING: Only for development/testing!
    const storedPassword = await mongoose
      .connection
      .collection('users')
      .findOne({ _id: user._id }, { projection: { password: 1 } });

    console.log('Comparing passwords:', {
      provided: password,
      stored: storedPassword?.password || 'not-found',
    });

    if (!storedPassword || storedPassword.password !== password) {
      console.log('Debug login failed: Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '30d',
      }
    );

    console.log('Debug login successful!');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Debug login error:', error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Check if first admin setup is needed
// @route   GET /api/auth/check-first-admin
// @access  Public
exports.checkFirstAdmin = async (req, res, next) => {
  try {
    const hasAdmin = await User.hasAdmin();

    res.status(200).json({
      success: true,
      isFirstAdminSetup: !hasAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Setup first admin account
// @route   POST /api/auth/setup-first-admin
// @access  Public (but protected by secret key)
exports.setupFirstAdmin = async (req, res, next) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Verify the secret setup key
    const correctSecretKey = process.env.ADMIN_SETUP_KEY || 'admin123';
    if (secretKey !== correctSecretKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid secret key',
      });
    }

    // Check if we already have admins
    const hasAdmin = await User.hasAdmin();
    if (hasAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists',
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register additional admin
// @route   POST /api/auth/register-admin
// @access  Private (Admin only)
exports.registerAdmin = async (req, res, next) => {
  try {
    // Check if user is admin (middleware should handle this)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const { name, email, password } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Create the admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
