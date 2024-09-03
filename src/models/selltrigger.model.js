const mongoose = require('mongoose');

const sellTriggerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    sellPosition1: {
        type: Number,
        default: 1.2,
    },
    sellPosition2: {
        type: Number,
        default: 1.5,
    },
    lsPosition1: {
        type: Number,
        default: 0.9,
    },
    lsPosition2: {
        type: Number,
        default: 0.7,
    },
    remainTime1: {
        type: Number,
        default: 60,
    },
    remainTime2: {
        type: Number,
        default: 60,
    },
    isDevSold: {
        type: Boolean,
        default: true,
    },
    holderDropPercent: {
        type: Number,
        default: 50
    },
    moreSeller: {
        type: Boolean,
        default: true
    },
});

const SellTriggerModel = mongoose.model('SellTrigger', sellTriggerSchema);

// Function
async function find(id) {
    try {
        const settings = await SellTriggerModel.findOne({ id: id });
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
        console.log("sell trigger params =>", params);
        const newSettings = new SellTriggerModel(params);
        const res = await newSettings.save();

        return res;
    } catch (error) {
        console.error('Error creating settings:', error);
        throw error;
    }
}

async function update(id, params) {
    try {

        // console.log(params)
        const data = await SellTriggerModel.findOneAndUpdate({ id: id }, params, {
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
    SellTriggerModel,
    find,
    create,
    update
};
