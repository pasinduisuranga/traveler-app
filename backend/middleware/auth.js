const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check if user is a provider
const isProvider = (req, res, next) => {
  if (req.user && req.user.userType === 'provider') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Provider account required.' });
  }
};

// Check if user is a traveler
const isTraveler = (req, res, next) => {
  if (req.user && req.user.userType === 'traveler') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Traveler account required.' });
  }
};

module.exports = { protect, isProvider, isTraveler };
