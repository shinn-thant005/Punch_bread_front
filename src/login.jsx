import React, { useState } from 'react';
import './Login.css';
import api from './api'; // Import your axios instance!

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Create Basic Auth string
    const credentials = btoa(`${username}:${password}`);
    
    try {
      // 1. Actually ask the backend if these credentials are valid.
      // We are hitting the '/login' endpoint (or any permitted endpoint)
      // just to see if the server accepts our Basic Auth header.
      const response = await api.get('/status', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      // 2. If the backend responds with a 200 OK, THEN we log the user in.
      if (response.status === 200) {
        localStorage.setItem('auth_token', credentials);
        localStorage.setItem('user_role', username === 'admin' ? 'ADMIN' : 'USER');
        onLoginSuccess();
      }
    } catch (err) {
      // 3. If the backend rejects us (401), we catch the error and show a message
      // instead of freezing the app!
      console.error("Login failed:", err);
      setError("Invalid username or password. Is the backend running?");
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Welcome Back 🍞</h2>
        
        {/* Display the error if it exists */}
        {error && <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;