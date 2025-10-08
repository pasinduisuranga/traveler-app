const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Function to get User model (supports mock DB)
const getUser = () => {
  if (global.USE_MOCK_DB) {
    const { MockUser } = require('../mockDatabase');
    return MockUser;
  } else {
    const User = require('../models/User');
    return User;
  }
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Get user from token
      const User = getUser();
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      let message = 'Not authorized, token failed';
      if (error.name === 'TokenExpiredError') {
        message = 'Token has expired';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token';
      }
      
      res.status(401).json({ 
        success: false,
        message 
      });
    }
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};

// Check if user is a provider
const isProvider = (req, res, next) => {
  if (req.user && req.user.userType === 'provider') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Provider account required.' 
    });
  }
};

// Check if user is a traveler
const isTraveler = (req, res, next) => {
  if (req.user && req.user.userType === 'traveler') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Traveler account required.' 
    });
  }
};

module.exports = { protect, isProvider, isTraveler };
