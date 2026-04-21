import React, { Component, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import Maker from './maker.jsx';
import Settings from './settings.jsx';

const App = () => {
    const path = window.location.pathname;


    let Component = null;

    if (path.startsWith('/settings')) {
        Component = Settings;
    }
    else if (path.startsWith('/maker')) {
        Component = Maker;
    }
    else{
        return;
    }
    

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
    return <Component />
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);

};

window.onload = init;