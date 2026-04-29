const controllers = require('./controllers');
const mid = require('./middleware');


// The way router level middleware in Express works is you connect as many
// middleware calls as you want in the order you want the middleware to run. The first
// parameter is always the URL. The last parameter is always the controller. Everything
// in between is any of the middleware operations you want to call.
const router = (app) =>{

    app.get('/login', mid.requiresSecure, mid.requiresLogout,  controllers.Account.loginPage);
    app.post('/login',  mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);


    app.get('/leaderboard', mid.requiresLogin, controllers.Game.leaderboardPage);
    app.get('/getLeaderboard', mid.requiresLogin, controllers.Game.getLeaderboard);

    app.get('/game', mid.requiresLogin, controllers.Game.gamePage);

    app.get('/settings',mid.requiresLogin, controllers.Account.settingsPage );

    app.get('/webstore', mid.requiresLogin, controllers.Game.gamePage);

    app.post('/changePassword',mid.requiresSecure, mid.requiresLogin, 
        controllers.Account.changePassword );
    
    app.post('/uploadPfp', mid.requiresLogin, controllers.Account.updatePfp );

    app.get('/getUserStatus', mid.requiresLogin, controllers.Account.getUserStatus);
    app.post('/togglePremium', mid.requiresLogin, controllers.Account.togglePremium);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    app.use((req,res) =>{
        res.status(404).render('404');
    });
};

module.exports = router;