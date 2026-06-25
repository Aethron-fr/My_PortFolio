import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#06060a',
          color: '#fff',
          fontFamily: 'sans-serif',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#E1306C', marginBottom: '1rem' }}>Signal Lost.</h1>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '30px',
              lineHeight: 1.6
            }}>
              The application encountered a critical exception:<br/><br/>
              <strong style={{ color: '#ff003c' }}>{this.state.error && this.state.error.toString()}</strong>
            </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '10px 24px',
              backgroundColor: '#E1306C',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
