import { Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './Admin';

function RootRoutes() {
  return (
    <Routes>
      {/* The main game site */}
      <Route path="/" element={<App />} />
      
      {/* Your admin control site */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default RootRoutes;