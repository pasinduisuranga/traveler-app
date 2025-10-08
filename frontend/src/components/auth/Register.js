import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, apiUtils } from '../../services/api';
import './auth.css';

function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('traveler');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear specific field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phone && !/^[+]?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await authAPI.register({
        ...registrationData,
        userType
      });

      const result = apiUtils.formatResponse(response);
      
      if (result.success && result.data.token) {
        // Save token and user data
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('userType', userType);

        // Redirect based on user type
        if (userType === 'provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrors({ general: result.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      
      // Handle validation errors from backend
      if (err.errors && Array.isArray(err.errors)) {
        const backendErrors = {};
        err.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌿 Join ETCP</h1>
          <p>Start your eco-tourism journey</p>
        </div>

        {/* User Type Toggle */}
        <div className="user-type-toggle">
          <button
            className={userType === 'traveler' ? 'active' : ''}
            onClick={() => setUserType('traveler')}
          >
            🧳 Traveler
          </button>
          <button
            className={userType === 'provider' ? 'active' : ''}
            onClick={() => setUserType('provider')}
          >
            🏢 Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              Full Name {userType === 'provider' ? '/ Business Name' : ''}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={userType === 'provider' ? 'Your business name' : 'Your full name'}
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
            <small className="password-hint">
              Must be 8+ characters with uppercase, lowercase, number, and special character
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country (Optional)</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
              />
            </div>
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-links">
            <Link to="/login">
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        <div className="terms-notice">
          <small>
            By creating an account, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
