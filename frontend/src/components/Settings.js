import React, { useState } from 'react';

const Settings = ({ onThemeChange, currentTheme }) => {
  const [userSettings, setUserSettings] = useState({
    theme: currentTheme || 'eco-theme',
    language: 'en',
    notifications: {
      bookingReminders: true,
      newExperiences: true,
      sustainabilityTips: true,
      newsletter: false
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false
    },
    privacy: {
      shareData: false,
      analytics: true,
      locationTracking: false
    }
  });

  const themes = [
    { id: 'eco-theme', name: 'Eco Green', description: 'Fresh and natural green theme' },
    { id: 'forest-theme', name: 'Forest', description: 'Deep forest inspired colors' },
    { id: 'ocean-theme', name: 'Ocean', description: 'Calming ocean blue theme' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'Sinhala' },
    { code: 'ta', name: 'Tamil' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ];

  const handleThemeChange = (themeId) => {
    setUserSettings({ ...userSettings, theme: themeId });
    onThemeChange(themeId);
  };

  const handleNotificationChange = (setting) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        [setting]: !userSettings.notifications[setting]
      }
    });
  };

  const handleAccessibilityChange = (setting) => {
    setUserSettings({
      ...userSettings,
      accessibility: {
        ...userSettings.accessibility,
        [setting]: !userSettings.accessibility[setting]
      }
    });
  };

  const handlePrivacyChange = (setting) => {
    setUserSettings({
      ...userSettings,
      privacy: {
        ...userSettings.privacy,
        [setting]: !userSettings.privacy[setting]
      }
    });
  };

  const handleLanguageChange = (languageCode) => {
    setUserSettings({ ...userSettings, language: languageCode });
  };

  const saveSettings = () => {
    // Here you would typically save to backend
    localStorage.setItem('etcp-settings', JSON.stringify(userSettings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="page-container">
      <h2 className="page-title">⚙️ Settings & Personalization</h2>
      <p className="page-subtitle">Customize your ETCP experience</p>

      <div className="settings-sections">
        {/* Theme Settings */}
        <div className="settings-section card">
          <h3>🎨 Visual Theme</h3>
          <p>Choose a theme inspired by different ecosystems</p>
          <div className="theme-grid">
            {themes.map(theme => (
              <div 
                key={theme.id} 
                className={`theme-option ${userSettings.theme === theme.id ? 'selected' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className={`theme-preview ${theme.id}`}>
                  <div className="theme-colors">
                    <div className="color-primary"></div>
                    <div className="color-secondary"></div>
                    <div className="color-accent"></div>
                  </div>
                </div>
                <div className="theme-info">
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Settings */}
        <div className="settings-section card">
          <h3>🌍 Language & Region</h3>
          <div className="setting-group">
            <label>Preferred Language:</label>
            <select
              value={userSettings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="setting-select"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section card">
          <h3>🔔 Notifications</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Booking Reminders</h4>
                <p>Get notified about upcoming experiences</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.bookingReminders}
                  onChange={() => handleNotificationChange('bookingReminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>New Experiences</h4>
                <p>Discover new sustainable experiences in your areas of interest</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.newExperiences}
                  onChange={() => handleNotificationChange('newExperiences')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Sustainability Tips</h4>
                <p>Receive tips for more eco-friendly travel</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.sustainabilityTips}
                  onChange={() => handleNotificationChange('sustainabilityTips')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Newsletter</h4>
                <p>Monthly updates and eco-tourism insights</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.newsletter}
                  onChange={() => handleNotificationChange('newsletter')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="settings-section card">
          <h3>♿ Accessibility</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>High Contrast</h4>
                <p>Increase contrast for better visibility</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.accessibility.highContrast}
                  onChange={() => handleAccessibilityChange('highContrast')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Large Text</h4>
                <p>Increase text size for easier reading</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.accessibility.largeText}
                  onChange={() => handleAccessibilityChange('largeText')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Reduce Motion</h4>
                <p>Minimize animations and transitions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.accessibility.reduceMotion}
                  onChange={() => handleAccessibilityChange('reduceMotion')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section card">
          <h3>🔒 Privacy & Data</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Share Data for Research</h4>
                <p>Help improve sustainable tourism through anonymized data</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.shareData}
                  onChange={() => handlePrivacyChange('shareData')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Analytics</h4>
                <p>Help us improve the platform with usage analytics</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.analytics}
                  onChange={() => handlePrivacyChange('analytics')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h4>Location Tracking</h4>
                <p>Allow location-based experience recommendations</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.locationTracking}
                  onChange={() => handlePrivacyChange('locationTracking')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Payment & Subscription */}
        <div className="settings-section card">
          <h3>💳 Payment & Subscriptions</h3>
          <div className="payment-info">
            <div className="subscription-status">
              <h4>Current Plan: Free Explorer</h4>
              <p>Upgrade to Eco-Pass for unlimited access to premium experiences</p>
              <button className="button">Upgrade to Eco-Pass</button>
            </div>
            <div className="payment-methods">
              <h4>Payment Methods</h4>
              <p>No payment methods added</p>
              <button className="button secondary">Add Payment Method</button>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="settings-actions">
          <button className="button" onClick={saveSettings}>
            Save Settings
          </button>
          <button className="button secondary">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;