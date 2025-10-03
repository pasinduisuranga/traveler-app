const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { User, Provider } = getModels();
    const { name, email, password, phone, country, userType } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.avatar || 'https://via.placeholder.com/150'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { User } = getModels();
    const { email, password, userType } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check user type
    if (user.userType !== userType) {
      return res.status(401).json({ 
        message: `This account is registered as a ${user.userType}. Please select the correct account type.` 
      });
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
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.avatar || 'https://via.placeholder.com/150'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const { User } = getModels();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Logout (client-side mainly, but can blacklist tokens if needed)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
