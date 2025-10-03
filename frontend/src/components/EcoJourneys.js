import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EcoJourneys = () => {
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchWishlist();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      // Mock wishlist data
      setWishlist([
        {
          id: 1,
          title: 'Yala National Park Safari',
          location: 'Yala, Sri Lanka',
          sustainabilityRating: 4.6,
          price: 95
        },
        {
          id: 2,
          title: 'Turtle Conservation Project',
          location: 'Kosgoda, Sri Lanka',
          sustainabilityRating: 4.9,
          price: 45
        }
      ]);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'location':
        return a.location?.localeCompare(b.location) || 0;
      case 'rating':
        return (b.sustainabilityRating || 0) - (a.sustainabilityRating || 0);
      default:
        return 0;
    }
  });

  const handleDiscoverSimilar = (experienceId) => {
    alert(`Discovering similar experiences to #${experienceId}...`);
  };

  const handleShareExperience = (experienceId) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this eco-experience!',
        text: 'I found this amazing sustainable travel experience on ETCP',
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = `${window.location.origin}/experience/${experienceId}`;
      navigator.clipboard.writeText(url);
      alert('Experience link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2 className="page-title">Eco-Journeys</h2>
        <p>Loading your eco-journeys...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">🗺️ Eco-Journeys</h2>
      <p className="page-subtitle">Manage your bookings and discover new sustainable adventures</p>

      <div className="journey-stats card">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{bookings.length}</h3>
            <p>Active Bookings</p>
          </div>
          <div className="stat-item">
            <h3>{wishlist.length}</h3>
            <p>Wishlist Items</p>
          </div>
          <div className="stat-item">
            <h3>4.7</h3>
            <p>Avg Sustainability Rating</p>
          </div>
          <div className="stat-item">
            <h3>2.1kg</h3>
            <p>CO₂ Offset This Month</p>
          </div>
        </div>
      </div>

      <div className="bookings-section">
        <div className="section-header">
          <h3>Your Bookings</h3>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="location">Location</option>
              <option value="rating">Sustainability Rating</option>
            </select>
          </div>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="no-bookings card">
            <h4>No bookings yet</h4>
            <p>Start your eco-journey by booking your first sustainable experience!</p>
            <button className="button">Browse Experiences</button>
          </div>
        ) : (
          <div className="bookings-grid">
            {sortedBookings.map(booking => (
              <div key={booking.id} className="booking-card card">
                <div className="booking-status">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <h4>Experience #{booking.experienceId}</h4>
                  <p className="booking-date">📅 {booking.date}</p>
                  <p className="participants">👥 {booking.participants} participants</p>
                </div>
                <div className="booking-actions">
                  <button className="button secondary">
                    View Details
                  </button>
                  <button 
                    className="button secondary"
                    onClick={() => handleDiscoverSimilar(booking.experienceId)}
                  >
                    Discover Similar
                  </button>
                  <button 
                    className="button secondary"
                    onClick={() => handleShareExperience(booking.experienceId)}
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="wishlist-section">
        <h3>Your Wishlist</h3>
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card card">
              <div className="wishlist-header">
                <h4>{item.title}</h4>
                <div className="sustainability-badge">
                  🌿 {item.sustainabilityRating}/5
                </div>
              </div>
              <p className="location">📍 {item.location}</p>
              <div className="price-section">
                <span className="price">${item.price}</span>
                <span className="price-label">per person</span>
              </div>
              <div className="wishlist-actions">
                <button className="button">Book Now</button>
                <button className="button secondary">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoJourneys;