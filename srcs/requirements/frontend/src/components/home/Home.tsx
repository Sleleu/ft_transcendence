import React, { Component } from 'react';
import './Home.css'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import Name from './header/NameLeft/src/Name';
import NavBar from './header/NavBar/src/NavBar';
import Play from './play/src/Play';
import Menue from './menue/src/Menue';
import History from '../popup/History/History';
import Rank from '../popup/Rank/Rank';
import Classement from '../popup/Rank/Classement';
import Settings from '../settings/Settings';
import Stats from '../popup/Stats/Stats';
import { User } from '../types'
import Friend from '../friend/list/src/friend';
import Verify2FA from '../Login/Verify-2fa';
import { check2FA, check2FAVerified, disableTwoFAVerified, getUserProfile, logout } from '../Api';
import SelectLogin from '../Login/SelectLogin';

function Home() {

    const [user, setUser] = useState<User>({ username: '', id: -1, elo: -1, win: -1, loose: -1, createAt: '', updateAt: '', state: 'inexistant' })
    const [activeComponent, setActiveComponent] = useState<string>('play')
    const [stack, setStack] = useState<string[]>([]);
    const navigate = useNavigate()
    const existingRanks: string[] = ['bronze', 'silver', 'gold', 'crack', 'ultime']; 
    const userRank: string =  user.elo > 5000 || user.elo < 0 ? 'ultime' : existingRanks[Math.floor(user.elo / 1000)];
    const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);
    const [is2FAVerified, set2FAVerified] = useState(false);

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

    useEffect(() => {
        const getUser = async () => {
            const userFromServer = await getUserProfile();
            setUser(userFromServer)
        }
        getUser()
    }, [])

    const extractId = (str: string) => {
        const regex = /\d+/g;
        const numbers = str.match(regex)
        if (numbers)
            return numbers[0]
        else
            return -1
    }

	const handleLogout = async () => {
		try {
          await disableTwoFAVerified();
		  await logout();
		  navigate('/');
		} catch (error) {
		  console.error("Error while disconnect :", error);
		}
	  };

const handle2FASuccess = () => {
    set2FAVerified(true);
}


const check2FAEnabled = async () => {
    try {
        const result = await check2FA();
        setTwoFAEnabled(result);
    } catch (error) {
        console.error(error);
    }
}

useEffect(() => {
    check2FAEnabled();
}, []);

const TwoFAVerified = async () => {
    try {
        const result = await check2FAVerified();
        set2FAVerified(result);
    } catch (error) {
        console.error(error);
    }
}

useEffect(() => {
    TwoFAVerified();
}, []);

console.log("test", user?.avatar);

	if (twoFAEnabled && !is2FAVerified) {
		return <Verify2FA onVerifySuccess={handle2FASuccess} />;
	}
	if (user.gameLogin === null)
	{
		return <SelectLogin user={user} />;
	}


    return (
        <div className="baground">
            <div className='containerFullPage'>
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
							user={user}
                            changeComponent={changeComponent}
                            front={front}
							handleLogout={handleLogout}
                        />
                    </div>}
                    <div className='containerCenter'>

                        {activeComponent === "play" && <Play changeComponent={changeComponent} />}
                        {activeComponent === "menue" && <Menue changeComponent={changeComponent} />}
                        {activeComponent === "settings" && <Settings user={user} changeComponent={changeComponent} />}
                        {activeComponent === "historic" && <History />}
                        {activeComponent === "stat" && <Stats user={user} changeComponent={changeComponent} />}
                        {activeComponent === "friend" && <Friend changeComponent={changeComponent} />}

                        {activeComponent === "leader" && <Classement rank={userRank} changeComponent={changeComponent} />}
                        {activeComponent === "bronzeLead" && <Classement rank={'bronze'} changeComponent={changeComponent} />}
                        {activeComponent === "silverLead" && <Classement rank={'silver'} changeComponent={changeComponent} />}
                        {activeComponent === "goldLead" && <Classement rank={'gold'} changeComponent={changeComponent} />}
                        {activeComponent === "crackLead" && <Classement rank={'crack'} changeComponent={changeComponent} />}
                        {activeComponent === "ultimeLead" && <Classement rank={'ultime'} changeComponent={changeComponent} />}
                        {activeComponent.startsWith("watch") && <div>{extractId(activeComponent)}</div>}

                        {activeComponent === "rank" && <Rank user={user} changeComponent={changeComponent} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
