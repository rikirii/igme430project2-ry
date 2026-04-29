const models = require('../models');
const Account = models.Account;

const gamePage = async (req, res) =>{
    return res.render('app', {
        premiumStatus: req.session.account.premiumStatus,
    });
};

const leaderboardPage = async (req, res) =>{
    return res.render('app', { premiumStatus: req.session.account.premiumStatus });
};

const getLeaderboard = async (req, res) =>{
    try{
        const topPlayers = await Account.find({}).sort({"gameStats.rating":-1 }).limit(10).select('username gameStats.rating gameStats.wins gameStats.losses');

        return res.json({players: topPlayers});
    }catch(err){
        console.log(err);
        return res.status(400).json({error: 'Could not retrieve leaderboard'});
    }
}

module.exports = {
    gamePage,
    leaderboardPage,
    getLeaderboard,
};