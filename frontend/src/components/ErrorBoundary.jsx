// src/components/ErrorBoundary.jsx

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("ErrorBoundary getDerivedStateFromError:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error: error });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-10 text-center bg-red-100 text-red-700">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <p className="mt-2">There was an error rendering this part of the page. Please check the console for details.</p>
          <pre className="mt-4 text-left bg-white p-4 rounded text-sm">
            {this.state.error && this.state.error.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;