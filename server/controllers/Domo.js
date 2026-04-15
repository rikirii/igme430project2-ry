const models = require('../models');
const Domo = models.Domo;


const makerPage = async (req, res) =>{
    return res.render('app');
};

const getDomos = async(req, res) =>{
    try{
        const query = {owner: req.session.account._id};

        // updates old domos with the new level attribute based on the ownder of account
        const filter = {owner:query.owner, level: {$exists: false}};

        const updateDoc = {
            $set:{
                level: 1,
            },
        };

        await Domo.updateMany(filter, updateDoc);
        ///

        const docs = await Domo.find(query).select('name age level').lean().exec();

        return res.json({domos:docs});
    }catch (err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});
    }
};

const makeDomo = async (req, res) =>{
    if (!req.body.name || !req.body.age || !req.body.level){
        return res.status(400).json({error: 'Both name, age, and level are required'});
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age, level: newDomo.level});
    }catch(err){
        console.log(err);
        if (err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }
        return res.status(500).json({error: 'An error occured making domo!'});
    }
}

const deleteDomo = async (req,res) =>{
    try{
        const domoToDelete = req.body;
        //console.log(domoToDelete);

        if (!domoToDelete){
            return res.status(400).json({error: 'Domo is missing.'});
        }


        await Domo.deleteOne({_id: domoToDelete._id});
        return res.status(200).json({message: "Successfully Deleted Domo"});
    }catch(err){
        console.log(err);
        return res.status(404).json({error: 'An error occured trying to delete the domo!'});
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
};