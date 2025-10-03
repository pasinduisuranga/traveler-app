import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeExperiences: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
    fetchProviderExperiences();
    fetchProviderBookings();
    fetchAnalytics();
  }, []);

  const fetchProviderData = async () => {
    try {
      // Mock provider data - in real app this would come from authentication
      setProvider({
        id: 1,
        name: 'Eco Adventures Lanka',
        email: 'info@ecoadventureslanka.com',
        location: 'Colombo, Sri Lanka',
        phone: '+94 77 123 4567',
        website: 'www.ecoadventureslanka.com',
        sustainabilityScore: 4.8,
        verified: true,
        joinedDate: '2023-01-15',
        description: 'Leading eco-tourism provider in Sri Lanka, specializing in sustainable wildlife and nature experiences.',
        certifications: ['Green Tourism Certified', 'Wildlife Conservation Partner', 'Carbon Neutral Certified']
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setLoading(false);
    }
  };

  const fetchProviderExperiences = async () => {
    try {
      // Mock experiences data
      setExperiences([
        {
          id: 1,
          title: 'Sinharaja Rainforest Trek',
          status: 'active',
          price: 85,
          bookings: 24,
          rating: 4.8,
          sustainabilityRating: 4.9,
          lastUpdated: '2025-09-15'
        },
        {
          id: 2,
          title: 'Whale Watching at Mirissa',
          status: 'active',
          price: 120,
          bookings: 18,
          rating: 4.5,
          sustainabilityRating: 4.6,
          lastUpdated: '2025-09-10'
        },
        {
          id: 3,
          title: 'Bird Watching in Bundala',
          status: 'draft',
          price: 75,
          bookings: 0,
          rating: 0,
          sustainabilityRating: 4.7,
          lastUpdated: '2025-09-18'
        }
      ]);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const fetchProviderBookings = async () => {
    try {
      // Mock bookings data
      setBookings([
        {
          id: 1,
          experienceTitle: 'Sinharaja Rainforest Trek',
          customerName: 'John Doe',
          date: '2025-09-25',
          participants: 2,
          totalAmount: 170,
          status: 'confirmed',
          bookingDate: '2025-09-18'
        },
        {
          id: 2,
          experienceTitle: 'Whale Watching at Mirissa',
          customerName: 'Sarah Smith',
          date: '2025-09-28',
          participants: 1,
          totalAmount: 120,
          status: 'pending',
          bookingDate: '2025-09-17'
        }
      ]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      setAnalytics({
        totalBookings: 42,
        totalRevenue: 3840,
        averageRating: 4.6,
        activeExperiences: 2,
        monthlyBookings: [5, 8, 12, 15, 18, 22, 25, 28, 32, 38, 42],
        revenueGrowth: 23.5,
        sustainabilityScore: 4.8
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleStatusChange = (experienceId, newStatus) => {
    setExperiences(experiences.map(exp => 
      exp.id === experienceId ? { ...exp, status: newStatus } : exp
    ));
  };

  const handleBookingAction = (bookingId, action) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: action } : booking
    ));
    alert(`Booking ${action} successfully!`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2 className="page-title">Provider Dashboard</h2>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="provider-header">
        <div className="provider-info">
          <h1>Welcome back, {provider.name}!</h1>
          <div className="provider-badges">
            {provider.verified && <span className="badge verified">✓ Verified</span>}
            <span className="badge sustainability">🌿 {provider.sustainabilityScore}/5</span>
          </div>
        </div>
        <div className="quick-actions">
          <button className="button">Add New Experience</button>
          <button className="button secondary">View Profile</button>
        </div>
      </div>

      {/* Provider Navigation */}
      <div className="provider-navigation card">
        <Link to="/provider" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/provider/analytics" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Analytics</span>
        </Link>
        <Link to="/provider/reviews" className="nav-item">
          <span className="nav-icon">⭐</span>
          <span>Reviews</span>
        </Link>
        <Link to="/provider/payments" className="nav-item">
          <span className="nav-icon">💳</span>
          <span>Payments</span>
        </Link>
        <Link to="/provider/messages" className="nav-item">
          <span className="nav-icon">💬</span>
          <span>Messages</span>
        </Link>
      </div>

      {/* Analytics Overview */}
      <div className="analytics-overview">
        <h2>📊 Analytics Overview</h2>
        <div className="analytics-grid">
          <div className="analytics-card card">
            <h3>{analytics.totalBookings}</h3>
            <p>Total Bookings</p>
            <span className="growth positive">+{analytics.revenueGrowth}%</span>
          </div>
          <div className="analytics-card card">
            <h3>${analytics.totalRevenue}</h3>
            <p>Total Revenue</p>
            <span className="growth positive">+{analytics.revenueGrowth}%</span>
          </div>
          <div className="analytics-card card">
            <h3>{analytics.averageRating}/5</h3>
            <p>Average Rating</p>
            <span className="rating-stars">⭐⭐⭐⭐⭐</span>
          </div>
          <div className="analytics-card card">
            <h3>{analytics.activeExperiences}</h3>
            <p>Active Experiences</p>
            <span className="status-indicator active">Live</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings section">
        <div className="section-header">
          <h2>📅 Recent Bookings</h2>
          <button className="button secondary">View All</button>
        </div>
        <div className="bookings-table">
          <div className="table-header">
            <span>Customer</span>
            <span>Experience</span>
            <span>Date</span>
            <span>Participants</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {bookings.map(booking => (
            <div key={booking.id} className="table-row">
              <span className="customer-name">{booking.customerName}</span>
              <span className="experience-title">{booking.experienceTitle}</span>
              <span className="booking-date">{booking.date}</span>
              <span className="participants">{booking.participants}</span>
              <span className="amount">${booking.totalAmount}</span>
              <span className={`status ${booking.status}`}>{booking.status}</span>
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      className="action-btn confirm"
                      onClick={() => handleBookingAction(booking.id, 'confirmed')}
                    >
                      ✓
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => handleBookingAction(booking.id, 'rejected')}
                    >
                      ✗
                    </button>
                  </>
                )}
                <button className="action-btn view">👁</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Experiences */}
      <div className="experiences-management section">
        <div className="section-header">
          <h2>🏞️ Your Experiences</h2>
          <button className="button">Add New Experience</button>
        </div>
        <div className="experiences-grid">
          {experiences.map(experience => (
            <div key={experience.id} className="experience-card card">
              <div className="experience-header">
                <h3>{experience.title}</h3>
                <div className="experience-status">
                  <select 
                    value={experience.status}
                    onChange={(e) => handleStatusChange(experience.id, e.target.value)}
                    className={`status-select ${experience.status}`}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
              <div className="experience-stats">
                <div className="stat">
                  <span className="stat-value">${experience.price}</span>
                  <span className="stat-label">Price</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{experience.bookings}</span>
                  <span className="stat-label">Bookings</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{experience.rating}/5</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{experience.sustainabilityRating}/5</span>
                  <span className="stat-label">🌿 Sustainability</span>
                </div>
              </div>
              <div className="experience-actions">
                <button className="button secondary">Edit</button>
                <button className="button secondary">View</button>
                <button className="button secondary">Analytics</button>
              </div>
              <div className="last-updated">
                Last updated: {experience.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="sustainability-metrics section">
        <h2>🌱 Sustainability Impact</h2>
        <div className="sustainability-grid">
          <div className="sustainability-card card">
            <h3>Carbon Footprint</h3>
            <div className="metric-value">-12.5 tons CO₂</div>
            <p>Offset this month through your experiences</p>
          </div>
          <div className="sustainability-card card">
            <h3>Local Community Support</h3>
            <div className="metric-value">85%</div>
            <p>Of revenue goes to local communities</p>
          </div>
          <div className="sustainability-card card">
            <h3>Conservation Contribution</h3>
            <div className="metric-value">$2,400</div>
            <p>Donated to conservation projects</p>
          </div>
          <div className="sustainability-card card">
            <h3>Traveler Education</h3>
            <div className="metric-value">156</div>
            <p>Travelers educated about sustainability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;