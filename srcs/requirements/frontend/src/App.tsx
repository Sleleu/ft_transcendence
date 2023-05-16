import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/home/Home';
import CreateAccount from './components/Login/CreateAccount';
import Login from './components/Login/Login';
import Chat from './components/chat/Chat';

function App() {

  const [token, setToken] = useState<string>('')

  const updateToken = (token: string) => {
    setToken(token)
  }

  return (
    <Router>
      <div>
        <Routes>
        {/* <Route path="/" Component={(props) => <Chat {...props}/>} /> */}
        <Route path="/" Component={(props) => <Login {...props} updateToken={updateToken} />} />
          <Route path="/home" Component={() => <Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
