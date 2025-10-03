import React, { useState } from 'react';

const ProviderRegistration = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    country: '',
    coordinates: { lat: '', lng: '' },
    
    // Business Details
    businessType: '',
    yearEstablished: '',
    businessLicense: '',
    taxId: '',
    description: '',
    
    // Sustainability Credentials
    certifications: [],
    sustainabilityPractices: [],
    environmentalPolicies: '',
    communityInvolvement: '',
    
    // Experience Categories
    experienceTypes: [],
    targetAudience: [],
    groupSizes: { min: '', max: '' },
    
    // Verification Documents
    documents: [],
    agreementAccepted: false
  });

  const [newCertification, setNewCertification] = useState('');
  const [newPractice, setNewPractice] = useState('');

  const businessTypes = [
    'Tour Operator', 'Lodge/Accommodation', 'Guide Service', 
    'Conservation Organization', 'Cultural Center', 'Adventure Company',
    'Wildlife Sanctuary', 'Community-based Tourism', 'Educational Institution'
  ];

  const experienceCategories = [
    'Wildlife Watching', 'Hiking/Trekking', 'Cultural Experiences', 
    'Marine Conservation', 'Forest Conservation', 'Community Tourism',
    'Photography Tours', 'Bird Watching', 'Volunteering', 'Educational Tours'
  ];

  const targetAudiences = [
    'Families', 'Solo Travelers', 'Couples', 'Student Groups', 
    'Corporate Groups', 'Seniors', 'Adventure Seekers', 'Photography Enthusiasts'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      coordinates: { ...formData.coordinates, [name]: value }
    });
  };

  const handleGroupSizeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      groupSizes: { ...formData.groupSizes, [name]: value }
    });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setFormData({ ...formData, [field]: newValues });
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    });
  };

  const addPractice = () => {
    if (newPractice.trim()) {
      setFormData({
        ...formData,
        sustainabilityPractices: [...formData.sustainabilityPractices, newPractice.trim()]
      });
      setNewPractice('');
    }
  };

  const removePractice = (index) => {
    setFormData({
      ...formData,
      sustainabilityPractices: formData.sustainabilityPractices.filter((_, i) => i !== index)
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would submit to backend
    console.log('Provider registration data:', formData);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="registration-step">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your eco-tourism business name"
                />
              </div>
              <div className="form-group">
                <label>Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  placeholder="Primary contact person"
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="business@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="form-group">
                <label>Business Type *</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="registration-step">
            <h3>Location Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Business Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address"
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  name="lat"
                  value={formData.coordinates.lat}
                  onChange={handleCoordinateChange}
                  step="any"
                  placeholder="e.g., 6.9271"
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
                  placeholder="e.g., 79.8612"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="registration-step">
            <h3>Business Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Year Established</label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="form-group">
                <label>Business License Number</label>
                <input
                  type="text"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleInputChange}
                  placeholder="License/Registration number"
                />
              </div>
              <div className="form-group">
                <label>Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Tax identification number"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Business Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe your eco-tourism business, mission, and values..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="registration-step">
            <h3>Sustainability Credentials</h3>
            
            <div className="form-section">
              <h4>Certifications</h4>
              <div className="list-input">
                <div className="add-item">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="e.g., Green Tourism Certified, IUCN Member"
                  />
                  <button type="button" onClick={addCertification} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="item-list">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="list-item">
                      <span>🏆 {cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="remove-btn"
                      >
                        ✗
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Sustainability Practices</h4>
              <div className="list-input">
                <div className="add-item">
                  <input
                    type="text"
                    value={newPractice}
                    onChange={(e) => setNewPractice(e.target.value)}
                    placeholder="e.g., Zero waste policy, Solar powered facilities"
                  />
                  <button type="button" onClick={addPractice} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="item-list">
                  {formData.sustainabilityPractices.map((practice, index) => (
                    <div key={index} className="list-item">
                      <span>🌱 {practice}</span>
                      <button
                        type="button"
                        onClick={() => removePractice(index)}
                        className="remove-btn"
                      >
                        ✗
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Environmental Policies</label>
              <textarea
                name="environmentalPolicies"
                value={formData.environmentalPolicies}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your environmental protection policies..."
              />
            </div>

            <div className="form-group">
              <label>Community Involvement</label>
              <textarea
                name="communityInvolvement"
                value={formData.communityInvolvement}
                onChange={handleInputChange}
                rows="3"
                placeholder="How do you support local communities?"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="registration-step">
            <h3>Experience Categories</h3>
            
            <div className="form-section">
              <h4>Types of Experiences You Offer</h4>
              <div className="checkbox-grid">
                {experienceCategories.map(category => (
                  <label key={category} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.experienceTypes.includes(category)}
                      onChange={() => handleMultiSelect('experienceTypes', category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h4>Target Audience</h4>
              <div className="checkbox-grid">
                {targetAudiences.map(audience => (
                  <label key={audience} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.targetAudience.includes(audience)}
                      onChange={() => handleMultiSelect('targetAudience', audience)}
                    />
                    <span>{audience}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h4>Group Sizes</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Minimum Group Size</label>
                  <input
                    type="number"
                    name="min"
                    value={formData.groupSizes.min}
                    onChange={handleGroupSizeChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Group Size</label>
                  <input
                    type="number"
                    name="max"
                    value={formData.groupSizes.max}
                    onChange={handleGroupSizeChange}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="registration-step">
            <h3>Agreement & Verification</h3>
            
            <div className="agreement-section">
              <h4>ETCP Provider Agreement</h4>
              <div className="agreement-text">
                <p>By joining the Eco-Tourism Cloud Platform (ETCP) as a provider, you agree to:</p>
                <ul>
                  <li>Maintain high standards of environmental sustainability</li>
                  <li>Provide accurate information about your experiences</li>
                  <li>Respect local communities and cultures</li>
                  <li>Follow responsible tourism practices</li>
                  <li>Submit to periodic sustainability audits</li>
                  <li>Maintain appropriate insurance coverage</li>
                  <li>Comply with local laws and regulations</li>
                </ul>
              </div>
              
              <label className="checkbox-item agreement-checkbox">
                <input
                  type="checkbox"
                  name="agreementAccepted"
                  checked={formData.agreementAccepted}
                  onChange={handleInputChange}
                  required
                />
                <span>I agree to the ETCP Provider Terms and Conditions</span>
              </label>
            </div>

            <div className="verification-notice">
              <h4>🔍 Verification Process</h4>
              <p>After submission, our team will review your application within 5-7 business days. We may request additional documentation or schedule a verification call.</p>
              <p>You will receive email updates on your application status.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="provider-registration">
      <div className="registration-header">
        <h1>Join the Eco-Explorer Network</h1>
        <p>Register your eco-tourism business with ETCP</p>
        
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div
                key={num}
                className={`progress-step ${step >= num ? 'completed' : ''} ${step === num ? 'active' : ''}`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="progress-labels">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Business</span>
            <span>Sustainability</span>
            <span>Experiences</span>
            <span>Agreement</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {renderStep()}
        
        <div className="form-navigation">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="button secondary">
              Previous
            </button>
          )}
          {step < 6 ? (
            <button type="button" onClick={nextStep} className="button">
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="button"
              disabled={!formData.agreementAccepted}
            >
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProviderRegistration;