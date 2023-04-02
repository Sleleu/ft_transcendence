import React from 'react';
import './Home.css'
import { useState, useEffect } from 'react';
import Name from './Name';
import { AgnosticNonIndexRouteObject } from '@remix-run/router';

function Home() {

    type User = {
        name: string;
        rank: string;
        id : number;
        elo: number;
    }

    const [user, setUser] = useState<User[]>([])

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
                    </div>
                    <div className='containerCenter'>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
