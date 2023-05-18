import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/Login/Login';

function App() {
  const [user, setUser] = useState(null);

  const updateToken = async () => {
    const user = await getUser();
    setUser(user);
  }

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/profile", { 
        method: "GET",
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login updateToken={updateToken} />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;