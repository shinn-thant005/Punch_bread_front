import { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [photoIndex, setPhotoIndex] = useState(10); 
  const [adminResponse, setAdminResponse] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [randomMessage, setRandomMessage] = useState(""); 
  const [showMoodMenu, setShowMoodMenu] = useState(false);
  // New state for the text input
  const [reason, setReason] = useState(""); 

  const moods = ["HAPPY", "SAD", "BORED", "ENERGETIC", "ANXIOUS", "CALM"];

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchAdminResponse, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (adminResponse && adminResponse.responseMessage !== "No active message") {
      setShowAdmin(true);
    }
  }, [adminResponse?.responseDate, adminResponse?.responseMessage]);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/status');
      setPhotoIndex(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAdminResponse = async () => {
    try {
      const res = await api.get('/response/current');
      setAdminResponse(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRandomMessage = async () => {
    try {
      const res = await api.get('/get-random-message');
      if (res.data && res.data.message) {
        setRandomMessage(res.data.message);
      }
    } catch (err) { console.error(err); }
  };

  // Modified to send reasonMessage to the backend
  const handleMoodSelect = async (selectedMood) => {
    try {
      await api.post('/add-mood', { 
        mood: selectedMood,
        reasonMessage: reason // Matches variable in Mood.java
      }); 
      setShowMoodMenu(false);
      setReason(""); // Clear input after sending
      alert(`Mood recorded!`);
    } catch (err) {
      console.error("Error recording mood:", err);
    }
  };

  const handlePunch = async () => {
    try {
      await api.post('/punch');
      fetchStatus();
      fetchRandomMessage();
    } catch (err) { console.error(err); }
  };

  const handleKiss = async () => {
    try {
      await api.post('/kiss');
      fetchStatus();
      fetchRandomMessage();
    } catch (err) { console.error(err); }
  };

  // ... inside App component ...

  const handleMadClick = async () => {
    try {
      await api.post('/add-mood', { 
        mood: "MAD",
        reasonMessage: "Su Su is being mad at you" 
      }); 
      alert(`Message sent: I'm mad!`);
    } catch (err) {
      console.error("Error recording MAD mood:", err);
    }
  };

  const handleMissingClick = async () => {
    try {
      await api.post('/add-mood', { 
        mood: "MISSING",
        reasonMessage: "Su Su is missing you" 
      }); 
      alert(`Message sent: I miss you!`);
    } catch (err) {
      console.error("Error recording MISSING mood:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="mood-selector-container">
        <button className="mood-icon-btn" onClick={() => setShowMoodMenu(!showMoodMenu)}>
          😊
        </button>
        
        {showMoodMenu && (
          <div className="mood-dropdown">
            {/* Added Text Input for reasonMessage */}
            <input 
              type="text" 
              placeholder="Why? (Optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mood-input"
            />
            <div className="mood-options">
              {moods.map((m) => (
                <button key={m} onClick={() => handleMoodSelect(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <h1>Your Punchbread</h1>
      
      <div className="character-stage">
        {randomMessage && !showAdmin && (
          <div className="random-message-cloud">{randomMessage}</div>
        )}

        {showAdmin && adminResponse && adminResponse.responseMessage !== "No active message" && (
          <div className="admin-floating-box">
            <button className="close-overlay" onClick={() => setShowAdmin(false)}>×</button>
            <img src={`/admin/${adminResponse.responsePhotoIndex}.png`} alt="Admin" />
            <div className="speech-bubble">{adminResponse.responseMessage}</div>
          </div>
        )}

        <div className="main-character-wrapper">
          <img src={`/character/${photoIndex}.png`} alt="Character Status" className="main-character" />
        </div>
      </div>

      <div className="actions">
        <button className="punch-btn" onClick={handlePunch}>PUNCH</button>
        <button className="kiss-btn" onClick={handleKiss}>KISS</button>
        
        {/* New MAD and MISSING buttons */}
        <button className="mad-btn" onClick={handleMadClick}>MAD 😤</button>
        <button className="missing-btn" onClick={handleMissingClick}>MISSING 🥺</button>
      </div>
    </div>
  );
}

export default App;
