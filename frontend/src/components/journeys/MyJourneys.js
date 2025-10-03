import React, { useState, useEffect } from 'react';

const MyJourneys = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [journeysData, setJourneysData] = useState({
    current: [],
    upcoming: [],
    completed: [],
    wishlist: []
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchJourneysData();
  }, []);

  const fetchJourneysData = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      setJourneysData({
        current: [
          {
            id: 1,
            title: 'Sinharaja Rainforest Trek',
            location: 'Sinharaja, Sri Lanka',
            startDate: '2025-10-15',
            endDate: '2025-10-15',
            status: 'confirmed',
            participants: 2,
            totalPrice: 170,
            provider: 'Eco Adventures Lanka',
            image: '/images/sinharaja.jpg',
            sustainability: 4.8,
            progress: 75,
            nextActivity: 'Meet at 6:00 AM at park entrance'
          }
        ],
        upcoming: [
          {
            id: 2,
            title: 'Whale Watching Experience',
            location: 'Mirissa, Sri Lanka',
            startDate: '2025-10-22',
            endDate: '2025-10-22',
            status: 'confirmed',
            participants: 1,
            totalPrice: 120,
            provider: 'Ocean Tours',
            image: '/images/whales.jpg',
            sustainability: 4.5,
            daysUntil: 19
          },
          {
            id: 3,
            title: 'Tea Plantation Cultural Walk',
            location: 'Ella, Sri Lanka',
            startDate: '2025-11-05',
            endDate: '2025-11-05',
            status: 'pending',
            participants: 2,
            totalPrice: 90,
            provider: 'Heritage Tea Tours',
            image: '/images/tea.jpg',
            sustainability: 4.7,
            daysUntil: 33
          }
        ],
        completed: [
          {
            id: 4,
            title: 'Yala Safari Photography',
            location: 'Yala National Park, Sri Lanka',
            startDate: '2025-09-15',
            endDate: '2025-09-15',
            status: 'completed',
            participants: 2,
            totalPrice: 360,
            provider: 'Wild Lens Sri Lanka',
            image: '/images/yala.jpg',
            sustainability: 4.6,
            rating: 5,
            review: 'Amazing experience! Saw 3 leopards and countless birds.',
            carbonOffset: 6.4,
            localImpact: 'Anti-poaching support'
          },
          {
            id: 5,
            title: 'Mangrove Conservation Project',
            location: 'Balapitiya, Sri Lanka',
            startDate: '2025-08-20',
            endDate: '2025-08-20',
            status: 'completed',
            participants: 1,
            totalPrice: 65,
            provider: 'Mangrove Action Project',
            image: '/images/mangrove.jpg',
            sustainability: 5.0,
            rating: 5,
            review: 'Meaningful conservation work. Planted 15 mangrove saplings!',
            carbonOffset: 5.1,
            localImpact: 'Coastal protection'
          }
        ],
        wishlist: [
          {
            id: 6,
            title: 'Horton Plains National Park',
            location: 'Nuwara Eliya, Sri Lanka',
            type: 'hiking',
            price: 95,
            sustainability: 4.9,
            image: '/images/horton.jpg',
            provider: 'Mountain Adventures',
            rating: 4.8,
            reviewCount: 156
          },
          {
            id: 7,
            title: 'Turtle Conservation Program',
            location: 'Kosgoda, Sri Lanka',
            type: 'conservation',
            price: 55,
            sustainability: 4.9,
            image: '/images/turtle.jpg',
            provider: 'Sea Turtle Foundation',
            rating: 4.9,
            reviewCount: 203
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'current', name: 'Current Trips', icon: '🚀', count: journeysData.current.length },
    { id: 'upcoming', name: 'Upcoming', icon: '📅', count: journeysData.upcoming.length },
    { id: 'completed', name: 'Completed', icon: '✅', count: journeysData.completed.length },
    { id: 'wishlist', name: 'Wishlist', icon: '💝', count: journeysData.wishlist.length }
  ];

  const sortOptions = [
    { value: 'date', label: 'By Date' },
    { value: 'price', label: 'By Price' },
    { value: 'sustainability', label: 'By Sustainability' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  const getSortedJourneys = (journeys) => {
    return [...journeys].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (b.totalPrice || b.price) - (a.totalPrice || a.price);
        case 'sustainability':
          return b.sustainability - a.sustainability;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(a.startDate || '2025-12-31') - new Date(b.startDate || '2025-12-31');
      }
    });
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Handle cancellation logic
      console.log('Cancelling booking:', bookingId);
      alert('Booking cancellation initiated. You will receive a confirmation email.');
    }
  };

  const handleBookFromWishlist = (experienceId) => {
    console.log('Booking from wishlist:', experienceId);
    alert('Redirecting to booking page...');
  };

  const handleRemoveFromWishlist = (experienceId) => {
    console.log('Removing from wishlist:', experienceId);
    // Update wishlist
  };

  const getTotalStats = () => {
    const completed = journeysData.completed;
    const totalSpent = completed.reduce((sum, journey) => sum + journey.totalPrice, 0);
    const totalCarbonOffset = completed.reduce((sum, journey) => sum + (journey.carbonOffset || 0), 0);
    const totalExperiences = completed.length;

    return { totalSpent, totalCarbonOffset, totalExperiences };
  };

  if (loading) {
    return (
      <div className="journeys-loading">
        <div className="loading-spinner">🎒</div>
        <p>Loading your eco journeys...</p>
      </div>
    );
  }

  const stats = getTotalStats();
  const currentData = getSortedJourneys(journeysData[activeTab]);

  return (
    <div className="my-journeys fade-in">
      {/* Header with Stats */}
      <div className="journeys-header">
        <div className="header-content">
          <h1>🎒 My Eco Journeys</h1>
          <p>Track your sustainable travel adventures and their positive impact</p>
        </div>
        <div className="journey-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-number">${stats.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <span className="stat-number">{stats.totalCarbonOffset.toFixed(1)}t</span>
              <span className="stat-label">CO₂ Offset</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-number">{stats.totalExperiences}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="journeys-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="journeys-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="journeys-content">
        {currentData.length > 0 ? (
          <div className="journeys-grid">
            {currentData.map(journey => (
              <div key={journey.id} className={`journey-card ${activeTab}`}>
                <div className="journey-image">
                  <div className="image-placeholder">🌿</div>
                  <div className="journey-status">
                    <span className={`status-badge ${journey.status}`}>
                      {journey.status}
                    </span>
                  </div>
                  {journey.progress && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${journey.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="journey-content">
                  <div className="journey-header">
                    <h3>{journey.title}</h3>
                    {journey.rating && (
                      <div className="rating">
                        ⭐ {journey.rating}/5
                      </div>
                    )}
                  </div>

                  <div className="journey-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{journey.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🏢</span>
                      <span>{journey.provider}</span>
                    </div>
                    {journey.startDate && (
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(journey.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {journey.participants && (
                    <div className="journey-details">
                      <span className="participants">👥 {journey.participants} people</span>
                      <span className="price">${journey.totalPrice || journey.price}</span>
                    </div>
                  )}

                  <div className="sustainability-info">
                    <span className="sustainability-score">
                      🌿 {journey.sustainability}/5 Sustainability
                    </span>
                  </div>

                  {/* Current Trip Specific */}
                  {activeTab === 'current' && journey.nextActivity && (
                    <div className="next-activity">
                      <h4>Next Activity:</h4>
                      <p>{journey.nextActivity}</p>
                    </div>
                  )}

                  {/* Upcoming Trip Specific */}
                  {activeTab === 'upcoming' && journey.daysUntil && (
                    <div className="countdown">
                      <span className="days-until">{journey.daysUntil} days to go</span>
                    </div>
                  )}

                  {/* Completed Trip Specific */}
                  {activeTab === 'completed' && (
                    <div className="completed-info">
                      {journey.review && (
                        <div className="review">
                          <h4>Your Review:</h4>
                          <p>"{journey.review}"</p>
                        </div>
                      )}
                      <div className="impact-summary">
                        <div className="impact-item">
                          <span className="impact-icon">🌱</span>
                          <span>{journey.carbonOffset}t CO₂ offset</span>
                        </div>
                        <div className="impact-item">
                          <span className="impact-icon">🤝</span>
                          <span>{journey.localImpact}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wishlist Specific */}
                  {activeTab === 'wishlist' && (
                    <div className="wishlist-info">
                      <div className="wishlist-meta">
                        <span className="rating">⭐ {journey.rating} ({journey.reviewCount})</span>
                        <span className="price">${journey.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="journey-actions">
                    {activeTab === 'current' && (
                      <>
                        <button className="btn btn-primary">View Itinerary</button>
                        <button className="btn btn-outline">Contact Guide</button>
                        <button 
                          className="btn btn-outline cancel"
                          onClick={() => handleCancelBooking(journey.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {activeTab === 'upcoming' && (
                      <>
                        <button className="btn btn-primary">View Details</button>
                        <button className="btn btn-outline">Modify Booking</button>
                        <button 
                          className="btn btn-outline cancel"
                          onClick={() => handleCancelBooking(journey.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {activeTab === 'completed' && (
                      <>
                        <button className="btn btn-primary">Book Again</button>
                        <button className="btn btn-outline">Share Experience</button>
                        <button className="btn btn-outline">Download Certificate</button>
                      </>
                    )}

                    {activeTab === 'wishlist' && (
                      <>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleBookFromWishlist(journey.id)}
                        >
                          Book Now
                        </button>
                        <button className="btn btn-outline">View Details</button>
                        <button 
                          className="btn btn-outline remove"
                          onClick={() => handleRemoveFromWishlist(journey.id)}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'current' && '🚀'}
              {activeTab === 'upcoming' && '📅'}
              {activeTab === 'completed' && '✅'}
              {activeTab === 'wishlist' && '💝'}
            </div>
            <h3>No {tabs.find(t => t.id === activeTab)?.name.toLowerCase()} yet</h3>
            <p>
              {activeTab === 'wishlist' 
                ? 'Start building your wishlist of amazing eco experiences!' 
                : 'Ready to start your next eco adventure?'}
            </p>
            <button className="btn btn-primary">
              {activeTab === 'wishlist' ? 'Explore Experiences' : 'Book Your Next Trip'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJourneys;