import React from 'react';
import './Home.css'
import { useState, useEffect } from 'react';
import Name from './header/NameLeft/src/Name';
import { AgnosticNonIndexRouteObject } from '@remix-run/router';
import NavBar from './header/NavBar/src/NavBar';
import Settings from '../settings/Settings'

function Home() {

    type User = {
        name: string;
        rank: string;
        id : number;
        elo: number;
    }

    const [user, setUser] = useState<User[]>([])
    const [activeComponent, setActiveComponent] = useState<string>('settings')
    const [oldComponent, setOldComponent] = useState<string>('play')

    const api = async () => {
        const data = await fetch("http://localhost:5000/user" ,{ method:"GET" })
        const jsonData = await data.json();
        return jsonData;
    }

    useEffect(() => {
        const getUser = async () => {
            const userFromServer = await api()
            setUser(userFromServer)
        }
    getUser()
    }, [])

    const changeComponent = (component:string) => {
        setOldComponent(activeComponent)
        setActiveComponent(component)
    }

    return (
        <div className="baground">
            <div className='containerFullPage'>
                <div className='containerRectangle' >
                    <div className='rectangleLeft' />
                    <div className='rectangleRight' />
                    <div className='rectangleTop' />
                    <div className='rectangleBottomLeft' />
                    <div className='rectangleBottomRight' />
                    <div className='containerHeader'>
                        {user.map((user) => 
                        <Name 
                        name={user.name} 
                        elo={user.elo}
                        rank={user.rank}
                        />)} 
                        <NavBar 
                        changeComponent={changeComponent}
                        oldComponent={oldComponent}
                        />
                    </div>
                    <div className='containerCenter'>
                        {activeComponent === "settings" && <Settings />}
                        {/* {activeComponent === "menue" && <Menue />} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
