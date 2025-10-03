import React, { useState, useEffect, useCallback } from 'react';

const ExploreHub = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    priceRange: [0, 500],
    sustainabilityRating: 0,
    duration: '',
    difficulty: '',
    groupSize: ''
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Experiences', icon: '🌍', count: 24 },
    { id: 'hiking', name: 'Hiking & Trekking', icon: '🥾', count: 8 },
    { id: 'wildlife', name: 'Wildlife Watching', icon: '🦋', count: 6 },
    { id: 'cultural', name: 'Cultural Tours', icon: '🏛️', count: 5 },
    { id: 'marine', name: 'Marine Adventures', icon: '🐠', count: 3 },
    { id: 'conservation', name: 'Conservation', icon: '🌱', count: 2 }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'sustainability', label: 'Most Sustainable' },
    { value: 'newest', label: 'Newest First' }
  ];

  const applyFilters = useCallback(() => {
    let filtered = [...experiences];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(exp => exp.type === activeCategory);
    }

    if (filters.search) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(exp => exp.type === filters.type);
    }

    filtered = filtered.filter(exp =>
      exp.price >= filters.priceRange[0] && exp.price <= filters.priceRange[1]
    );

    if (filters.sustainabilityRating > 0) {
      filtered = filtered.filter(exp => exp.sustainabilityRating >= filters.sustainabilityRating);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(exp => exp.difficulty === filters.difficulty);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'sustainability':
          return b.sustainabilityRating - a.sustainabilityRating;
        case 'newest':
          return b.id - a.id;
        default:
          return b.featured ? 1 : -1;
      }
    });

    setFilteredExperiences(filtered);
  }, [experiences, filters, sortBy, activeCategory]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchExperiences = async () => {
    try {
      setTimeout(() => {
        const mockExperiences = [
          {
            id: 1,
            title: 'Sinharaja Rainforest Trek',
            location: 'Sinharaja Forest Reserve, Sri Lanka',
            type: 'hiking',
            sustainabilityRating: 4.8,
            price: 85,
            originalPrice: 95,
            description: 'Explore the pristine biodiversity of UNESCO World Heritage Sinharaja Forest.',
            provider: 'Eco Adventures Lanka',
            duration: '6 hours',
            difficulty: 'moderate',
            groupSize: '8-12 people',
            rating: 4.9,
            reviewCount: 127,
            highlights: ['UNESCO World Heritage Site', 'Endemic Species', 'Expert Guide'],
            carbonOffset: 2.3,
            localImpact: 'Supports 3 local families',
            certifications: ['Green Tourism', 'Wildlife Conservation'],
            availability: 'Available',
            nextDate: '2025-10-15',
            featured: true
          },
          {
            id: 2,
            title: 'Whale Watching at Mirissa',
            location: 'Mirissa, Sri Lanka',
            type: 'marine',
            sustainabilityRating: 4.5,
            price: 120,
            description: 'Sustainable whale watching experience with blue whales and dolphins.',
            provider: 'Ocean Conservation Tours',
            duration: '4 hours',
            difficulty: 'easy',
            groupSize: '15-20 people',
            rating: 4.6,
            reviewCount: 89,
            highlights: ['Blue Whales', 'Dolphin Pods', 'Marine Education'],
            carbonOffset: 1.8,
            localImpact: 'Marine conservation fund',
            certifications: ['Blue Flag', 'Marine Protected'],
            availability: 'Limited',
            nextDate: '2025-10-18'
          }
        ];
        
        setExperiences(mockExperiences);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      priceRange: [0, 500],
      sustainabilityRating: 0,
      duration: '',
      difficulty: '',
      groupSize: ''
    });
    setActiveCategory('all');
  };

  const handleBooking = async (experienceId) => {
    try {
      const bookingData = {
        experienceId,
        date: new Date().toISOString().split('T')[0],
        participants: 1
      };
      
      console.log('Booking:', bookingData);
      alert('Booking initiated! Redirecting to booking form...');
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="explore-loading">
        <div className="loading-spinner">🌍</div>
        <p>Discovering amazing eco experiences...</p>
      </div>
    );
  }

  return (
    <div className="explore-hub fade-in">
      <div className="explore-header">
        <div className="header-content">
          <h1>🌍 Explore Eco Adventures</h1>
          <p>Discover sustainable experiences that make a positive impact on our planet</p>
        </div>
      </div>

      <div className="category-nav">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="explore-controls">
        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search experiences..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input-large"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={clearFilters} className="btn btn-outline btn-sm">
            Clear Filters
          </button>
        </div>
      </div>

      <div className={`experiences-container ${viewMode}`}>
        {filteredExperiences.map(experience => (
          <div key={experience.id} className="experience-card-enhanced">
            <div className="experience-image">
              <div className="image-placeholder">🌿</div>
              {experience.featured && <div className="featured-badge">⭐ Featured</div>}
              <div className="price-tag">
                <span className="price">${experience.price}</span>
              </div>
            </div>

            <div className="experience-content">
              <div className="experience-header">
                <h3>{experience.title}</h3>
                <div className="rating-section">
                  <span className="rating">⭐ {experience.rating}</span>
                  <span className="review-count">({experience.reviewCount})</span>
                </div>
              </div>

              <div className="experience-meta">
                <span className="location">📍 {experience.location}</span>
                <span className="provider">🏢 {experience.provider}</span>
              </div>

              <p className="experience-description">{experience.description}</p>

              <div className="experience-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span>{experience.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span>{experience.groupSize}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏃</span>
                  <span className="capitalize">{experience.difficulty}</span>
                </div>
              </div>

              <div className="highlights">
                {experience.highlights.map((highlight, index) => (
                  <span key={index} className="highlight-tag">
                    ✨ {highlight}
                  </span>
                ))}
              </div>

              <div className="sustainability-section">
                <div className="sustainability-score">
                  <span className="eco-icon">🌿</span>
                  <span className="score">{experience.sustainabilityRating}/5</span>
                  <span className="label">Sustainability</span>
                </div>
                <div className="impact-metrics">
                  <div className="impact-item">
                    <span className="impact-icon">🌱</span>
                    <span>{experience.carbonOffset}t CO₂ offset</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-icon">🤝</span>
                    <span>{experience.localImpact}</span>
                  </div>
                </div>
              </div>

              <div className="experience-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleBooking(experience.id)}
                >
                  Book Experience
                </button>
                <button className="btn btn-outline">
                  ❤️ Save
                </button>
                <button className="btn btn-outline">
                  📋 Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No experiences found</h3>
          <p>Try adjusting your filters to discover more eco adventures.</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreHub;