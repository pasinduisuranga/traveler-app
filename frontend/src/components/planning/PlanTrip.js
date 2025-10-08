import React, { useState, useEffect, useCallback } from 'react';

const PlanTrip = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [tripPlan, setTripPlan] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [],
    sustainability: 'high',
    experiences: [],
    accommodation: '',
    transport: ''
  });

  const [calculatedImpact, setCalculatedImpact] = useState({
    carbonFootprint: 0,
    carbonOffset: 0,
    localEconomySupport: 0,
    sustainabilityScore: 0
  });

  const steps = [
    { id: 1, title: 'Destination & Dates', icon: '🗺️' },
    { id: 2, title: 'Preferences', icon: '❤️' },
    { id: 3, title: 'Experiences', icon: '🌿' },
    { id: 4, title: 'Impact Calculator', icon: '🌱' },
    { id: 5, title: 'Review & Book', icon: '✅' }
  ];

  const destinations = [
    { id: 'sri-lanka', name: 'Sri Lanka', experiences: 24, sustainability: 4.7 },
    { id: 'costa-rica', name: 'Costa Rica', experiences: 18, sustainability: 4.8 },
    { id: 'new-zealand', name: 'New Zealand', experiences: 15, sustainability: 4.6 },
    { id: 'norway', name: 'Norway', experiences: 12, sustainability: 4.9 },
    { id: 'bhutan', name: 'Bhutan', experiences: 8, sustainability: 5.0 }
  ];

  const interests = [
    { id: 'wildlife', name: 'Wildlife Watching', icon: '🦋' },
    { id: 'hiking', name: 'Hiking & Trekking', icon: '🥾' },
    { id: 'cultural', name: 'Cultural Experiences', icon: '🏛️' },
    { id: 'conservation', name: 'Conservation Work', icon: '🌱' },
    { id: 'marine', name: 'Marine Adventures', icon: '🐠' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'wellness', name: 'Wellness & Yoga', icon: '🧘' },
    { id: 'adventure', name: 'Adventure Sports', icon: '🏄' }
  ];

  const recommendedExperiences = [
    {
      id: 1,
      title: 'Sinharaja Rainforest Trek',
      location: 'Sinharaja, Sri Lanka',
      duration: '1 day',
      price: 85,
      sustainability: 4.8,
      carbonOffset: 2.3,
      matchScore: 95
    },
    {
      id: 2,
      title: 'Whale Watching Experience',
      location: 'Mirissa, Sri Lanka',
      duration: '4 hours',
      price: 120,
      sustainability: 4.5,
      carbonOffset: 1.8,
      matchScore: 87
    },
    {
      id: 3,
      title: 'Tea Plantation Cultural Walk',
      location: 'Ella, Sri Lanka',
      duration: '3 hours',
      price: 45,
      sustainability: 4.7,
      carbonOffset: 0.8,
      matchScore: 82
    }
  ];

  const handleInputChange = (field, value) => {
    setTripPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interestId) => {
    setTripPlan(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleExperienceToggle = (experience) => {
    setTripPlan(prev => {
      const isSelected = prev.experiences.some(exp => exp.id === experience.id);
      return {
        ...prev,
        experiences: isSelected
          ? prev.experiences.filter(exp => exp.id !== experience.id)
          : [...prev.experiences, experience]
      };
    });
  };

  const calculateImpact = useCallback(() => {
    const selectedExperiences = tripPlan.experiences;
    const totalCarbonOffset = selectedExperiences.reduce((sum, exp) => sum + exp.carbonOffset, 0);
    const totalCost = selectedExperiences.reduce((sum, exp) => sum + exp.price, 0);
    const avgSustainability = selectedExperiences.length > 0 
      ? selectedExperiences.reduce((sum, exp) => sum + exp.sustainability, 0) / selectedExperiences.length 
      : 0;

    // Simplified calculations
    const carbonFootprint = tripPlan.travelers * 2.5; // Simplified calculation
    const localEconomySupport = totalCost * 0.7; // 70% goes to local economy

    setCalculatedImpact({
      carbonFootprint,
      carbonOffset: totalCarbonOffset,
      localEconomySupport,
      sustainabilityScore: avgSustainability * 20 // Convert to 100 scale
    });
  }, [tripPlan.experiences, tripPlan.travelers]);

  useEffect(() => {
    calculateImpact();
  }, [calculateImpact]);

  const canProceed = (step) => {
    switch (step) {
      case 1:
        return tripPlan.destination && tripPlan.startDate && tripPlan.endDate;
      case 2:
        return tripPlan.interests.length > 0 && tripPlan.budget;
      case 3:
        return tripPlan.experiences.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>🗺️ Choose Your Destination & Dates</h2>
            <p>Select where you'd like to go and when you want to travel</p>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Destination</label>
                <div className="destination-grid">
                  {destinations.map(dest => (
                    <div
                      key={dest.id}
                      className={`destination-card ${tripPlan.destination === dest.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange('destination', dest.id)}
                    >
                      <h4>{dest.name}</h4>
                      <p>{dest.experiences} eco experiences</p>
                      <div className="sustainability-score">
                        🌿 {dest.sustainability}/5
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="date-section">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={tripPlan.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={tripPlan.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="form-input"
                    min={tripPlan.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Travelers</label>
                <select
                  value={tripPlan.travelers}
                  onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                  className="form-select"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>❤️ Tell Us Your Preferences</h2>
            <p>Help us recommend the perfect eco experiences for you</p>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">What interests you? (Select all that apply)</label>
                <div className="interests-grid">
                  {interests.map(interest => (
                    <button
                      key={interest.id}
                      className={`interest-btn ${tripPlan.interests.includes(interest.id) ? 'selected' : ''}`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <span className="interest-icon">{interest.icon}</span>
                      <span className="interest-name">{interest.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Budget Range (per person)</label>
                <select
                  value={tripPlan.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select budget range</option>
                  <option value="budget">Budget ($50-150 per day)</option>
                  <option value="mid">Mid-range ($150-300 per day)</option>
                  <option value="luxury">Luxury ($300+ per day)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sustainability Priority</label>
                <div className="sustainability-options">
                  {['high', 'medium', 'low'].map(level => (
                    <button
                      key={level}
                      className={`sustainability-btn ${tripPlan.sustainability === level ? 'selected' : ''}`}
                      onClick={() => handleInputChange('sustainability', level)}
                    >
                      <span className="sustainability-icon">
                        {level === 'high' ? '🌿🌿🌿' : level === 'medium' ? '🌿🌿' : '🌿'}
                      </span>
                      <span className="sustainability-label">
                        {level.charAt(0).toUpperCase() + level.slice(1)} Priority
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>🌿 Choose Your Experiences</h2>
            <p>Based on your preferences, here are our top recommendations</p>

            <div className="experiences-section">
              {recommendedExperiences.map(experience => {
                const isSelected = tripPlan.experiences.some(exp => exp.id === experience.id);
                return (
                  <div
                    key={experience.id}
                    className={`experience-recommendation ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleExperienceToggle(experience)}
                  >
                    <div className="experience-header">
                      <div className="experience-info">
                        <h4>{experience.title}</h4>
                        <p>{experience.location} • {experience.duration}</p>
                      </div>
                      <div className="experience-score">
                        <span className="match-score">{experience.matchScore}% match</span>
                      </div>
                    </div>
                    
                    <div className="experience-details">
                      <div className="experience-meta">
                        <span className="price">${experience.price}</span>
                        <span className="sustainability">🌿 {experience.sustainability}/5</span>
                        <span className="carbon-offset">🌱 {experience.carbonOffset}t CO₂ offset</span>
                      </div>
                    </div>
                    
                    <div className="selection-indicator">
                      {isSelected ? '✅ Selected' : '○ Select'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="selection-summary">
              <h4>Selected Experiences ({tripPlan.experiences.length})</h4>
              <div className="selected-list">
                {tripPlan.experiences.map(exp => (
                  <div key={exp.id} className="selected-experience">
                    <span>{exp.title}</span>
                    <span>${exp.price}</span>
                  </div>
                ))}
              </div>
              <div className="total-cost">
                <strong>Total: ${tripPlan.experiences.reduce((sum, exp) => sum + exp.price, 0)}</strong>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>🌱 Environmental Impact Calculator</h2>
            <p>See the positive impact your trip will have on the environment and local communities</p>

            <div className="impact-dashboard">
              <div className="impact-card positive">
                <div className="impact-icon">🌱</div>
                <div className="impact-content">
                  <h3>{calculatedImpact.carbonOffset.toFixed(1)} tons</h3>
                  <p>Carbon Offset</p>
                  <small>Through your chosen eco experiences</small>
                </div>
              </div>

              <div className="impact-card neutral">
                <div className="impact-icon">✈️</div>
                <div className="impact-content">
                  <h3>{calculatedImpact.carbonFootprint.toFixed(1)} tons</h3>
                  <p>Estimated Carbon Footprint</p>
                  <small>Including travel and activities</small>
                </div>
              </div>

              <div className="impact-card positive">
                <div className="impact-icon">🤝</div>
                <div className="impact-content">
                  <h3>${calculatedImpact.localEconomySupport.toFixed(0)}</h3>
                  <p>Local Economy Support</p>
                  <small>Direct contribution to communities</small>
                </div>
              </div>

              <div className="impact-card positive">
                <div className="impact-icon">🏆</div>
                <div className="impact-content">
                  <h3>{calculatedImpact.sustainabilityScore.toFixed(0)}/100</h3>
                  <p>Sustainability Score</p>
                  <small>Based on your experience choices</small>
                </div>
              </div>
            </div>

            <div className="net-impact">
              <h3>Net Environmental Impact</h3>
              <div className="net-calculation">
                <span className="footprint">-{calculatedImpact.carbonFootprint.toFixed(1)}t CO₂ footprint</span>
                <span className="plus">+</span>
                <span className="offset">+{calculatedImpact.carbonOffset.toFixed(1)}t CO₂ offset</span>
                <span className="equals">=</span>
                <span className={`net-result ${calculatedImpact.carbonOffset > calculatedImpact.carbonFootprint ? 'positive' : 'negative'}`}>
                  {calculatedImpact.carbonOffset > calculatedImpact.carbonFootprint ? 
                    `+${(calculatedImpact.carbonOffset - calculatedImpact.carbonFootprint).toFixed(1)}t CO₂ positive impact!` :
                    `${(calculatedImpact.carbonFootprint - calculatedImpact.carbonOffset).toFixed(1)}t CO₂ to offset`
                  }
                </span>
              </div>
            </div>

            <div className="impact-improvements">
              <h4>💡 Ways to Improve Your Impact</h4>
              <ul>
                <li>🚂 Consider train travel instead of flights for shorter distances</li>
                <li>🏨 Choose eco-certified accommodations</li>
                <li>🌱 Add more conservation experiences to your itinerary</li>
                <li>♻️ Pack reusable items to reduce waste</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>✅ Review & Book Your Eco Adventure</h2>
            <p>Everything looks great! Review your trip details and complete your booking</p>

            <div className="trip-summary">
              <div className="summary-section">
                <h3>📍 Destination & Dates</h3>
                <p><strong>{destinations.find(d => d.id === tripPlan.destination)?.name}</strong></p>
                <p>{new Date(tripPlan.startDate).toLocaleDateString()} - {new Date(tripPlan.endDate).toLocaleDateString()}</p>
                <p>{tripPlan.travelers} {tripPlan.travelers === 1 ? 'traveler' : 'travelers'}</p>
              </div>

              <div className="summary-section">
                <h3>🌿 Selected Experiences</h3>
                {tripPlan.experiences.map(exp => (
                  <div key={exp.id} className="summary-experience">
                    <span>{exp.title}</span>
                    <span>${exp.price}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total: ${tripPlan.experiences.reduce((sum, exp) => sum + exp.price, 0) * tripPlan.travelers}</strong>
                </div>
              </div>

              <div className="summary-section">
                <h3>🌱 Your Impact</h3>
                <div className="impact-summary">
                  <div className="impact-item">
                    <span>Carbon Offset: {calculatedImpact.carbonOffset.toFixed(1)}t CO₂</span>
                  </div>
                  <div className="impact-item">
                    <span>Local Support: ${calculatedImpact.localEconomySupport.toFixed(0)}</span>
                  </div>
                  <div className="impact-item">
                    <span>Sustainability Score: {calculatedImpact.sustainabilityScore.toFixed(0)}/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn btn-primary btn-lg">
                Complete Booking - ${tripPlan.experiences.reduce((sum, exp) => sum + exp.price, 0) * tripPlan.travelers}
              </button>
              <button className="btn btn-outline">Save Trip Plan</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plan-trip fade-in">
      {/* Progress Steps */}
      <div className="trip-planner-header">
        <h1>🗺️ Plan Your Eco Adventure</h1>
        <div className="steps-progress">
          {steps.map(step => (
            <div
              key={step.id}
              className={`step ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
            >
              <div className="step-number">
                {activeStep > step.id ? '✅' : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-container">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="step-navigation">
        {activeStep > 1 && (
          <button
            className="btn btn-outline"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Previous
          </button>
        )}
        
        {activeStep < steps.length && (
          <button
            className={`btn btn-primary ${!canProceed(activeStep) ? 'disabled' : ''}`}
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={!canProceed(activeStep)}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanTrip;