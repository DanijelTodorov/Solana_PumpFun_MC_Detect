
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mint: {
        type: String,
        required: true,
    },
    hasSocial: {
        type: Boolean,
        default: false
    },
    marketCap: {
        type: Number,
        default: 0
    },
    usdMarketCap: {
        type: Number,
        default: 0
    },
    raydiumPool: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0.00000000289,
    },
    replys: {
        type: Number,
        default: 0,
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    lastTimeStamp: {
        type: Number,
        default: 0
    },
});

const AnalystModel = mongoose.model('Analyst', userSchema);

async function find(mint) {
    try {
        const model = await AnalystModel.findOne({ mint: mint });
        if (!model) {
            return null;
        }
        return model;
    } catch (error) {
        console.error('Error finding settings:', error);
        return null
    }
}

async function getTimeStamp(mint) {
    try {
        const model = await AnalystModel.findOne({ mint: mint });
        if (!model) {
            return null;
        }
        return model.lastTimeStamp;
    } catch (error) {
        console.error('Error finding settings:', error);
        return null
    }
}

async function update(mint, params) {
    try {
        const data = await AnalystModel.findOneAndUpdate({ mint: mint }, params, {
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
    AnalystModel,
    find,
    getTimeStamp,
    update,
};