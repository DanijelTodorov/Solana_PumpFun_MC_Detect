const mongoose = require('mongoose');

const buyTriggerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    mintFree: {
        type: Boolean,
        default: false,
    },
    hasSocial: {
        type: Boolean,
        default: false,
    },
    minMarketCap: {    //$ MIN MC
        type: Number,
        required: true,
        default: 5000
    },
    maxMarketCap: {    //$ MAX MC
        type: Number,
        default: 10000
    },
    devHolds: {
        type: Number,
        default: 0
    },
    buyTxsIn30: {
        type: Number,
        default: 0
    },
    holders: {
        type: Number,
        default: 20
    },
    replys: {
        type: Number,
        default: 20
    }
});

const BuyTriggerModel = mongoose.model('BuyTrigger', buyTriggerSchema);

// Function
async function find(id) {
    try {
        const settings = await BuyTriggerModel.findOne({ id: id });
        if (!settings) {
            return null;
            // throw new Error(`Settings with id ${id} not found`);
        }
        return settings;
    } catch (error) {
        console.error('Error finding settings:', error);
        throw error;
    }
}

async function create(id, params) {
    params.id = id;
    try {
        console.log("params =>", params);
        const newSettings = new BuyTriggerModel(params);
        const res = await newSettings.save();

        return res;
    } catch (error) {
        console.error('Error creating settings:', error);
        throw error;
    }
}

async function update(id, params) {
    try {
        const data = await BuyTriggerModel.findOneAndUpdate({ id: id }, params, {
            new: true, // Return the updated document
            runValidators: true, // Validate the update data against the schema
        });
        return data;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

module.exports = {
    BuyTriggerModel,
    find,
    create,
    update
};
