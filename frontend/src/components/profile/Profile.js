import React from 'react';

const Profile = ({ onThemeChange }) => {
  return (
    <div className="profile fade-in">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="card-modern">
          <h2>Profile Settings</h2>
          <p>Profile management features coming soon!</p>
          <p>This will include theme settings, account preferences, and more.</p>
          
          <button 
            className="btn btn-primary"
            onClick={() => onThemeChange && onThemeChange('dark-eco')}
          >
            Switch to Dark Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;