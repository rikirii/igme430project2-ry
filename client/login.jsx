// handle everything before the user is logged in, like login and sign up screens.

const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

/*
    handles the submit event on the login form
    *NOTE: no third parameter for sendPost func call. 
    Built in error handling inside it will be sufficient for this scenario (for now)
*/
const handleLogin = (e) =>{
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass}, (result)=>{
        if (!result.error){
            setPremiumStatus(result.premiumStatus);
        }
    });
    return false;
}

const handleSignup = (e) =>{
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const email = e.target.querySelector('#email').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username ||!email || !pass || !pass2){
        helper.handleError('All fields are requiered!');
        return false;
    }

    if (pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, email, pass, pass2});

    return false;
}


const LoginWindow = (props) =>{
    return (
    <div className="formWindow">
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <h2>Log In</h2>
            <label htmlFor="user">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    </div>
    );
};



const SignupWindow = (props) =>{
    return (
    <div className="formWindow">
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <h2>Sign Up</h2>
            <label htmlFor="user">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="email">Email (Optional): </label>
            <input id="email" type="email" name="email" placeholder="default@example.com" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    </div>
    );
};


const init = () =>{
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e)=>{
        e.preventDefault();
        loginButton.classList.add('active');
        signupButton.classList.remove('active');
        root.render( <LoginWindow/>);
        return false;
    });

    signupButton.addEventListener('click',(e) =>{
        e.preventDefault();
        loginButton.classList.remove('active');
        signupButton.classList.add('active');
        root.render(<SignupWindow/>);
        return false;
    });

    root.render(<LoginWindow/>);
};

window.onload = init;