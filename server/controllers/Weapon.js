const models = require('../models');
const Weapon = models.Weapon;


const makerPage = async (req, res) =>{
    return res.render('app');
};

const getWeapons = async(req, res) =>{
    try{
        const query = {owner: req.session.account._id};

        const docs = await Weapon.find(query).select('name properties').lean().exec();

        return res.json({weapons:docs});
    }catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving weapons!'});
    }
};

const createWeapon = async (req, res) =>{
    // just check individual for now
    if (!req.body.name || !req.body.attackStat || !req.body.rarity){
        return res.status(400).json({error: 'Both name, properties are required'});
    }


    const weapData = {
        name: req.body.name,
        properties: {
            stats:{
                attack: req.body.attackStat,
            },
            rarity: req.body.rarity,
        },
        owner: req.session.account._id,
    };

    try{
        const newWeap = new Weapon(weapData);
        await newWeap.save();
        return res.status(201).json({name: newWeap.name, stats: newWeap.properties.stats.attack, rarity: newWeap.properties.rarity});
    }catch(err){
        console.log(err);
        if (err.code === 11000){
            return res.status(400).json({error: 'Weapon already exists!'});
        }
        return res.status(500).json({error: 'An error occured smithing weapons!'});
    }
}

const deleteWeapon = async (req,res) =>{
    try{
        const weapToDelete = req.body;
        //console.log(domoToDelete);

        if (!weapToDelete){
            return res.status(400).json({error: 'weapon is missing.'});
        }


        await Weapon.deleteOne({_id: weapToDelete._id});
        return res.status(200).json({message: "Successfully Destroyed Weapon"});
    }catch(err){
        console.log(err);
        return res.status(404).json({error: 'An error occured trying to delete the weapon!'});
    }
}

module.exports = {
    makerPage,
    createWeapon,
    getWeapons,
    deleteWeapon,
};