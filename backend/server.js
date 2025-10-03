const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Check if we should use mock database
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://localhost:27017/etcp';

// MongoDB Connection or Mock DB
const connectDB = async () => {
  if (USE_MOCK_DB) {
    console.log('⚠️  Using MOCK DATABASE (in-memory)');
    console.log('💡 To use real MongoDB, set up MongoDB Atlas and update .env');
    console.log('📖 See ATLAS_SETUP.md for instructions');
    const { initializeMockDB } = require('./mockDatabase');
    await initializeMockDB();
    global.USE_MOCK_DB = true;
  } else {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      global.USE_MOCK_DB = false;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.log('⚠️  Falling back to MOCK DATABASE');
      const { initializeMockDB } = require('./mockDatabase');
      await initializeMockDB();
      global.USE_MOCK_DB = true;
    }
  }
};

connectDB();

// Security middleware
app.use(helmet());
app.use(cors());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'ETCP Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      experiences: '/api/experiences',
      bookings: '/api/bookings',
      users: '/api/users',
      providers: '/api/providers'
    }
  });
});

// Experiences routes (Eco-Discovery Hub)
app.get('/api/experiences', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Sinharaja Rainforest Trek',
      location: 'Sinharaja Forest Reserve, Sri Lanka',
      type: 'hiking',
      sustainabilityRating: 4.8,
      price: 85,
      description: 'Explore the pristine biodiversity of UNESCO World Heritage Sinharaja Forest',
      provider: 'Eco Adventures Lanka',
      image: '/images/sinharaja.jpg'
    },
    {
      id: 2,
      title: 'Whale Watching at Mirissa',
      location: 'Mirissa, Sri Lanka',
      type: 'wildlife watching',
      sustainabilityRating: 4.5,
      price: 120,
      description: 'Sustainable whale watching experience with blue whales and dolphins',
      provider: 'Ocean Conservation Tours',
      image: '/images/whales.jpg'
    }
  ]);
});

// Bookings routes (Eco-Journeys)
app.get('/api/bookings', (req, res) => {
  res.json([
    {
      id: 1,
      experienceId: 1,
      userId: 1,
      date: '2025-10-15',
      status: 'confirmed',
      participants: 2
    }
  ]);
});

app.post('/api/bookings', (req, res) => {
  const { experienceId, date, participants } = req.body;
  res.json({
    id: Date.now(),
    experienceId,
    date,
    participants,
    status: 'confirmed',
    message: 'Booking created successfully'
  });
});

// Users routes
app.get('/api/users/profile', (req, res) => {
  res.json({
    id: 1,
    name: 'Eco Traveler',
    email: 'traveler@etcp.com',
    preferences: {
      theme: 'forest',
      language: 'en'
    }
  });
});

// Providers routes (Eco-Explorer Network)
app.get('/api/providers', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Eco Adventures Lanka',
      location: 'Colombo, Sri Lanka',
      sustainabilityScore: 4.8,
      experienceCount: 12,
      verified: true,
      joinedDate: '2023-01-15',
      totalBookings: 42,
      averageRating: 4.6,
      description: 'Leading eco-tourism provider in Sri Lanka, specializing in sustainable wildlife and nature experiences.',
      certifications: ['Green Tourism Certified', 'Wildlife Conservation Partner']
    },
    {
      id: 2,
      name: 'Ocean Conservation Tours',
      location: 'Mirissa, Sri Lanka',
      sustainabilityScore: 4.5,
      experienceCount: 8,
      verified: true,
      joinedDate: '2023-03-20',
      totalBookings: 28,
      averageRating: 4.4,
      description: 'Marine conservation focused tours with educational components.',
      certifications: ['Marine Conservation Certified', 'Blue Flag Partner']
    }
  ]);
});

app.post('/api/providers/register', (req, res) => {
  const { businessName, email, businessType } = req.body;
  res.json({
    id: Date.now(),
    message: 'Provider registration submitted successfully',
    applicationId: `APP-${Date.now()}`,
    status: 'pending_review',
    businessName,
    email,
    businessType,
    submittedAt: new Date().toISOString()
  });
});

app.get('/api/providers/:id/dashboard', (req, res) => {
  const { id } = req.params;
  res.json({
    provider: {
      id: parseInt(id),
      name: 'Eco Adventures Lanka',
      email: 'info@ecoadventureslanka.com',
      verified: true,
      sustainabilityScore: 4.8
    },
    analytics: {
      totalBookings: 42,
      totalRevenue: 3840,
      averageRating: 4.6,
      activeExperiences: 2,
      monthlyBookings: [5, 8, 12, 15, 18, 22, 25, 28, 32, 38, 42],
      revenueGrowth: 23.5
    },
    recentBookings: [
      {
        id: 1,
        experienceTitle: 'Sinharaja Rainforest Trek',
        customerName: 'John Doe',
        date: '2025-09-25',
        participants: 2,
        totalAmount: 170,
        status: 'confirmed'
      }
    ]
  });
});

app.get('/api/providers/:id/experiences', (req, res) => {
  const { id } = req.params;
  res.json([
    {
      id: 1,
      title: 'Sinharaja Rainforest Trek',
      status: 'active',
      price: 85,
      bookings: 24,
      rating: 4.8,
      sustainabilityRating: 4.9,
      lastUpdated: '2025-09-15',
      providerId: parseInt(id)
    },
    {
      id: 2,
      title: 'Whale Watching at Mirissa',
      status: 'active',
      price: 120,
      bookings: 18,
      rating: 4.5,
      sustainabilityRating: 4.6,
      lastUpdated: '2025-09-10',
      providerId: parseInt(id)
    }
  ]);
});

app.post('/api/providers/:id/experiences', (req, res) => {
  const { id } = req.params;
  const experienceData = req.body;
  res.json({
    id: Date.now(),
    ...experienceData,
    providerId: parseInt(id),
    status: 'draft',
    createdAt: new Date().toISOString(),
    message: 'Experience created successfully'
  });
});

app.put('/api/providers/:providerId/experiences/:experienceId', (req, res) => {
  const { providerId, experienceId } = req.params;
  const updateData = req.body;
  res.json({
    id: parseInt(experienceId),
    providerId: parseInt(providerId),
    ...updateData,
    updatedAt: new Date().toISOString(),
    message: 'Experience updated successfully'
  });
});

// Reviews routes
app.get('/api/providers/:id/reviews', (req, res) => {
  const { id } = req.params;
  res.json([
    {
      id: 1,
      customerName: 'Sarah Johnson',
      experienceTitle: 'Sinharaja Rainforest Trek',
      rating: 5,
      comment: 'Absolutely amazing experience! The guide was knowledgeable and the sustainability practices were evident throughout.',
      date: '2025-09-15',
      responded: true,
      response: 'Thank you for your wonderful feedback! We\'re glad you enjoyed the experience.',
      responseDate: '2025-09-16',
      photos: 2,
      helpful: 12
    },
    {
      id: 2,
      customerName: 'John Smith',
      experienceTitle: 'Whale Watching at Mirissa',
      rating: 4,
      comment: 'Great tour! Saw multiple whales. Only minor issue was the early morning start time.',
      date: '2025-09-10',
      responded: false,
      photos: 5,
      helpful: 8
    }
  ]);
});

app.get('/api/providers/:id/reviews/statistics', (req, res) => {
  res.json({
    averageRating: 4.5,
    totalReviews: 48,
    ratingDistribution: { 5: 28, 4: 12, 3: 6, 2: 1, 1: 1 },
    responseRate: 75
  });
});

app.post('/api/providers/:id/reviews/:reviewId/reply', (req, res) => {
  const { id, reviewId } = req.params;
  const { response } = req.body;
  res.json({
    reviewId: parseInt(reviewId),
    providerId: parseInt(id),
    response,
    responseDate: new Date().toISOString(),
    message: 'Reply posted successfully'
  });
});

// Analytics routes
app.get('/api/providers/:id/analytics', (req, res) => {
  const { range } = req.query;
  res.json({
    bookingTrends: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 42],
    revenueData: [1020, 1615, 1275, 2125, 1870, 2550, 2380, 2975, 2720, 3400, 3230, 3570],
    experiencePerformance: [
      { name: 'Sinharaja Trek', bookings: 24, revenue: 2040, rating: 4.8 },
      { name: 'Whale Watching', bookings: 18, revenue: 2160, rating: 4.5 }
    ],
    customerDemographics: {
      ageGroups: { '18-25': 15, '26-35': 35, '36-45': 25, '46-55': 15, '56+': 10 },
      countries: { 'USA': 30, 'UK': 20, 'Germany': 15, 'Australia': 12, 'Others': 23 },
      groupTypes: { 'Solo': 25, 'Couple': 35, 'Family': 20, 'Group': 20 }
    },
    sustainabilityMetrics: {
      carbonOffset: 156.5,
      localEconomyContribution: 3240,
      conservationDonations: 648,
      travelersEducated: 156,
      plasticEliminated: 234
    },
    topExperiences: [
      { id: 1, title: 'Sinharaja Trek', bookings: 24, growth: 15 },
      { id: 2, title: 'Whale Watching', bookings: 18, growth: 8 }
    ]
  });
});

// Payment routes
app.get('/api/providers/:id/payments', (req, res) => {
  res.json([
    {
      id: 1,
      bookingId: 'BK-1001',
      experienceTitle: 'Sinharaja Rainforest Trek',
      amount: 170,
      commission: 25.5,
      netAmount: 144.5,
      status: 'completed',
      paymentDate: '2025-09-20',
      customerName: 'John Doe',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      bookingId: 'BK-1002',
      experienceTitle: 'Whale Watching at Mirissa',
      amount: 120,
      commission: 18,
      netAmount: 102,
      status: 'completed',
      paymentDate: '2025-09-18',
      customerName: 'Sarah Smith',
      paymentMethod: 'PayPal'
    }
  ]);
});

app.get('/api/providers/:id/payment-methods', (req, res) => {
  res.json([
    { id: 1, type: 'bank', name: 'Bank of Ceylon', last4: '4567', primary: true },
    { id: 2, type: 'paypal', name: 'PayPal', email: 'provider@email.com', primary: false }
  ]);
});

app.get('/api/providers/:id/payout-settings', (req, res) => {
  res.json({
    bankName: 'Bank of Ceylon',
    accountNumber: '**** **** **** 4567',
    accountHolder: 'Eco Adventures Lanka',
    swiftCode: 'BCEYLKLX',
    payoutSchedule: 'weekly'
  });
});

app.put('/api/providers/:id/payout-settings', (req, res) => {
  const updateData = req.body;
  res.json({
    ...updateData,
    message: 'Payout settings updated successfully'
  });
});

app.get('/api/providers/:id/financial-summary', (req, res) => {
  res.json({
    availableBalance: 1250.75,
    pendingBalance: 318.75,
    totalEarnings: 12840.50,
    nextPayout: '2025-09-27',
    payoutAmount: 1250.75
  });
});

app.post('/api/providers/:id/request-payout', (req, res) => {
  res.json({
    message: 'Payout request submitted successfully',
    requestId: `PAYOUT-${Date.now()}`,
    amount: 1250.75,
    estimatedArrival: '2025-09-30'
  });
});

// Messaging routes
app.get('/api/providers/:id/conversations', (req, res) => {
  res.json([
    {
      id: 1,
      customerName: 'Sarah Johnson',
      experienceTitle: 'Sinharaja Rainforest Trek',
      lastMessage: 'Is equipment provided for the trek?',
      lastMessageTime: '2025-09-19 10:30',
      unread: 2,
      status: 'active',
      bookingId: 'BK-1001'
    },
    {
      id: 2,
      customerName: 'Mike Williams',
      experienceTitle: 'Whale Watching at Mirissa',
      lastMessage: 'Thank you for the wonderful experience!',
      lastMessageTime: '2025-09-18 14:20',
      unread: 0,
      status: 'completed',
      bookingId: 'BK-1002'
    }
  ]);
});

app.get('/api/providers/:id/conversations/:conversationId/messages', (req, res) => {
  res.json([
    {
      id: 1,
      senderId: 'customer',
      senderName: 'Sarah Johnson',
      text: 'Hi! I\'m interested in the Sinharaja Rainforest Trek.',
      timestamp: '2025-09-19 09:00',
      read: true
    },
    {
      id: 2,
      senderId: 'provider',
      senderName: 'Eco Adventures Lanka',
      text: 'Hello! We\'d be happy to help you with booking.',
      timestamp: '2025-09-19 09:15',
      read: true
    }
  ]);
});

app.post('/api/providers/:id/conversations/:conversationId/messages', (req, res) => {
  const { text } = req.body;
  res.json({
    id: Date.now(),
    senderId: 'provider',
    text,
    timestamp: new Date().toISOString(),
    message: 'Message sent successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`ETCP Backend server running on port ${PORT}`);
});

module.exports = app;