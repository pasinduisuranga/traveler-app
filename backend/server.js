const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('./config/config');

// Import middleware
const { generalLimiter, apiLimiter } = require('./middleware/rateLimiting');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const { protect, isProvider, isTraveler } = require('./middleware/auth');

const app = express();

// Check if we should use mock database
const USE_MOCK_DB = config.USE_MOCK_DB || !config.MONGODB_URI || config.MONGODB_URI === 'mongodb://localhost:27017/etcp';

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
      const conn = await mongoose.connect(config.MONGODB_URI, {
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

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import Routes
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/auth', authRoutes);

// API Info endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'ETCP Backend API is running!',
    version: '2.0.0',
    environment: config.NODE_ENV,
    database: USE_MOCK_DB ? 'Mock Database' : 'MongoDB',
    endpoints: {
      auth: '/api/auth',
      experiences: '/api/experiences',
      bookings: '/api/bookings',
      users: '/api/users',
      providers: '/api/providers'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Protected API Routes with rate limiting
app.use('/api/experiences', apiLimiter);
app.use('/api/bookings', apiLimiter);
app.use('/api/users', apiLimiter);
app.use('/api/providers', apiLimiter);

// Experiences routes (Eco-Discovery Hub) - Protected
app.get('/api/experiences', protect, (req, res) => {
  const { location, type, maxPrice, minRating } = req.query;
  
  let experiences = [
    {
      id: 1,
      title: 'Sinharaja Rainforest Trek',
      location: 'Sinharaja Forest Reserve, Sri Lanka',
      type: 'hiking',
      sustainabilityRating: 4.8,
      price: 85,
      description: 'Explore the pristine biodiversity of UNESCO World Heritage Sinharaja Forest',
      provider: 'Eco Adventures Lanka',
      image: '/images/sinharaja.jpg',
      maxParticipants: 12,
      duration: 8,
      difficulty: 'moderate'
    },
    {
      id: 2,
      title: 'Whale Watching at Mirissa',
      location: 'Mirissa, Sri Lanka',
      type: 'wildlife-watching',
      sustainabilityRating: 4.5,
      price: 120,
      description: 'Sustainable whale watching experience with blue whales and dolphins',
      provider: 'Ocean Conservation Tours',
      image: '/images/whales.jpg',
      maxParticipants: 20,
      duration: 6,
      difficulty: 'easy'
    },
    {
      id: 3,
      title: 'Mangrove Conservation Project',
      location: 'Bentota, Sri Lanka',
      type: 'conservation',
      sustainabilityRating: 4.9,
      price: 65,
      description: 'Participate in mangrove restoration and learn about coastal ecosystems',
      provider: 'Marine Conservation Lanka',
      image: '/images/mangroves.jpg',
      maxParticipants: 15,
      duration: 4,
      difficulty: 'easy'
    }
  ];

  // Apply filters
  if (location) {
    experiences = experiences.filter(exp => 
      exp.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (type) {
    experiences = experiences.filter(exp => exp.type === type);
  }
  
  if (maxPrice) {
    experiences = experiences.filter(exp => exp.price <= parseInt(maxPrice));
  }
  
  if (minRating) {
    experiences = experiences.filter(exp => exp.sustainabilityRating >= parseFloat(minRating));
  }

  res.json({
    success: true,
    count: experiences.length,
    data: experiences
  });
});

app.get('/api/experiences/:id', protect, (req, res) => {
  const { id } = req.params;
  
  // Mock experience details
  const experience = {
    id: parseInt(id),
    title: 'Sinharaja Rainforest Trek',
    location: 'Sinharaja Forest Reserve, Sri Lanka',
    type: 'hiking',
    sustainabilityRating: 4.8,
    price: 85,
    description: 'Explore the pristine biodiversity of UNESCO World Heritage Sinharaja Forest Reserve. This guided trek takes you through one of Sri Lanka\'s last remaining rainforests, home to endemic species and pristine ecosystems.',
    provider: 'Eco Adventures Lanka',
    providerId: 1,
    image: '/images/sinharaja.jpg',
    gallery: ['/images/sinharaja1.jpg', '/images/sinharaja2.jpg'],
    maxParticipants: 12,
    duration: 8,
    difficulty: 'moderate',
    included: ['Expert guide', 'Lunch', 'Transportation', 'Entry fees'],
    notIncluded: ['Personal gear', 'Insurance'],
    sustainabilityFeatures: [
      'Local community employment',
      'Conservation fund contribution',
      'Zero plastic policy',
      'Carbon offset program'
    ],
    availableDates: ['2025-10-15', '2025-10-22', '2025-10-29'],
    reviews: [
      {
        id: 1,
        userName: 'Sarah J.',
        rating: 5,
        comment: 'Amazing experience! Learned so much about biodiversity.',
        date: '2025-09-20'
      }
    ]
  };

  res.json({
    success: true,
    data: experience
  });
});

// Bookings routes (Eco-Journeys) - Protected
app.get('/api/bookings', protect, (req, res) => {
  const userId = req.user.id;
  
  const bookings = [
    {
      id: 1,
      experienceId: 1,
      experienceTitle: 'Sinharaja Rainforest Trek',
      userId: userId,
      date: '2025-10-15',
      status: 'confirmed',
      participants: 2,
      totalAmount: 170,
      bookingDate: '2025-09-20',
      provider: 'Eco Adventures Lanka'
    },
    {
      id: 2,
      experienceId: 2,
      experienceTitle: 'Whale Watching at Mirissa',
      userId: userId,
      date: '2025-10-22',
      status: 'pending',
      participants: 1,
      totalAmount: 120,
      bookingDate: '2025-09-21',
      provider: 'Ocean Conservation Tours'
    }
  ];

  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

app.post('/api/bookings', protect, (req, res) => {
  const { experienceId, date, participants, specialRequests } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!experienceId || !date || !participants) {
    return res.status(400).json({
      success: false,
      message: 'Experience ID, date, and participants are required'
    });
  }

  if (participants < 1 || participants > 20) {
    return res.status(400).json({
      success: false,
      message: 'Participants must be between 1 and 20'
    });
  }

  const booking = {
    id: Date.now(),
    experienceId: parseInt(experienceId),
    userId,
    date,
    participants: parseInt(participants),
    specialRequests,
    status: 'pending',
    totalAmount: 85 * participants, // Mock calculation
    bookingDate: new Date().toISOString(),
    confirmationCode: `ETCP-${Date.now()}`
  };

  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking created successfully'
  });
});

// Update booking status
app.patch('/api/bookings/:id', protect, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  res.json({
    success: true,
    data: {
      id: parseInt(id),
      status,
      updatedAt: new Date().toISOString()
    },
    message: 'Booking updated successfully'
  });
});

// Users routes - Protected
app.get('/api/users/profile', protect, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id || req.user._id,
      name: req.user.name,
      email: req.user.email,
      userType: req.user.userType,
      avatar: req.user.avatar,
      phone: req.user.phone,
      country: req.user.country,
      preferences: {
        theme: 'forest',
        language: 'en',
        notifications: true
      },
      stats: {
        totalBookings: 5,
        completedExperiences: 3,
        totalSpent: 425,
        carbonOffset: 12.5
      }
    }
  });
});

app.put('/api/users/profile', protect, (req, res) => {
  const { name, phone, country, preferences } = req.body;
  
  res.json({
    success: true,
    data: {
      id: req.user.id || req.user._id,
      name: name || req.user.name,
      phone: phone || req.user.phone,
      country: country || req.user.country,
      preferences: preferences || req.user.preferences,
      updatedAt: new Date().toISOString()
    },
    message: 'Profile updated successfully'
  });
});

// Providers routes (Eco-Explorer Network) - Some protected, some public
app.get('/api/providers', (req, res) => {
  const providers = [
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
      certifications: ['Green Tourism Certified', 'Wildlife Conservation Partner'],
      specialties: ['Wildlife Tours', 'Forest Treks', 'Conservation Projects']
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
      certifications: ['Marine Conservation Certified', 'Blue Flag Partner'],
      specialties: ['Whale Watching', 'Marine Conservation', 'Snorkeling']
    }
  ];

  res.json({
    success: true,
    count: providers.length,
    data: providers
  });
});

app.post('/api/providers/register', protect, isProvider, (req, res) => {
  const { businessName, businessType, description, location } = req.body;
  
  if (!businessName || !businessType) {
    return res.status(400).json({
      success: false,
      message: 'Business name and type are required'
    });
  }

  res.status(201).json({
    success: true,
    data: {
      id: Date.now(),
      businessName,
      businessType,
      description,
      location,
      userId: req.user.id,
      status: 'pending_review',
      applicationId: `APP-${Date.now()}`,
      submittedAt: new Date().toISOString()
    },
    message: 'Provider registration submitted successfully'
  });
});

// Provider Dashboard - Protected and Provider only
app.get('/api/providers/:id/dashboard', protect, isProvider, (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: {
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
        revenueGrowth: 23.5,
        conversionRate: 15.2,
        repeatCustomers: 28
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
    }
  });
});

// Error handling - Must be last
app.use(notFound);
app.use(globalErrorHandler);

// Error handling - Must be last
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 ETCP Backend server running on port ${PORT}`);
  console.log(`📖 Environment: ${config.NODE_ENV}`);
  console.log(`🔒 CORS Origin: ${config.CORS_ORIGIN}`);
});

module.exports = app;