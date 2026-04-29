import React, { Component, useEffect } from 'react';
const helper = require('./helper.js');



const PremiumScreen = ({premiumStatus}) =>{
    // toggle premium status
    const togglePremium = () =>{
        helper.sendPost('/togglePremium', {}, (result) =>{
            helper.setPremiumStatus(result.premiumStatus);
        });
    };

    return (
        <div className="premium-banner">
            <h1>PREMIUM</h1>
            <p>Tried of ads? Go Pro Today!</p>

            <div className="payment-box">
                <h3>{premiumStatus ? "Status: Premium Active" : "Status: Free Tier"}</h3>
                <button onClick={togglePremium} className='premium-btn' style={{backgroundColor: premiumStatus ?'#e74c3c' : '#2ecc71' }}>{premiumStatus ? "Cancel Subscription" : "Pay $9.99"}</button>
            </div>
        </div>
    );
};

export default PremiumScreen;