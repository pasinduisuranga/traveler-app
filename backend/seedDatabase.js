const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/etcp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType: String,
  phone: String,
  country: String,
  avatar: String,
  isVerified: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Provider Schema
const providerSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  businessName: String,
  businessType: String,
  description: String,
  verified: Boolean,
  sustainabilityScore: Number,
  rating: Number,
  totalReviews: Number,
  createdAt: { type: Date, default: Date.now }
});

const Provider = mongoose.model('Provider', providerSchema);

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Provider.deleteMany({});
    console.log('Cleared existing data');

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create demo traveler
    const traveler = await User.create({
      name: 'Demo Traveler',
      email: 'traveler@demo.com',
      password: hashedPassword,
      userType: 'traveler',
      phone: '+1234567890',
      country: 'United States',
      avatar: 'https://via.placeholder.com/150',
      isVerified: true
    });
    console.log('✓ Created demo traveler');

    // Create demo provider user
    const providerUser = await User.create({
      name: 'Eco Adventure Tours',
      email: 'provider@demo.com',
      password: hashedPassword,
      userType: 'provider',
      phone: '+1987654321',
      country: 'Costa Rica',
      avatar: 'https://via.placeholder.com/150',
      isVerified: true
    });
    console.log('✓ Created demo provider user');

    // Create provider profile
    const provider = await Provider.create({
      userId: providerUser._id,
      businessName: 'Eco Adventure Tours',
      businessType: 'tour-operator',
      description: 'Leading eco-tourism provider specializing in sustainable rainforest adventures',
      verified: true,
      sustainabilityScore: 4.5,
      rating: 4.8,
      totalReviews: 127
    });
    console.log('✓ Created provider profile');

    console.log('\n=================================');
    console.log('Database seeded successfully!');
    console.log('=================================');
    console.log('\nDemo Accounts:');
    console.log('\nTraveler:');
    console.log('  Email: traveler@demo.com');
    console.log('  Password: demo123');
    console.log('\nProvider:');
    console.log('  Email: provider@demo.com');
    console.log('  Password: demo123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
