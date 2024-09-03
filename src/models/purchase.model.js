
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    mint: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0.00000000289
    },
    amount: {
        type: Number,
        default: 0,
    },
    selled: {
        type: Boolean,
        default: false,
    },
    devHolds: {
        type: Number,
        default: 0,
    },
    halfSelled: {
        type: Boolean,
        default: false,
    },
    timeStamp: {
        type: Number,
        default: Date.now
    }
});

const PurchaseModel = mongoose.model('Purchase', userSchema);

async function find(id) {
    try {
        const model = await PurchaseModel.find({ id: id });

        if (!model) {
            return [];
        }

        let mintArray = []
        for (let i = 0; i < model.length; i++) {
            mintArray.push(model[i].mint)
        }
        return mintArray;
    } catch (error) {
        console.error('Error finding settings:', error);
        return null
    }
}

async function create(id, params) {
    params.id = id;
    try {
        const purchase = new PurchaseModel(params);
        const res = await purchase.save();

        return res;
    } catch (error) {
        console.error('Error creating settings:', error);
        throw error;
    }
}

async function update(id, mint, params) {
    try {
        // console.log("param >>>>>>>>>>>>>>>>>>>>", params)
        const data = await PurchaseModel.findOneAndUpdate({ id: id, mint: mint }, params, {
            new: true, // Return the updated document
            runValidators: true, // Validate the update data against the schema
        });
        return data;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

async function findPurchasesById(id) {
    try {
        const query = {
            id: id,
            amount: { $gt: 0 },
            selled: false
        };

        const results = await PurchaseModel.find(query);

        if (!results) {
            return null;
        }

        return results;
    } catch (error) {
        console.error('Error finding settings:', error);
        return null
    }
}



module.exports = {
    PurchaseModel,
    find,
    create,
    update,
    findPurchasesById
};