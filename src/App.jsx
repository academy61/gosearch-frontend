import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SearchResults from './SearchResults';
import Settings from './Settings';
import Login from './Login'; // Import Login component
import Register from './Register'; // Import Register component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} /> {/* New route for login */}
        <Route path="/register" element={<Register />} /> {/* New route for register */}
      </Routes>
    </Router>
  );
}

export default App;
