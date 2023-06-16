import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState} from 'react';
import Home from './components/home/Home';
import New_Login from './components/Login/New_Login';
import PrivateRoute from './PrivateRoute';

function App() {

  const [token, setToken] = useState<string>('')

  const updateToken = (token: string) => {
    setToken(token)
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={(props) => <New_Login {...props} updateToken={updateToken} />} />
          <Route path='/home'
          element={
          <PrivateRoute>
           <Home />
          </PrivateRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
