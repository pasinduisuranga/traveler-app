import React from 'react';
import AppNew from './App-New';
import ErrorBoundary from './components/ErrorBoundary';
import './App-New.css';
import './components/components-new.css';

function App() {
  return (
    <ErrorBoundary>
      <AppNew />
    </ErrorBoundary>
  );
}

export default App;