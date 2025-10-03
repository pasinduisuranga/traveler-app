import React, { useEffect, useState } from 'react';

function ChromeDebug() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      chrome: /Chrome/.test(navigator.userAgent),
      version: navigator.appVersion,
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      css: {
        backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
        webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        gridSupport: CSS.supports('display', 'grid'),
        flexSupport: CSS.supports('display', 'flex')
      }
    };
    setDebugInfo(info);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'white',
      zIndex: 10000,
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto'
    }}>
      <h1 style={{ color: '#27ae60' }}>🌿 Chrome Debug Info</h1>
      
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Browser Detection</h2>
        <p><strong>Is Chrome:</strong> {debugInfo.chrome ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User Agent:</strong> {debugInfo.userAgent}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Screen Info</h2>
        <p><strong>Screen Size:</strong> {debugInfo.screen?.width} x {debugInfo.screen?.height}</p>
        <p><strong>Window Size:</strong> {debugInfo.window?.width} x {debugInfo.window?.height}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>CSS Support</h2>
        <p><strong>Backdrop Filter:</strong> {debugInfo.css?.backdropFilter ? '✅ Supported' : '❌ Not Supported'}</p>
        <p><strong>Webkit Backdrop Filter:</strong> {debugInfo.css?.webkitBackdropFilter ? '✅ Supported' : '❌ Not Supported'}</p>
        <p><strong>CSS Grid:</strong> {debugInfo.css?.gridSupport ? '✅ Supported' : '❌ Not Supported'}</p>
        <p><strong>CSS Flexbox:</strong> {debugInfo.css?.flexSupport ? '✅ Supported' : '❌ Not Supported'}</p>
      </div>

      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>React App Status</h2>
        <p>✅ React is loading and rendering correctly</p>
        <p>✅ JavaScript is enabled</p>
        <p>✅ CSS styles are being applied</p>
      </div>

      <button 
        onClick={() => window.location.reload()} 
        style={{
          background: '#27ae60',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        🔄 Reload App
      </button>

      <button 
        onClick={() => localStorage.clear()} 
        style={{
          background: '#e74c3c',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        🗑️ Clear Local Storage
      </button>
    </div>
  );
}

export default ChromeDebug;