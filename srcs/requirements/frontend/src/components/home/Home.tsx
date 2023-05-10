import React from 'react';
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
import { User } from '../types'
import Friend from '../friend/list/src/friend';
import Cookies from 'js-cookie';

function Home(props: { token: string }) {

    const [user, setUser] = useState<User>({ username: 'error', id: -1, elo: -1 })
    const [activeComponent, setActiveComponent] = useState<string>('play')
    const [stack, setStack] = useState<string[]>([]);
    const { token } = props
    const navigate = useNavigate()

    // const aled: User[] = [{ name: 'gottie', rank: 'gold', id: 1, elo: 100 }]
    // setUser(aled)

    const push = (item: string) => {
        setStack([...stack, item])
    }
    const pop = () => {
        setStack(stack.slice(0, -1))
    };
    const front = () => {
        if (stack.length === 1) {
            setActiveComponent(stack[stack.length - 1])
            return;
        }
        if (stack.length === 0) {
            setActiveComponent('play')
            return;
        }
        setActiveComponent(stack[stack.length - 1])
        pop()
    }

    const changeComponent = (component: string) => {
        if (activeComponent !== component)
            push(activeComponent)
        setActiveComponent(component)
    }



    const api = async () => {
		const access_token = Cookies.get('Authorization')
		console.log("test access token ici : ", Cookies.get('Authorization'))
        const bear = 'Bearer ' + access_token
        console.log('bear', access_token)
        const data = await fetch("http://localhost:5000/users/profile", { 
			method: "GET",
			headers: { 'Authorization': bear } })
        if (data.status === 401) {
            navigate('/')
        }
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
                        />
                    </div>}
                    <div className='containerCenter'>

                        {activeComponent === "play" && <Play changeComponent={changeComponent} />}
                        {activeComponent === "menue" && <Menue changeComponent={changeComponent} />}
                        {activeComponent === "settings" && <Settings user={user} changeComponent={changeComponent} />}
                        {activeComponent === "historic" && <History />}
                        {activeComponent === "stat" && <Stats user={user} changeComponent={changeComponent} />}
                        {activeComponent === "friend" && <Friend changeComponent={changeComponent} />}

                        {activeComponent === "leader" && <Classement rank={'gold'} changeComponent={changeComponent} />}
                        {activeComponent === "bronzeLead" && <Classement rank={'bronze'} changeComponent={changeComponent} />}
                        {activeComponent === "silverLead" && <Classement rank={'silver'} changeComponent={changeComponent} />}
                        {activeComponent === "goldLead" && <Classement rank={'gold'} changeComponent={changeComponent} />}
                        {activeComponent === "crackLead" && <Classement rank={'crack'} changeComponent={changeComponent} />}
                        {activeComponent === "ultimeLead" && <Classement rank={'ultime'} changeComponent={changeComponent} />}

                        {/* {activeComponent === "rank" && <Rank user={{ name: 'gottie', rank: 'gold', id: 1, elo: 2561 }} changeComponent={changeComponent} />} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
