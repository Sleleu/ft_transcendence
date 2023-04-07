import React from 'react';
import './Home.css'
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
import {User} from '../types'

function Home() {

    const [user, setUser] = useState<User[]>([])
    const [activeComponent, setActiveComponent] = useState<string>('play')
    const [stack, setStack] = useState<string[]>([]);

    const push = (item:string) => {
        setStack([...stack, item]) 
    }
    const pop = () => {
        setStack(stack.slice(0, -1))
    };
    const front = () => {
        if (stack.length === 1)
        {
            setActiveComponent(stack[stack.length -1])
            return ;
        }
        if (stack.length === 0)
        {
            setActiveComponent('play')
            return ;
        }
        setActiveComponent(stack[stack.length -1])
        pop()
    }

    const changeComponent = (component:string) => {
        if (activeComponent !== component)
            push(activeComponent)
        setActiveComponent(component)
    }

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
                            />
                        )} 
                        <NavBar 
                            changeComponent={changeComponent}
                            front={front}
                        />
                    </div>
                    <div className='containerCenter'>
                        {activeComponent === "play" && <Play changeComponent={changeComponent}/>}
                        {activeComponent === "menue" && <Menue changeComponent={changeComponent}/>}
                        {activeComponent === "settings" && <Settings changeComponent={changeComponent} user={user[0]} />}
                        {activeComponent === "history" && <History />}
                        {activeComponent === "leader" && <Classement rank='gold'/>}
                        {activeComponent === "rank" && <Rank user={{name:'gottie', rank:'gold', id:1, elo:2561}}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
