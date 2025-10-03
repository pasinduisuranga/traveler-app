import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingTrips: [],
    recentActivity: [],
    ecoStats: {},
    recommendations: [],
    weatherData: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      setDashboardData({
        upcomingTrips: [
          {
            id: 1,
            title: 'Sinharaja Rainforest Trek',
            location: 'Sinharaja, Sri Lanka',
            date: '2025-10-15',
            participants: 2,
            status: 'confirmed',
            image: '/images/sinharaja.jpg',
            guide: 'Raj Perera',
            sustainability: 4.8
          },
          {
            id: 2,
            title: 'Whale Watching Experience',
            location: 'Mirissa, Sri Lanka',
            date: '2025-10-22',
            participants: 1,
            status: 'pending',
            image: '/images/whales.jpg',
            guide: 'Ocean Tours',
            sustainability: 4.5
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'booking',
            title: 'New booking confirmed',
            description: 'Sinharaja Trek booking confirmed for Oct 15',
            time: '2 hours ago',
            icon: '🎉'
          },
          {
            id: 2,
            type: 'review',
            title: 'Review received',
            description: 'Thank you for your 5-star review!',
            time: '1 day ago',
            icon: '⭐'
          },
          {
            id: 3,
            type: 'recommendation',
            title: 'New eco experience',
            description: 'Bird watching tour near your location',
            time: '2 days ago',
            icon: '🦅'
          }
        ],
        ecoStats: {
          treesPlanted: 12,
          carbonOffset: 5.2,
          localCommunitySupport: 850,
          biodiversityScore: 87,
          experiencesCompleted: 8,
          sustainabilityRank: 'Eco Champion'
        },
        recommendations: [
          {
            id: 1,
            title: 'Horton Plains National Park',
            location: 'Nuwara Eliya, Sri Lanka',
            type: 'hiking',
            price: 95,
            sustainability: 4.9,
            image: '/images/horton.jpg',
            reason: 'Based on your love for hiking'
          },
          {
            id: 2,
            title: 'Tea Estate Cultural Tour',
            location: 'Ella, Sri Lanka',
            type: 'cultural',
            price: 60,
            sustainability: 4.6,
            image: '/images/tea.jpg',
            reason: 'Perfect for cultural enthusiasts'
          }
        ],
        weatherData: {
          location: 'Colombo, Sri Lanka',
          current: {
            temp: 28,
            condition: 'Partly Cloudy',
            humidity: 75,
            windSpeed: 12
          },
          forecast: [
            { day: 'Today', high: 32, low: 24, condition: 'sunny', icon: '☀️' },
            { day: 'Tomorrow', high: 30, low: 23, condition: 'cloudy', icon: '⛅' },
            { day: 'Wed', high: 29, low: 22, condition: 'rainy', icon: '🌧️' },
            { day: 'Thu', high: 31, low: 25, condition: 'sunny', icon: '☀️' }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = JSON.parse(localStorage.getItem('user'))?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}! 🌅`;
    if (hour < 18) return `Good afternoon, ${name}! ☀️`;
    return `Good evening, ${name}! 🌙`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">🌿</div>
        <p>Loading your eco dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">{getGreeting()}</h1>
          <p className="welcome-subtitle">
            Ready for your next sustainable adventure? Let's make a positive impact together! 🌍
          </p>
        </div>
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.ecoStats.treesPlanted}</span>
              <span className="stat-label">Trees Planted</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.ecoStats.carbonOffset}t</span>
              <span className="stat-label">CO₂ Offset</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-number">{dashboardData.ecoStats.experiencesCompleted}</span>
              <span className="stat-label">Adventures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Trips */}
        <div className="dashboard-section upcoming-trips">
          <div className="section-header">
            <h2>🎒 Upcoming Adventures</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div className="trips-list">
            {dashboardData.upcomingTrips.map(trip => (
              <div key={trip.id} className="trip-card">
                <div className="trip-image">
                  <div className="trip-image-placeholder">🌿</div>
                  <div className="trip-status">
                    <span className={`badge ${trip.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
                <div className="trip-details">
                  <h3>{trip.title}</h3>
                  <p className="trip-location">📍 {trip.location}</p>
                  <p className="trip-date">📅 {new Date(trip.date).toLocaleDateString()}</p>
                  <div className="trip-meta">
                    <span className="participants">👥 {trip.participants} people</span>
                    <span className="sustainability">🌿 {trip.sustainability}/5</span>
                  </div>
                  <div className="trip-actions">
                    <button className="btn btn-primary btn-sm">View Details</button>
                    <button className="btn btn-outline btn-sm">Contact Guide</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {dashboardData.upcomingTrips.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <h3>No upcoming trips</h3>
              <p>Ready to plan your next eco adventure?</p>
              <button className="btn btn-primary">Explore Experiences</button>
            </div>
          )}
        </div>

        {/* Eco Impact Stats */}
        <div className="dashboard-section eco-impact">
          <div className="section-header">
            <h2>🌱 Your Eco Impact</h2>
            <div className="impact-rank">
              <span className="rank-badge">{dashboardData.ecoStats.sustainabilityRank}</span>
            </div>
          </div>
          <div className="impact-stats">
            <div className="impact-item">
              <div className="impact-circle trees">
                <span className="impact-value">{dashboardData.ecoStats.treesPlanted}</span>
                <span className="impact-label">Trees</span>
              </div>
              <p>Trees planted through your travels</p>
            </div>
            <div className="impact-item">
              <div className="impact-circle carbon">
                <span className="impact-value">{dashboardData.ecoStats.carbonOffset}</span>
                <span className="impact-label">Tons CO₂</span>
              </div>
              <p>Carbon footprint offset</p>
            </div>
            <div className="impact-item">
              <div className="impact-circle community">
                <span className="impact-value">${dashboardData.ecoStats.localCommunitySupport}</span>
                <span className="impact-label">Support</span>
              </div>
              <p>Local community support</p>
            </div>
          </div>
          <div className="biodiversity-score">
            <h4>Biodiversity Impact Score</h4>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${dashboardData.ecoStats.biodiversityScore}%` }}
              ></div>
            </div>
            <span className="score-text">{dashboardData.ecoStats.biodiversityScore}/100</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section recent-activity">
          <div className="section-header">
            <h2>⚡ Recent Activity</h2>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Widget */}
        <div className="dashboard-section weather-widget">
          <div className="section-header">
            <h2>🌤️ Weather</h2>
            <span className="weather-location">{dashboardData.weatherData.location}</span>
          </div>
          <div className="current-weather">
            <div className="weather-temp">{dashboardData.weatherData.current.temp}°C</div>
            <div className="weather-condition">{dashboardData.weatherData.current.condition}</div>
          </div>
          <div className="weather-forecast">
            {dashboardData.weatherData.forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <span className="forecast-day-name">{day.day}</span>
                <span className="forecast-icon">{day.icon}</span>
                <span className="forecast-temps">{day.high}°/{day.low}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="dashboard-section recommendations">
          <div className="section-header">
            <h2>✨ Recommended for You</h2>
            <button className="btn btn-outline btn-sm">See More</button>
          </div>
          <div className="recommendations-grid">
            {dashboardData.recommendations.map(rec => (
              <div key={rec.id} className="recommendation-card">
                <div className="rec-image">
                  <div className="rec-image-placeholder">🌿</div>
                  <div className="rec-price">${rec.price}</div>
                </div>
                <div className="rec-content">
                  <h4>{rec.title}</h4>
                  <p className="rec-location">📍 {rec.location}</p>
                  <p className="rec-reason">💡 {rec.reason}</p>
                  <div className="rec-meta">
                    <span className="rec-type">{rec.type}</span>
                    <span className="rec-sustainability">🌿 {rec.sustainability}/5</span>
                  </div>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;