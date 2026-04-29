const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const settingsPage = (req, res) => {
    return res.render('app', { premiumStatus: req.session.account.premiumStatus });
};


//handle password change
const changePassword = async (req, res) => {
    // password change logic

    const userId = req.session.account._id;

    const { currentPass, newPass } = req.body;

    if (!currentPass || !newPass) {
        return res.status(400).json({ error: "Missing Pass Update Fields" });
    }

    try {
        const user = await Account.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // 1. check current password
        const passAuth = Account.passwordAuth(user, currentPass, (err, match)=>{
            if (err || !match){
                return false;
            }
        });

        if (!passAuth){
            return res.status(401).json({ error: "Incorrect current password" });
        }

        // 2. hash new pass
        const hashedPass = await Account.generateHash(newPass);

        // 3. update db
        user.password = hashedPass
        await user.save();

        return res.status(200).json({ message: "Successfully changed password" });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server Error" });

    }

}

// handle profile pic upload
const updatePfp = async (req, res) => {
    // handle file

    return res.status(200).json({ message: "Successfully updated profile pic" });
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/game' , premiumStatus: account.premiumStatus});
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const email = `${req.body.email}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !email || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, email, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: './game' , premiumStatus: req.session.account.premiumStatus});
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: ' An error occured!' });
    }
};


const togglePremium = async(req, res) =>{
    try{
        const account = await Account.findById(req.session.account._id);

        account.premiumStatus = !account.premiumStatus;
        await account.save();

        req.session.account.premiumStatus = account.premiumStatus;
        return res.json({premiumStatus: account.premiumStatus});
    }catch(err){
        console.log(err);
        return res.status(400).json({error: 'Failed to update premium status'});
    }
};

const getUserStatus = (req, res) =>{
    if (!req.session.account){
        return res.status(200).json({premiumStatus: false});
    }

    return res.json({
        premiumStatus: req.session.account.premiumStatus,
        username: req.session.account.username
    });
};


module.exports = {
    loginPage,
    login,
    logout,
    signup,
    settingsPage,
    changePassword,
    updatePfp,
    togglePremium,
    getUserStatus,
};