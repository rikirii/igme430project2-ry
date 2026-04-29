import React, { Component, useEffect } from 'react';
const helper = require('./helper.js');



const PremiumScreen = ({isPremium, updatePremium}) =>{
    const togglePremium = async() =>{
        await helper.sendPost('/togglePremium', {}, (result) =>{
            if (updatePremium){
                updatePremium(result.premiumStatus);
            }
        });
    };

    return (
        <div className="premium-banner">
            <h1>PREMIUM</h1>
            <p>Tried of ads? Go Pro Today!</p>

            <div className="payment-box">
                <h3>{isPremium ? "Status: Premium Active" : "Status: Free Tier"}</h3>
                <button onClick={togglePremium} className='premium-btn' style={{backgroundColor: isPremium ?'#e74c3c' : '#2ecc71' }}>{isPremium ? "Cancel Subscription" : "Pay $9.99"}</button>
            </div>
        </div>
    );
};

export default PremiumScreen;