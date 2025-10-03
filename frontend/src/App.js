import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import './App-New.css';
import './components/components.css';
import './components/components-new.css';
import './components/provider/provider.css';

// New Components
import AppNew from './App-New';

// Old Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EcoDiscoveryHub from './components/EcoDiscoveryHub';
import EcoJourneys from './components/EcoJourneys';
import EtcpVoyager from './components/EtcpVoyager';
import Settings from './components/Settings';
import ProviderDashboard from './components/provider/ProviderDashboard';
import ProviderRegistration from './components/provider/ProviderRegistration';
import ReviewsManagement from './components/provider/ReviewsManagement';
import AdvancedAnalytics from './components/provider/AdvancedAnalytics';
import PaymentManagement from './components/provider/PaymentManagement';
import MessagingCenter from './components/provider/MessagingCenter';

function App() {
  const [useNewInterface, setUseNewInterface] = useState(true); // Toggle for new interface
  const [theme, setTheme] = useState('eco-modern');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('traveler'); // 'traveler' or 'provider'

  // Show interface selector if not logged in and no selection made
  const showInterfaceSelector = !user && useNewInterface === null;

  useEffect(() => {
    // Load user preferences
    const savedTheme = localStorage.getItem('etcp-theme') || theme;
    const savedInterface = localStorage.getItem('interface-choice');
    
    if (savedInterface) {
      setUseNewInterface(savedInterface === 'new');
    }
    
    setTheme(savedTheme);
    document.body.className = savedTheme;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType || 'traveler');
    }
  }, []);

  const handleInterfaceChoice = (choice) => {
    setUseNewInterface(choice === 'new');
    localStorage.setItem('interface-choice', choice);
  };

  // If new interface is selected, render the new App
  if (useNewInterface) {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          border: 'none',
          transition: 'all 0.3s ease'
        }} 
        onClick={() => handleInterfaceChoice('old')}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🔄 Switch to Classic Interface
        </div>
        <AppNew />
      </div>
    );
  }

  // Original interface below
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType('traveler');
    window.location.href = '/login';
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAuth = true }) => {
    const token = localStorage.getItem('token');
    if (requireAuth && !token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('etcp-theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <Router>
      <div className="App">
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          border: 'none',
          transition: 'all 0.3s ease'
        }} 
        onClick={() => handleInterfaceChoice('new')}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🚀 Try New Interface
        </div>
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>🌿 ETCP</h1>
              <span>Eco-Tourism Cloud Platform</span>
            </Link>
            <nav className="main-nav">
              {user ? (
                <>
                  {userType === 'traveler' ? (
                    <>
                      <Link to="/discover" className="nav-link">Eco-Discovery Hub</Link>
                      <Link to="/journeys" className="nav-link">Eco-Journeys</Link>
                      <Link to="/voyager" className="nav-link">ETCP Voyager</Link>
                      <Link to="/settings" className="nav-link">Settings</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/provider" className="nav-link">Dashboard</Link>
                      <Link to="/provider/analytics" className="nav-link">Analytics</Link>
                      <Link to="/provider/reviews" className="nav-link">Reviews</Link>
                      <Link to="/provider/payments" className="nav-link">Payments</Link>
                      <Link to="/provider/messages" className="nav-link">Messages</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Sign Up</Link>
                </>
              )}
            </nav>
            {user && (
              <div className="user-info">
                Welcome, {user.name}!
              </div>
            )}
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? (userType === 'provider' ? <Navigate to="/provider" /> : <Navigate to="/discover" />) : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Traveler Routes */}
            <Route path="/discover" element={<ProtectedRoute><EcoDiscoveryHub /></ProtectedRoute>} />
            <Route path="/journeys" element={<ProtectedRoute><EcoJourneys /></ProtectedRoute>} />
            <Route path="/voyager" element={<ProtectedRoute><EtcpVoyager /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings onThemeChange={handleThemeChange} /></ProtectedRoute>} />
            
            {/* Provider Routes */}
            <Route path="/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
            <Route path="/provider/register" element={<ProtectedRoute><ProviderRegistration onComplete={() => window.location.href = '/provider'} /></ProtectedRoute>} />
            <Route path="/provider/reviews" element={<ProtectedRoute><ReviewsManagement /></ProtectedRoute>} />
            <Route path="/provider/analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
            <Route path="/provider/payments" element={<ProtectedRoute><PaymentManagement /></ProtectedRoute>} />
            <Route path="/provider/messages" element={<ProtectedRoute><MessagingCenter /></ProtectedRoute>} />
            <Route path="/settings" element={<Settings onThemeChange={handleThemeChange} currentTheme={theme} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 ETCP - Sustainable Travel for a Better Tomorrow</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;