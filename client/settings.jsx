// handle settings page
import { create } from 'underscore';

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handlePassUpdate = (e) => {
    e.preventDefault();

    helper.hideError();
    const currentPass = e.target.querySelector('#currentPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const confirmPass = e.target.querySelector('#confirmPass').value;

    if (!currentPass || !newPass || !confirmPass) {
        helper.handleError("All Fields are Required");
        return;
    }

    if (newPass !== confirmPass) {
        helper.handleError("New passwords do not match");
        return;
    }

    helper.sendPost(e.target.action, { currentPass, newPass });

    return false;

};


const Settings = () => {
    return (
        <div id="settings">
            <h1>Settings</h1>

            <div className="setting-section">
                <h2>Profile Picture</h2>
                <input type="file" name="profilePic" />
                <button>Upload</button>
            </div>

            <div className="setting-section">
                <h2>Change Password</h2>
                <form id="updatePassForm"
                    name="updatePassForm"
                    onSubmit={handlePassUpdate}
                    action="/changePassword"
                    method="POST"
                    className="PassForm"
                >
                    <input id="currentPass" type="password" placeholder="Current Password" />
                    <input id="newPass" type="password" placeholder="New Password" />
                    <input id="confirmPass" type="password" placeholder="Confirm New Password" />
                    <button className="formSubmit" type="submit">Update Password</button>
                </form>
            </div>
        </div>



    );
};


export default Settings;