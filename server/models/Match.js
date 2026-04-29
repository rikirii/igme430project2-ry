const mongoose = require('mongoose');


const MatchSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    players:{
        type: [mongoose.Schema.ObjectId],
    },
    moves:{
        type: mongoose.Schema.ObjectId,
    },
    winner: {
        type: mongoose.Schema.ObjectId,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

MatchSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    properties:{
        stats:{
            attack: doc.attack,
        },
        rarity: doc.rarity,
    },
});

const MatchModel = mongoose.model('Match', MatchSchema);
module.exports = MatchModel;