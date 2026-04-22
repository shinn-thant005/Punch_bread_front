import { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [photoIndex, setPhotoIndex] = useState(10); 
  const [adminResponse, setAdminResponse] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false); // Controls visibility of the floating overlay

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchAdminResponse, 3000);
    return () => clearInterval(interval);
  }, []);

  // Whenever a NEW admin message arrives, show the overlay again
  useEffect(() => {
    if (adminResponse && adminResponse.responseMessage !== "No active message") {
      setShowAdmin(true);
    }
  }, [adminResponse?.responseDate, adminResponse?.responseMessage]);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/status');
      setPhotoIndex(res.data);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  const fetchAdminResponse = async () => {
    try {
      const res = await api.get('/response/current');
      setAdminResponse(res.data);
    } catch (err) {
      console.error("Error fetching admin response:", err);
    }
  };

  const handlePunch = async () => {
    try {
      await api.post('/punch');
      fetchStatus();
    } catch (err) { console.error(err); }
  };

  const handleKiss = async () => {
    try {
      await api.post('/kiss');
      fetchStatus();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-container">
      <h1>Your Punchbread</h1>
      
      <div className="character-display">
        {/* Background Character - ALWAYS VISIBLE */}
        <img 
          src={`/character/${photoIndex}.png`} 
          alt="Character Status" 
          className="main-character"
        />

        {/* Floating Admin Overlay */}
        {showAdmin && adminResponse && adminResponse.responseMessage !== "No active message" && (
          <div className="admin-floating-box">
            <button className="close-overlay" onClick={() => setShowAdmin(false)}>×</button>
            <img 
              src={`/admin/${adminResponse.responsePhotoIndex}.png`} 
              alt="Admin" 
            />
            <div className="speech-bubble">
              {adminResponse.responseMessage}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="punch-btn" onClick={handlePunch}>PUNCH</button>
        <button className="kiss-btn" onClick={handleKiss}>KISS</button>
      </div>
    </div>
  );
}

export default App;