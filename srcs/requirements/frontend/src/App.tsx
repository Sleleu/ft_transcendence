import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/home/Home';
import CreateAccount from './components/Login/CreateAccount';
import Login from './components/Login/Login';
import Chat from './components/chat/Chat';

function App() {

  const [token, setToken] = useState<string>('')
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);

  const login = () => {
	setisLoggedIn(true);
	};
  const logout = () => {
	setisLoggedIn(false);
	};

  const updateToken = (token: string) => {
    setToken(token)
  }

  const verifySession = async () => {
	const response = await fetch('http://localhost:5000/intra/verify-session', {
	  method: "GET",
	  credentials: 'include',
	});
  
	if (response.ok) {
	  console.log("c'est true !")
	  setisLoggedIn(true);
	  console.log("isLoggedIn state after set: ", isLoggedIn);
	}
  }
  
  useEffect(() => {
	verifySession();
  }, []);
  

  useEffect(() => {
	console.log("Current isLoggedIn state: ", isLoggedIn);
  }, [isLoggedIn]);
  

  return (
    <Router>
      <div>
        <Routes>
        {/* <Route path="/" Component={(props) => <Chat {...props}/>} /> */}
        {/* <Route path="/" Component={(props) => <Login {...props} updateToken={updateToken} />} />
          <Route path="/home" Component={() => <Home/>} /> */}
  		  <Route path="/" element={<Login updateToken={updateToken} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
