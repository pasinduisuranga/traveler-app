import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App-New.css';
import './components/components-new.css';

// Debug Component
import ChromeDebug from './components/ChromeDebug';

// New Components
import Sidebar from './components/layout/Sidebar';
import TopNavigation from './components/layout/TopNavigation';
import Dashboard from './components/dashboard/Dashboard';
import ExploreHub from './components/explore/ExploreHub';
import MyJourneys from './components/journeys/MyJourneys';
import PlanTrip from './components/planning/PlanTrip';
import Community from './components/community/Community';
import Profile from './components/profile/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Provider Components
import ProviderDashboard from './components/provider/ProviderDashboard';
import AdvancedAnalytics from './components/provider/AdvancedAnalytics';
import MessagingCenter from './components/provider/MessagingCenter';

function App() {
  const [theme, setTheme] = useState('eco-green');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('traveler');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load user preferences and initialize app
    initializeApp();
    loadNotifications();
  }, []);

  const initializeApp = () => {
    const savedTheme = localStorage.getItem('etcp-theme') || 'eco-green';
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    setTheme(savedTheme);
    document.body.className = savedTheme;
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType || 'traveler');
    }
  };

  const loadNotifications = () => {
    // Mock notifications - in real app, fetch from API
    setNotifications([
      {
        id: 1,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your Sinharaja Trek booking is confirmed for Oct 15',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'New Eco Experience',
        message: 'Whale watching tour added near your location',
        time: '1 day ago',
        read: false
      }
    ]);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('etcp-theme', newTheme);
    document.body.className = newTheme;
  };

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

  // Layout Component for Authenticated Users
  const AppLayout = ({ children }) => (
    <div className="app-layout">
      <Sidebar 
        userType={userType}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNavigation 
          user={user}
          notifications={notifications}
          onLogout={handleLogout}
          onThemeChange={handleThemeChange}
          currentTheme={theme}
        />
        <main className="main-content-new">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="App-new">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                {userType === 'provider' ? <Navigate to="/provider/dashboard" /> : <Navigate to="/dashboard" />}
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Traveler Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <AppLayout><ExploreHub /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/journeys" element={
            <ProtectedRoute>
              <AppLayout><MyJourneys /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan" element={
            <ProtectedRoute>
              <AppLayout><PlanTrip /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <AppLayout><Community /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout><Profile onThemeChange={handleThemeChange} /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Provider Routes */}
          <Route path="/provider/dashboard" element={
            <ProtectedRoute>
              <AppLayout><ProviderDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/provider/analytics" element={
            <ProtectedRoute>
              <AppLayout><AdvancedAnalytics /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/provider/messages" element={
            <ProtectedRoute>
              <AppLayout><MessagingCenter /></AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;