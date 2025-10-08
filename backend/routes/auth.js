const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { validate, registerValidation, loginValidation } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiting');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Function to get User and Provider models (supports mock DB)
const getModels = () => {
  if (global.USE_MOCK_DB) {
    const { MockUser, MockProvider } = require('../mockDatabase');
    return { User: MockUser, Provider: MockProvider };
  } else {
    const User = require('../models/User');
    const Provider = require('../models/Provider');
    return { User, Provider };
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

// Register User
router.post('/register', 
  authLimiter,
  validate(registerValidation),
  catchAsync(async (req, res, next) => {
    const { User, Provider } = getModels();
    const { name, email, password, phone, country, userType } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      country,
      userType: userType || 'traveler'
    });

    // If provider, create provider profile
    if (userType === 'provider') {
      await Provider.create({
        userId: user._id,
        businessName: name,
        businessType: 'other',
        description: 'New provider',
        verified: false
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.avatar || 'https://via.placeholder.com/150'
      },
      message: 'Registration successful'
    });
  })
);

// Login User
router.post('/login',
  authLimiter,
  validate(loginValidation),
  catchAsync(async (req, res, next) => {
    const { User } = getModels();
    const { email, password, userType } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check user type
    if (user.userType !== userType) {
      return next(new AppError(
        `This account is registered as a ${user.userType}. Please select the correct account type.`, 
        401
      ));
    }

    // Check password
    let isPasswordValid;
    if (global.USE_MOCK_DB) {
      // For mock DB, compare directly
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // For real DB, use the model method
      isPasswordValid = await user.comparePassword(password);
    }
    
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.avatar || 'https://via.placeholder.com/150'
      },
      message: 'Login successful'
    });
  })
);

// Get Current User
router.get('/me', 
  protect,
  catchAsync(async (req, res, next) => {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        userType: req.user.userType,
        avatar: req.user.avatar,
        phone: req.user.phone,
        country: req.user.country,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt
      }
    });
  })
);

// Refresh Token
router.post('/refresh-token',
  protect,
  catchAsync(async (req, res, next) => {
    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      token,
      message: 'Token refreshed successfully'
    });
  })
);

// Logout (client-side mainly, but can blacklist tokens if needed)
router.post('/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

module.exports = router;
