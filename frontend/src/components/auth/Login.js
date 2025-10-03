import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './auth.css';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('traveler'); // 'traveler' or 'provider'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        ...formData,
        userType
      });

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userType', userType);

      // Redirect based on user type
      if (userType === 'provider') {
        navigate('/provider');
      } else {
        navigate('/discover');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌿 Welcome to ETCP</h1>
          <p>Eco-Tourism Cloud Platform</p>
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
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials</h4>
          <div className="demo-section">
            <strong>Traveler:</strong>
            <p>Email: traveler@demo.com | Password: demo123</p>
          </div>
          <div className="demo-section">
            <strong>Provider:</strong>
            <p>Email: provider@demo.com | Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
