// handle the application that shows up once the user has logged in

import { create } from 'underscore';

const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

/*
    Update weapList once a new weap has been added
*/
const handleWeapon = (e, onWeapAdded) =>{
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#weaponName').value;
    const attackStat = e.target.querySelector('#weaponAttack').value;
    const rarity = e.target.querySelector('#weaponRarity').value;

    if (!name || !attackStat || !rarity) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, attackStat, rarity}, onWeapAdded);
    return false;
}


const WeaponForm = (props) =>{
    return ( 
        <form id="smithingForm"
            onSubmit={(e) => handleWeapon(e, props.triggerReload)} //triggerReload helps know when to reload the weapons from the server
            name="smithingForm"
            action="/maker"
            method="POST"
            className="smithingForm"
        >
            <label htmlFor="weaponName">Name: </label>
            <input id="weaponName" type="text" name="name" placeholder="Weapon Name" />
            <label htmlFor="weaponAttack">Attack: </label>
            <input id="weaponAttack" type="number" min="0" name="attack" />
            <label htmlFor="weaponRarity">Rarity: </label>
            <select id="weaponRarity" name="rarity" >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Peak">Peak</option>
                <option value="Intent">Intent</option>
                <option value="Transcendent">Transcendent</option>
            </select>
            <input className="smithWeapSubmit" type="submit" value="Smithing Weapon" />
        </form>

    );
};

/*
    Update weapList once a new weapon has been added
*/
const handleDelete = (weapon, onWeaponDeleted) =>{
    helper.hideError();

    if (!confirm("Are you sure you want to destroy this weapon?")) return;

    helper.sendPost('/deleteWeapon', weapon, onWeaponDeleted);
    return false;
}


const WeaponList = (props) =>{
    const [weapons,setWeapons] = useState(props.weapons);

    useEffect(()=>{
        const loadWeaponsFormServer = async ()=>{
            const response = await fetch('/getWeapons');
            const data = await response.json();
            setWeapons(data.weapons);
        };
        loadWeaponsFormServer();
    },[props.reloadWeapons]);


    if (weapons.length === 0){
        return (
            <div className="weaponList">
                <h3 className="emptyWeapon">No Weapons Yet!</h3>
            </div>
        );
    }
    

    const weaponNodes = weapons.map(weapon=>{
        return (
            <div key={weapon.id} className="weapon">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="weaponName">Name: {weapon.name}</h3>
                <h3 className="weaponAttack">Attack: {weapon.properties.stats.attack}</h3>
                <h3 className="weaponRarity">Rarity: {weapon.properties.rarity}</h3>
                <button type="button" onClick={()=> handleDelete(weapon, props.triggerReload)}>Delete</button>
            </div>
        );
    });

    return (
        <div className="weaponList">
            {weaponNodes}
        </div>
    );
};

const Maker = () =>{
    const [reloadWeapons, setReloadWeapons] = useState(false);

    return (
        <div>
            <div id="makeWeapon">
                <WeaponForm triggerReload={()=>setReloadWeapons(!reloadWeapons)}/>
            </div>
            <div id="weapons">
                <WeaponList weapons={[]} reloadWeapons={reloadWeapons} triggerReload={()=>setReloadWeapons(!reloadWeapons)}/>
            </div>
        </div>
    );
};



export default Maker;