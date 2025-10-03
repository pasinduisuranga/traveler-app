import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userType, collapsed, onToggle }) => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const travelerMenuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      description: 'Overview of your eco journey'
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: '🌍',
      path: '/explore',
      description: 'Discover eco experiences',
      submenu: [
        { title: 'Eco Experiences', path: '/explore/experiences', icon: '🌿' },
        { title: 'Local Guides', path: '/explore/guides', icon: '👥' },
        { title: 'Destinations', path: '/explore/destinations', icon: '📍' },
        { title: 'Reviews', path: '/explore/reviews', icon: '⭐' }
      ]
    },
    {
      id: 'journeys',
      title: 'My Journeys',
      icon: '🎒',
      path: '/journeys',
      description: 'Track your bookings',
      submenu: [
        { title: 'Current Trips', path: '/journeys/current', icon: '🚀' },
        { title: 'Past Adventures', path: '/journeys/history', icon: '📚' },
        { title: 'Wishlist', path: '/journeys/wishlist', icon: '💝' },
        { title: 'Travel Timeline', path: '/journeys/timeline', icon: '📅' }
      ]
    },
    {
      id: 'plan',
      title: 'Trip Planner',
      icon: '🗺️',
      path: '/plan',
      description: 'Plan your eco adventure',
      submenu: [
        { title: 'Route Builder', path: '/plan/routes', icon: '🛤️' },
        { title: 'Impact Calculator', path: '/plan/impact', icon: '🌱' },
        { title: 'Budget Planner', path: '/plan/budget', icon: '💰' },
        { title: 'Packing List', path: '/plan/packing', icon: '🎒' }
      ]
    },
    {
      id: 'community',
      title: 'Community',
      icon: '👥',
      path: '/community',
      description: 'Connect with eco travelers',
      submenu: [
        { title: 'Stories', path: '/community/stories', icon: '📖' },
        { title: 'Forums', path: '/community/forums', icon: '💬' },
        { title: 'Events', path: '/community/events', icon: '🎉' },
        { title: 'Challenges', path: '/community/challenges', icon: '🏆' }
      ]
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: '👤',
      path: '/profile',
      description: 'Manage your account'
    }
  ];

  const providerMenuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      path: '/provider/dashboard',
      description: 'Business overview'
    },
    {
      id: 'experiences',
      title: 'Experiences',
      icon: '🌿',
      path: '/provider/experiences',
      description: 'Manage your offerings',
      submenu: [
        { title: 'All Experiences', path: '/provider/experiences/all', icon: '📝' },
        { title: 'Create New', path: '/provider/experiences/create', icon: '➕' },
        { title: 'Drafts', path: '/provider/experiences/drafts', icon: '📋' },
        { title: 'Performance', path: '/provider/experiences/performance', icon: '📈' }
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings',
      icon: '📅',
      path: '/provider/bookings',
      description: 'Manage reservations',
      submenu: [
        { title: 'Current Bookings', path: '/provider/bookings/current', icon: '🕒' },
        { title: 'Calendar View', path: '/provider/bookings/calendar', icon: '📅' },
        { title: 'Cancellations', path: '/provider/bookings/cancelled', icon: '❌' },
        { title: 'History', path: '/provider/bookings/history', icon: '📚' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: '📈',
      path: '/provider/analytics',
      description: 'Business insights',
      submenu: [
        { title: 'Revenue', path: '/provider/analytics/revenue', icon: '💰' },
        { title: 'Customers', path: '/provider/analytics/customers', icon: '👥' },
        { title: 'Sustainability', path: '/provider/analytics/sustainability', icon: '🌱' },
        { title: 'Reports', path: '/provider/analytics/reports', icon: '📊' }
      ]
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: '💬',
      path: '/provider/messages',
      description: 'Customer communication',
      submenu: [
        { title: 'Inbox', path: '/provider/messages/inbox', icon: '📥' },
        { title: 'Sent', path: '/provider/messages/sent', icon: '📤' },
        { title: 'Templates', path: '/provider/messages/templates', icon: '📝' },
        { title: 'Automated', path: '/provider/messages/automated', icon: '🤖' }
      ]
    }
  ];

  const menuItems = userType === 'provider' ? providerMenuItems : travelerMenuItems;

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (menuId) => {
    if (collapsed) return;
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">🌿</div>
          {!collapsed && (
            <div className="logo-text">
              <h1>ETCP</h1>
              <span>Eco Tourism</span>
            </div>
          )}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                onClick={() => item.submenu && toggleSubmenu(item.id)}
              >
                <div className="nav-icon">{item.icon}</div>
                {!collapsed && (
                  <>
                    <div className="nav-content">
                      <span className="nav-title">{item.title}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                    {item.submenu && (
                      <div className={`submenu-arrow ${activeSubmenu === item.id ? 'expanded' : ''}`}>
                        ↓
                      </div>
                    )}
                  </>
                )}
              </Link>
              
              {!collapsed && item.submenu && activeSubmenu === item.id && (
                <ul className="submenu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.path} className="submenu-item">
                      <Link
                        to={subItem.path}
                        className={`submenu-link ${isActiveRoute(subItem.path) ? 'active' : ''}`}
                      >
                        <span className="submenu-icon">{subItem.icon}</span>
                        <span className="submenu-title">{subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="eco-impact">
            <div className="impact-icon">🌱</div>
            <div className="impact-content">
              <h4>Your Eco Impact</h4>
              <p>12 trees planted</p>
              <p>5.2 tons CO₂ offset</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;