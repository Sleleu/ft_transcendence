import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/home/Home';
import CreateAccount from './components/Login/CreateAccount';
import Login from './components/Login/Login';
import Chat from './components/chat/Chat';

interface ProtectedRouteProps {
	path: string,
	isLoggedIn: boolean,
	element: React.ReactElement
  }

function App() {

  const [token, setToken] = useState<string>('')
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);

  const login = () => {
	setisLoggedIn(true);
	};
  const logout = () => {
	setisLoggedIn(false);
	};

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, isLoggedIn, element }) => {
	return isLoggedIn ? <Route path={path} element={element} /> : <Navigate to="/" replace />;
  };

  const updateToken = (token: string) => {
    setToken(token)
  }

  return (
    <Router>
      <div>
        <Routes>
        {/* <Route path="/" Component={(props) => <Chat {...props}/>} /> */}
        {/* <Route path="/" Component={(props) => <Login {...props} updateToken={updateToken} />} />
          <Route path="/home" Component={() => <Home/>} /> */}
  		  <Route path="/" element={<Login updateToken={updateToken} login={login} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
