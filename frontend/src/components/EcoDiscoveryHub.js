import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EcoDiscoveryHub = () => {
  const [experiences, setExperiences] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredExperiences = experiences.filter(exp => {
    return (
      (!filters.location || exp.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.type || exp.type === filters.type) &&
      (exp.sustainabilityRating >= filters.minRating)
    );
  });

  const handleBooking = async (experienceId) => {
    try {
      const bookingData = {
        experienceId,
        date: new Date().toISOString().split('T')[0],
        participants: 1
      };
      const response = await axios.post('/api/bookings', bookingData);
      alert('Booking successful! ' + response.data.message);
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2 className="page-title">Eco-Discovery Hub</h2>
        <p>Loading sustainable experiences...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">🔍 Eco-Discovery Hub</h2>
      <p className="page-subtitle">Discover sustainable travel experiences that make a difference</p>

      <div className="filters-section card">
        <h3>Filter Experiences</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search by location..."
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Activity Type:</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="hiking">Hiking</option>
              <option value="wildlife watching">Wildlife Watching</option>
              <option value="volunteering">Volunteering</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Minimum Sustainability Rating:</label>
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      <div className="experiences-grid">
        {filteredExperiences.map(experience => (
          <div key={experience.id} className="experience-card card">
            <div className="experience-header">
              <h3>{experience.title}</h3>
              <div className="sustainability-badge">
                🌿 {experience.sustainabilityRating}/5
              </div>
            </div>
            <div className="experience-details">
              <p className="location">📍 {experience.location}</p>
              <p className="type">🏃 {experience.type}</p>
              <p className="provider">🏢 {experience.provider}</p>
              <p className="description">{experience.description}</p>
              <div className="price-section">
                <span className="price">${experience.price}</span>
                <span className="price-label">per person</span>
              </div>
            </div>
            <div className="experience-actions">
              <button 
                className="button"
                onClick={() => handleBooking(experience.id)}
              >
                Book Now
              </button>
              <button className="button secondary">
                Add to Wishlist
              </button>
              <button className="button secondary">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="no-results card">
          <h3>No experiences found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default EcoDiscoveryHub;