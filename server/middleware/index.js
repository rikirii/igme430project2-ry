const requiresLogin = (req, res, next) =>{
    if (!req.session.account){
        return res.redirect('/');
    }
    return next();
}

const requiresLogout = (req, res, next) =>{
    if (req.session.account){
        return res.redirect('/maker');
    }
    return next();
}

const requiresSecure = (req, res, next) =>{
    if (req.headers['x-forwarded-proto'] !== 'https'){
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
}

const bypassSecure = (req, res, next)=>{
    next();
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production'){
    module.exports.requiresSecure = requiresSecure;
}
else{
    module.exports.requiresSecure = bypassSecure;
}

// if later on your code isn’t working on Heroku but works locally, chances are it has to
// do with you either not setting up your NODE_ENV config var correctly, or something
// being messed up in the requiresSecure function.
// 18. For this code to work, we need to add an environment variable on Heroku.
