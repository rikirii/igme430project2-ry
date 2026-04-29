import React, { Component, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import helper, { subscribePremium } from './helper.js';
import Settings from './settings.jsx';
import Game from './game.jsx';
import Leaderboard from './leaderboard.jsx'
import PremiumScreen from './webstore.jsx';

const App = () => {
    const path = window.location.pathname;

    // premium status state, initialized from server-rendered data attribute on app div
    const [premiumStatus, setPremiumStatus] = useState(() => {
        const appDiv = document.getElementById('app');
        return appDiv && appDiv.dataset.premium === 'true';
    });

    // subscribe to changes in premium status, and update local state when it changes. This will trigger a re-render to show/hide premium features as needed
    useEffect( ()=>{
        const unsubscribe = subscribePremium(setPremiumStatus);
        return unsubscribe;
        
    }, []);


    // helper function to update premium status
    const updatePremium = (status) =>{
        setPremiumStatus(status);
        helper.setPremiumStatus(status);
    }

    let ActiveComponent = null;

    if (path.startsWith('/settings')) {
        ActiveComponent = Settings;
    }
    else if (path.startsWith('/leaderboard')) {
        ActiveComponent = Leaderboard;
    }
    else if (path.startsWith('/game')){
        ActiveComponent = Game;
    }
    else if (path.startsWith('/webstore')){
        ActiveComponent = PremiumScreen; //for now, it's this
    }
    

    if (!ActiveComponent) return null;
    

    useEffect(() => {
        // Dropdown logic
        const dropdown = document.querySelector('.dropdown');
        const triggerVis = document.querySelector('.triggerVis');

        if (!dropdown || !triggerVis) {
            return;
        }

        const handleClick = (e) =>{
            e.stopPropagation();
            dropdown.classList.toggle("open");
        };

        const handleOutClick = () =>{
            dropdown.classList.remove("open");
        };

        triggerVis.addEventListener('click', handleClick);

        document.addEventListener("click", handleOutClick);

        //must remove event listener (only real DOM) to prevent re-add upon re-render
        return ()=>{
            triggerVis.removeEventListener('click', handleClick );
            document.removeEventListener('click', handleOutClick);
        };

    }, []);
    

    return (
        <div className={`main-layout ${premiumStatus ? 'premium-active' : 'free-tier'}`}>

            <aside className={`ad-banner ${premiumStatus?'hidden' : 'visible'} ` }>
                <p>Ad Space</p>
            </aside>
            
            <section id='content-area'>
                <ActiveComponent premiumStatus={premiumStatus} />
            </section>

            <aside className={`ad-banner ${premiumStatus?'hidden' : 'visible'} ` }>
                <p>Ad Space</p>
            </aside>

        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);

};

window.onload = init;