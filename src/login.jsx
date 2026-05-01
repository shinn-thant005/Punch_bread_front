import React, { useState } from 'react';
import './Login.css';
import api from './api'; // Import your axios instance

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Add error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Create Basic Auth string
    const credentials = btoa(`${username}:${password}`);
    
    try {
      // Send a test request to an endpoint to verify credentials
      // (Assuming /api/v1/status is a simple GET endpoint they have access to)
      const response = await api.get('/status', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.status === 200) {
        // If successful, save the token
        localStorage.setItem('auth_token', credentials);
        localStorage.setItem('user_role', username === 'admin' ? 'ADMIN' : 'USER');

        // Notify App.js that we are logged in
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Welcome Back 🍞</h2>
        {error && <p style={{color: 'red'}}>{error}</p>} {/* Show error msg */}
        <form onSubmit={handleSubmit}>
          {/* ... Keep your existing inputs here ... */}
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;