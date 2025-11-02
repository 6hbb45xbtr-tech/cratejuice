import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API status
    axios.get('/api/tracks')
      .then(response => {
        setTracks(response.data.tracks || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tracks:', error);
        setLoading(false);
      });

    // Fetch API health
    axios.get('/health')
      .then(response => {
        setApiStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error checking API health:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 CrateJuice</h1>
        <p>Your Music Streaming Platform</p>
        
        <div className="status-section">
          <h2>API Status</h2>
          <div className={`status ${apiStatus === 'healthy' ? 'healthy' : 'offline'}`}>
            {apiStatus ? `Status: ${apiStatus}` : 'Checking...'}
          </div>
        </div>

        <div className="tracks-section">
          <h2>Tracks</h2>
          {loading ? (
            <p>Loading tracks...</p>
          ) : tracks.length > 0 ? (
            <ul>
              {tracks.map((track, index) => (
                <li key={index}>{track.name}</li>
              ))}
            </ul>
          ) : (
            <p>No tracks available yet. Add some tracks to get started!</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
