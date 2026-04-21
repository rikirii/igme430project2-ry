const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const WeaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    properties: {
        stats:{
            attack:{
                type: Number,
                required: true,
                min: 0,
                max: 99,
            }
        },
        rarity: {
            type: String,
            enum: {
                values: ['Common', 'Rare', 'Peak', 'Intent', 'Transcendent'],
            },
            required: true,
            trim: true,
        },
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

WeaponSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    properties:{
        stats:{
            attack: doc.attack,
        },
        rarity: doc.rarity,
    },
});

const WeaponModel = mongoose.model('Weapon', WeaponSchema);
module.exports = WeaponModel;