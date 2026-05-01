import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Admin from './Admin';
import Login from './login';

function RootRoutes() {
  // Check if we have a token in local storage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('auth_token')
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* If not logged in, show Login page for the root path */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <App /> : <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />

        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? <Admin /> : <Navigate to="/" />
          } 
        />

        {/* Fallback for any other URL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RootRoutes;
