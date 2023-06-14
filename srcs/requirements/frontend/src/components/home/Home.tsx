import React, { Component } from 'react';
import './Home.css'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import Name from './header/NameLeft/src/Name';
import { AgnosticNonIndexRouteObject } from '@remix-run/router';
import NavBar from './header/NavBar/src/NavBar';
import Play from './play/src/Play';
import Menue from './menue/src/Menue';
import History from '../popup/History/History';
import Rank from '../popup/Rank/Rank';
import Classement from '../popup/Rank/Classement';
import Settings from '../settings/Settings';
import Stats from '../popup/Stats/Stats';
import Login from '../Login/Login';
import CreateAccount from '../Login/CreateAccount';
import Chat from '../chat/Chat';
import Friend from '../friend/list/src/friend';
import { User } from '../types'
import Cookies from 'js-cookie';
import Game from './play/src/Game';
import RoomSelect from '../chat/RoomSelect';
import { io, Socket } from 'socket.io-client';
import GameChoice from './play/src/GameChoice';
import Queue from './play/src/Queue';
import GameOver from './play/src/Game-over';

function Home() {
    const [user, setUser] = useState<User>({ username: '', id: -1, elo: -1, win: -1, loose: -1, createAt: '', updateAt: '', state: 'inexistant' })
    const [activeComponent, setActiveComponent] = useState<string>('play')
    const [stack, setStack] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const navigate = useNavigate()
    const existingRanks: string[] = ['bronze', 'silver', 'gold', 'crack', 'ultime'];
    const userRank: string = user.elo > 5000 || user.elo < 0 ? 'ultime' : existingRanks[Math.floor(user.elo / 1000)];

    const push = (item: string) => {
        setStack([...stack, item])
    }
    const pop = () => {
        setStack(stack.slice(0, -1))
    };
    const front = () => {
        if (activeComponent.startsWith("game"))
            socket?.emit("player-left");
        if (stack.length === 1) {
            setActiveComponent(stack[stack.length - 1])
            return;
        }
        if (stack.length === 0) {
            setActiveComponent('play')
            return;
        }
        if (stack[stack.length - 1].startsWith("game"))
        {
            setActiveComponent(stack[stack.length - 2]);
            pop();
            pop();
        }
        else{
            setActiveComponent(stack[stack.length - 1])
            pop()
        }

    }

    const changeComponent = (component: string) => {
        if (activeComponent.startsWith("game")){
            socket?.emit("player-left");
        }
        if (activeComponent !== component && !activeComponent.startsWith("queue")) {
            push(activeComponent)
        }
        setActiveComponent(component)
    }

    const api = async () => {
        const data = await fetch("http://localhost:5000/users/profile", {
            method: "GET",
            credentials: 'include'
        })
        if (data.status === 401) {
            navigate('/')
        }
        const userProfile = await data.json();
        return userProfile;
    }

    useEffect(() => {
        console.log("PASSAGE DANS USEEFFECT", user);
        const getUser = async () => {
            const userFromServer = await api()
            setUser(userFromServer)
        }
        getUser();

        const sock = io('http://localhost:5000', { withCredentials: true });
        setSocket(sock);

        return () => {
            socket?.disconnect();
        };
    }, [])

    const extractId = (str: string) => {
        const regex = /\d+/g;
        const numbers = str.match(regex)
        if (numbers)
            return numbers[0]
        else
            return -1
    }

    const extractText = (str: string) => {
        return str[str.length - 1]
    }

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/users/logout", {
                method: "GET",
                credentials: "include",
            });
            Cookies.remove("Authorization");
            navigate('/');
            socket?.disconnect()
        } catch (error) {
            console.error("Error while disconnect :", error);
        }
    };

    return (
        <div className="baground">
            <div className='containerFullPage'>
                {/* {activeComponent === "login" && <Login changeComponent={changeComponent} />} */}

                <div className='containerRectangle'>
                    <div className='rectangleLeft' />
                    <div className='rectangleRight' />
                    <div className='rectangleTop' />
                    <div className='rectangleBottomLeft' />
                    <div className='rectangleBottomRight' />
                    {activeComponent !== "login" && <div className='containerHeader'>
                        <Name
                            user={user}
                            changeComponent={changeComponent}
                        />
                        <NavBar
                            changeComponent={changeComponent}
                            front={front}
                            handleLogout={handleLogout}
                        />
                    </div>}
                    <div className='containerCenter'>

                        {activeComponent === "play" && <Play changeComponent={changeComponent} />}
                        {activeComponent.startsWith("game") && <Game changeComponent={changeComponent} socket={socket} opponentID={extractId(activeComponent.substring(0,activeComponent.length - 1))} gameMode={activeComponent[activeComponent.length - 1]}/>}
                        {activeComponent === "GameOver" && <GameOver changeComponent={changeComponent} />}
                        {activeComponent === "menue" && <Menue changeComponent={changeComponent} />}
                        {activeComponent === "settings" && <Settings user={user} changeComponent={changeComponent} />}
                        {activeComponent === "history" && <History />}
                        {activeComponent === "stat" && <Stats user={user} changeComponent={changeComponent} />}
                        {activeComponent === "friend" && <Friend changeComponent={changeComponent} socket={socket} />}
                        {activeComponent === "chat" && <RoomSelect user={user} socket={socket} />}

                        {activeComponent === "leader" && <Classement rank={userRank} changeComponent={changeComponent} />}
                        {activeComponent === "bronzeLead" && <Classement rank={'bronze'} changeComponent={changeComponent} />}
                        {activeComponent === "silverLead" && <Classement rank={'silver'} changeComponent={changeComponent} />}
                        {activeComponent === "goldLead" && <Classement rank={'gold'} changeComponent={changeComponent} />}
                        {activeComponent === "crackLead" && <Classement rank={'crack'} changeComponent={changeComponent} />}
                        {activeComponent === "ultimeLead" && <Classement rank={'ultime'} changeComponent={changeComponent} />}
                        {activeComponent.startsWith("watch") && <div>{extractId(activeComponent)}</div>}
                        {activeComponent.startsWith("queue") && <Queue mode={extractText(activeComponent)} name={user.username} socket={socket} changeComponent={changeComponent} />}
                        {activeComponent === "rank" && <Rank user={user} changeComponent={changeComponent} />}
                        {activeComponent === "Choices" && <GameChoice changeComponent={changeComponent} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
