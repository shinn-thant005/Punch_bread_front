import { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  // State for the character's injury/love stage (0-20)
  const [photoIndex, setPhotoIndex] = useState(10); 
  // State for the instant message/photo sent by the admin
  const [adminResponse, setAdminResponse] = useState(null);

  // UseEffect runs once when the app loads
  useEffect(() => {
    // 1. Get the initial character status
    fetchStatus();

    // 2. Start polling for Admin Responses every 3 seconds
    const interval = setInterval(fetchAdminResponse, 3000);

    // Clean up the interval if the component is destroyed
    return () => clearInterval(interval);
  }, []);

  // Hits the AppStatus endpoint to see the current character stage
  const fetchStatus = async () => {
    try {
      const res = await api.get('/status');
      setPhotoIndex(res.data);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  // Hits the AdminResponse endpoint to check for instant replies
  const fetchAdminResponse = async () => {
    try {
      const res = await api.get('/response/current');
      setAdminResponse(res.data);
    } catch (err) {
      console.error("Error fetching admin response:", err);
    }
  };

  // Sends a PUNCH and updates the character stage (+1)
  const handlePunch = async () => {
    try {
      await api.post('/punch');
      fetchStatus(); // Refresh the image immediately after the action
    } catch (err) {
      console.error("Error sending punch:", err);
    }
  };

  // Sends a KISS and updates the character stage (-1)
  const handleKiss = async () => {
    try {
      await api.post('/kiss');
      fetchStatus(); // Refresh the image immediately after the action
    } catch (err) {
      console.error("Error sending kiss:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>Your Punchbread</h1>
      
      <div className="character-display">
        {/* LOGIC: Only show the Admin Response if:
            1. An object exists
            2. The message is NOT the default "No active message"
            3. The message is NOT just empty spaces
        */}
        {adminResponse && 
         adminResponse.responseMessage && 
         adminResponse.responseMessage !== "No active message" && 
         adminResponse.responseMessage.trim() !== "" ? (
          
          <div className="admin-overlay">
            {/* Loads from public/admin/{index}.png */}
            <img 
              src={`/admin/${adminResponse.responsePhotoIndex}.png`} 
              alt="Admin Response" 
            />
            <div className="speech-bubble">
              {adminResponse.responseMessage}
            </div>
          </div>
          
        ) : (
          
          /* DEFAULT: Shows the character stage from public/character/{index}.png */
          <img 
            src={`/character/${photoIndex}.png`} 
            alt="Character Status" 
          />
          
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