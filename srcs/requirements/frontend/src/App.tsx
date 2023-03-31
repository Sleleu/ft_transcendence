import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';
import Settings from './components/settings/Settings'

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
      <Routes>
        <Route path="/settings" Component={Settings} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
