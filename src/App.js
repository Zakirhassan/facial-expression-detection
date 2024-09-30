import React from 'react';
import WebcamFeed from './components/WebcamFeed';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <h1>Real-Time Facial Expression Detection</h1>
      <WebcamFeed />
    </div>
  );
}

export default App;
