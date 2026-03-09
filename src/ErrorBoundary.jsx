import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', background: 'white', padding: '20px', margin: '20px', zIndex: 9999, position: 'relative' }}>
          <h2>React Crash!</h2>
          <pre style={{ color: 'black' }}>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
