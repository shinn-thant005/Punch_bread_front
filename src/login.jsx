import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create Basic Auth string
    const credentials = btoa(`${username}:${password}`);
    
    // Store in localStorage so api.js can find it
    localStorage.setItem('auth_token', credentials);
    localStorage.setItem('user_role', username === 'admin' ? 'ADMIN' : 'USER');

    // Notify App.js that we are logged in
    onLoginSuccess();
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Welcome Back 🍞</h2>
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