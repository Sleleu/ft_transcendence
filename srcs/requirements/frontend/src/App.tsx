import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
