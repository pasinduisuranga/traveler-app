const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['wildlife', 'adventure', 'cultural', 'wellness', 'conservation', 'educational'],
    required: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks']
    }
  },
  groupSize: {
    min: Number,
    max: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme']
  },
  sustainabilityFeatures: [{
    type: String
  }],
  carbonOffset: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  availability: [{
    date: Date,
    slots: Number
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
