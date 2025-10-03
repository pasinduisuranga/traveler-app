const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['eco-lodge', 'tour-operator', 'activity-provider', 'transportation', 'restaurant', 'other'],
    required: true
  },
  description: {
    type: String,
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
  sustainabilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date
  }],
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  experiences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    swiftCode: String
  },
  payoutSchedule: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly'],
    default: 'monthly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
