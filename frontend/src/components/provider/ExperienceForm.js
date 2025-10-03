import React, { useState } from 'react';

const ExperienceForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    type: initialData?.type || 'hiking',
    price: initialData?.price || '',
    maxParticipants: initialData?.maxParticipants || '',
    duration: initialData?.duration || '',
    difficulty: initialData?.difficulty || 'beginner',
    sustainabilityPractices: initialData?.sustainabilityPractices || [],
    inclusions: initialData?.inclusions || [],
    requirements: initialData?.requirements || [],
    cancellationPolicy: initialData?.cancellationPolicy || '',
    images: initialData?.images || [],
    availableDates: initialData?.availableDates || [],
    coordinates: initialData?.coordinates || { lat: '', lng: '' }
  });

  const [sustainabilityPractice, setSustainabilityPractice] = useState('');
  const [inclusion, setInclusion] = useState('');
  const [requirement, setRequirement] = useState('');
  const [availableDate, setAvailableDate] = useState('');

  const experienceTypes = [
    'hiking', 'wildlife watching', 'cultural', 'volunteering', 
    'marine conservation', 'forest conservation', 'community tourism',
    'photography', 'birdwatching', 'cycling'
  ];

  const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      coordinates: { ...formData.coordinates, [name]: value }
    });
  };

  const addSustainabilityPractice = () => {
    if (sustainabilityPractice.trim()) {
      setFormData({
        ...formData,
        sustainabilityPractices: [...formData.sustainabilityPractices, sustainabilityPractice.trim()]
      });
      setSustainabilityPractice('');
    }
  };

  const removeSustainabilityPractice = (index) => {
    setFormData({
      ...formData,
      sustainabilityPractices: formData.sustainabilityPractices.filter((_, i) => i !== index)
    });
  };

  const addInclusion = () => {
    if (inclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusion.trim()]
      });
      setInclusion('');
    }
  };

  const removeInclusion = (index) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions.filter((_, i) => i !== index)
    });
  };

  const addRequirement = () => {
    if (requirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirement.trim()]
      });
      setRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const addAvailableDate = () => {
    if (availableDate.trim()) {
      setFormData({
        ...formData,
        availableDates: [...formData.availableDates, availableDate.trim()]
      });
      setAvailableDate('');
    }
  };

  const removeAvailableDate = (index) => {
    setFormData({
      ...formData,
      availableDates: formData.availableDates.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="experience-form-container">
      <div className="form-header">
        <h2>{initialData ? 'Edit Experience' : 'Create New Experience'}</h2>
        <button className="close-btn" onClick={onCancel}>✗</button>
      </div>

      <form onSubmit={handleSubmit} className="experience-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Experience Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Sinharaja Rainforest Trek"
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Sinharaja Forest Reserve, Sri Lanka"
              />
            </div>
            <div className="form-group">
              <label>Experience Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {experienceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <h3>Description</h3>
          <div className="form-group">
            <label>Experience Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe your eco-tourism experience in detail..."
            />
          </div>
        </div>

        {/* Pricing & Logistics */}
        <div className="form-section">
          <h3>Pricing & Logistics</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Price per Person (USD) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Maximum Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 4 hours, Full day, 3 days"
              />
            </div>
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="form-section">
          <h3>Location Coordinates</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.coordinates.lat}
                onChange={handleCoordinateChange}
                step="any"
                placeholder="e.g., 6.4067"
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                name="lng"
                value={formData.coordinates.lng}
                onChange={handleCoordinateChange}
                step="any"
                placeholder="e.g., 80.4167"
              />
            </div>
          </div>
        </div>

        {/* Sustainability Practices */}
        <div className="form-section">
          <h3>Sustainability Practices</h3>
          <div className="list-input">
            <div className="add-item">
              <input
                type="text"
                value={sustainabilityPractice}
                onChange={(e) => setSustainabilityPractice(e.target.value)}
                placeholder="e.g., Zero plastic policy, Local guide employment"
              />
              <button type="button" onClick={addSustainabilityPractice} className="add-btn">
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.sustainabilityPractices.map((practice, index) => (
                <div key={index} className="list-item">
                  <span>🌱 {practice}</span>
                  <button
                    type="button"
                    onClick={() => removeSustainabilityPractice(index)}
                    className="remove-btn"
                  >
                    ✗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inclusions */}
        <div className="form-section">
          <h3>What's Included</h3>
          <div className="list-input">
            <div className="add-item">
              <input
                type="text"
                value={inclusion}
                onChange={(e) => setInclusion(e.target.value)}
                placeholder="e.g., Professional guide, Transportation, Lunch"
              />
              <button type="button" onClick={addInclusion} className="add-btn">
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.inclusions.map((item, index) => (
                <div key={index} className="list-item">
                  <span>✓ {item}</span>
                  <button
                    type="button"
                    onClick={() => removeInclusion(index)}
                    className="remove-btn"
                  >
                    ✗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="form-section">
          <h3>Requirements</h3>
          <div className="list-input">
            <div className="add-item">
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="e.g., Moderate fitness level, Hiking boots required"
              />
              <button type="button" onClick={addRequirement} className="add-btn">
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.requirements.map((req, index) => (
                <div key={index} className="list-item">
                  <span>! {req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="remove-btn"
                  >
                    ✗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Dates */}
        <div className="form-section">
          <h3>Available Dates</h3>
          <div className="list-input">
            <div className="add-item">
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
              />
              <button type="button" onClick={addAvailableDate} className="add-btn">
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.availableDates.map((date, index) => (
                <div key={index} className="list-item">
                  <span>📅 {date}</span>
                  <button
                    type="button"
                    onClick={() => removeAvailableDate(index)}
                    className="remove-btn"
                  >
                    ✗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="form-section">
          <h3>Cancellation Policy</h3>
          <div className="form-group">
            <textarea
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe your cancellation and refund policy..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="button secondary">
            Cancel
          </button>
          <button type="submit" className="button">
            {initialData ? 'Update Experience' : 'Create Experience'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;