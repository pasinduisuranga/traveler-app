// Temporary in-memory database for testing without MongoDB
// This allows you to test the authentication system without installing MongoDB

const users = new Map();
const providers = new Map();

// Initialize with demo users
const bcrypt = require('bcryptjs');
const config = require('./config/config');

async function initializeMockDB() {
  const hashedPassword = await bcrypt.hash('demo123', config.BCRYPT_ROUNDS);
  
  // Demo traveler
  const travelerId = 'traveler_001';
  users.set('traveler@demo.com', {
    _id: travelerId,
    name: 'Demo Traveler',
    email: 'traveler@demo.com',
    password: hashedPassword,
    userType: 'traveler',
    phone: '+1234567890',
    country: 'United States',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date()
  });

  // Demo provider
  const providerId = 'provider_001';
  users.set('provider@demo.com', {
    _id: providerId,
    name: 'Eco Adventure Tours',
    email: 'provider@demo.com',
    password: hashedPassword,
    userType: 'provider',
    phone: '+1987654321',
    country: 'Costa Rica',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date()
  });

  providers.set(providerId, {
    userId: providerId,
    businessName: 'Eco Adventure Tours',
    businessType: 'tour-operator',
    description: 'Leading eco-tourism provider',
    verified: true,
    sustainabilityScore: 4.5,
    rating: 4.8,
    totalReviews: 127
  });

  console.log('✅ Mock database initialized with demo users');
  console.log('📧 Demo credentials:');
  console.log('   Traveler: traveler@demo.com / demo123');
  console.log('   Provider: provider@demo.com / demo123');
}

// Mock User Model
const MockUser = {
  async findOne(query) {
    if (query.email) {
      return users.get(query.email) || null;
    }
    return null;
  },

  async findById(id) {
    for (let user of users.values()) {
      if (user._id === id) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, config.BCRYPT_ROUNDS);
    const userId = `${userData.userType}_${Date.now()}`;
    const user = {
      _id: userId,
      ...userData,
      password: hashedPassword,
      isVerified: false,
      avatar: userData.avatar || 'https://via.placeholder.com/150',
      createdAt: new Date()
    };
    users.set(userData.email, user);
    
    // Return user without password for consistency
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: userId };
  }
};

// Mock Provider Model
const MockProvider = {
  async create(providerData) {
    const providerId = `provider_${Date.now()}`;
    const provider = {
      _id: providerId,
      ...providerData,
      verified: false,
      sustainabilityScore: 0,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date()
    };
    providers.set(provider.userId, provider);
    return provider;
  },

  async findOne(query) {
    if (query.userId) {
      return providers.get(query.userId) || null;
    }
    return null;
  }
};

module.exports = {
  initializeMockDB,
  MockUser,
  MockProvider,
  isUsingMockDB: true
};
