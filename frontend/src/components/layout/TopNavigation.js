import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopNavigation = ({ user, notifications, onLogout, onThemeChange, currentTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const themes = [
    { id: 'eco-modern', name: 'Eco Modern', icon: '🌿' },
    { id: 'dark-eco', name: 'Dark Eco', icon: '🌙' },
    { id: 'ocean-modern', name: 'Ocean Blue', icon: '🌊' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="top-navigation">
      <div className="nav-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search experiences, destinations, guides..."
              className="search-input"
            />
            <button className="search-filter-btn" title="Advanced Filters">
              ⚙️
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" title="Quick Book">
            <span className="action-icon">⚡</span>
            <span className="action-label">Quick Book</span>
          </button>
          <button className="quick-action-btn" title="Carbon Calculator">
            <span className="action-icon">🌱</span>
            <span className="action-label">CO₂ Calc</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {/* Theme Selector */}
          <div className="theme-selector-container">
            <button
              className="nav-btn theme-btn"
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              title="Change Theme"
            >
              🎨
            </button>
            {showThemeSelector && (
              <div className="theme-dropdown">
                <h4>Choose Theme</h4>
                <div className="theme-options">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => {
                        onThemeChange(theme.id);
                        setShowThemeSelector(false);
                      }}
                    >
                      <span className="theme-icon">{theme.icon}</span>
                      <span className="theme-name">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="notifications-container">
            <button
              className="nav-btn notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              🔔
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button className="mark-all-read">Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-icon">
                          {notification.type === 'booking' ? '📅' : 
                           notification.type === 'recommendation' ? '✨' : '📢'}
                        </div>
                        <div className="notification-content">
                          <h5>{notification.title}</h5>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <span>🔕</span>
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile-container">
            <button
              className="user-profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" />
                ) : (
                  <span>{user?.name?.charAt(0) || '👤'}</span>
                )}
              </div>
              <div className="user-info">
                <span className="user-greeting">{getGreeting()}</span>
                <span className="user-name">{user?.name || 'Guest'}</span>
              </div>
              <span className="dropdown-arrow">↓</span>
            </button>
            
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" />
                    ) : (
                      <span>{user?.name?.charAt(0) || '👤'}</span>
                    )}
                  </div>
                  <div className="profile-info">
                    <h4>{user?.name || 'Guest User'}</h4>
                    <p>{user?.email || 'guest@example.com'}</p>
                    <div className="eco-status">
                      <span className="eco-badge">🌱 Eco Champion</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-menu">
                  <Link to="/profile" className="profile-menu-item">
                    <span className="menu-icon">👤</span>
                    <span>My Profile</span>
                  </Link>
                  <Link to="/profile/settings" className="profile-menu-item">
                    <span className="menu-icon">⚙️</span>
                    <span>Settings</span>
                  </Link>
                  <Link to="/profile/sustainability" className="profile-menu-item">
                    <span className="menu-icon">🌱</span>
                    <span>Sustainability Score</span>
                  </Link>
                  <Link to="/help" className="profile-menu-item">
                    <span className="menu-icon">❓</span>
                    <span>Help & Support</span>
                  </Link>
                  <div className="profile-menu-divider"></div>
                  <button onClick={onLogout} className="profile-menu-item logout">
                    <span className="menu-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;