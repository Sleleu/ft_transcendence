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
import Cookies from 'js-cookie';
import Verify2FA from '../Login/Verify-2fa';

interface HomeProps {
	user: User;
  }
  
function Home() {


    const [user, setUser] = useState<User>({ username: '', id: -1, elo: -1, win: -1, loose: -1, createAt: '', updateAt: '', state: 'inexistant' })
    const [activeComponent, setActiveComponent] = useState<string>('play')
    const [stack, setStack] = useState<string[]>([]);
    const navigate = useNavigate()
    const existingRanks: string[] = ['bronze', 'silver', 'gold', 'crack', 'ultime']; 
    const userRank: string =  user.elo > 5000 || user.elo < 0 ? 'ultime' : existingRanks[Math.floor(user.elo / 1000)];
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

    const api = async () => {
        const data = await fetch("http://localhost:5000/users/profile", { 
			method: "GET",
			credentials: 'include'})
        const userProfile = await data.json();
        console.log('user in api', userProfile)
		return userProfile;
    }

    useEffect(() => {
        const getUser = async () => {
            const userFromServer = await api()
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
		  await fetch("http://localhost:5000/users/logout", {
			method: "GET",
			credentials: "include",
		  });
		  Cookies.remove("Authorization");
		  navigate('/');
		} catch (error) {
		  console.error("Error while disconnect :", error);
		}
	  };

const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);

const check2FAEnabled = async (userId: number) => {
    try {
        const response = await fetch(`http://localhost:5000/intra/check-2fa`);
        const result = await response.json();
        setTwoFAEnabled(result);
    } catch (error) {
        console.error(error);
    }
}

useEffect(() => {
    check2FAEnabled(user.id);
}, [user.id]);

if (twoFAEnabled && !is2FAVerified) {
    return <Verify2FA onVerify={() => set2FAVerified(true)} />;
}

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
