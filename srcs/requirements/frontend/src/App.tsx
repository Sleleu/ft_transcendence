import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Test from './pages/Test';

function App() {
  return (
    <Router>
    <div>
    <Routes>
      <Route path="/" Component={Home} />
        <Route path="/test" Component={Test} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
