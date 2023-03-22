import React from 'react';
import logo from '../logo.svg';
import '../App.css';

function Home() {
    return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Ft_transcendence
        </p>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
            Learn React
        </a>
        <div>
        <button >
            Test
        </button>
        </div>
        </header>
    </div>
    );
}

export default Home;