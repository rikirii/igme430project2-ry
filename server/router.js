const controllers = require('./controllers');
const mid = require('./middleware');


// The way router level middleware in Express works is you connect as many
// middleware calls as you want in the order you want the middleware to run. The first
// parameter is always the URL. The last parameter is always the controller. Everything
// in between is any of the middleware operations you want to call.
const router = (app) =>{
    app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

    app.get('/login', mid.requiresSecure, mid.requiresLogout,  controllers.Account.loginPage);
    app.post('/login',  mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

    app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);


    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

};

module.exports = router;