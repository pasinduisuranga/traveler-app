import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chrome Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
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
          <h1 style={{ color: '#e74c3c' }}>❌ Chrome Error Detected</h1>
          
          <div style={{ background: '#ffeaea', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Error Details:</h2>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <details style={{ marginTop: '10px' }}>
              <summary>Stack Trace</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>

          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Chrome Troubleshooting Steps:</h2>
            <ol>
              <li>Clear Chrome cache and cookies for localhost:3000</li>
              <li>Disable Chrome extensions temporarily</li>
              <li>Try Chrome incognito mode</li>
              <li>Check Chrome developer tools console for errors</li>
              <li>Try a different browser (Firefox, Edge) to compare</li>
            </ol>
          </div>

          <button 
            onClick={() => window.location.href = 'http://localhost:3000'} 
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
            🔄 Try Again
          </button>

          <button 
            onClick={() => window.location.href = 'http://localhost:3000?debug=true'} 
            style={{
              background: '#3498db',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🔍 Debug Mode
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;