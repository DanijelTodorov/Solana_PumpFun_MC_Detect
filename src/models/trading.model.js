const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    signature: {
        type: String,
        required: true,
    },
    sol_amount: {
        type: Number,
        required: true,
    },
    token_amount: {
        type: Number,
        required: true,
    },
    is_buy: {
        type: Boolean,
        // required: true,
        default: true
    },
    user: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    mint: {
        type: String,
        required: true,
    },
    virtual_sol_reserves: {
        type: Number,
        required: true,
    },
    virtual_token_reserves: {
        type: Number,
        // required: true,
    },
    tx_index: {
        type: Number,
        // required: true,
    },
    name: {
        type: String,
        // required: true,
    },
    symbol: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
        default: ""
    },
    image_uri: {
        type: String,
        default: "",
        // required: true,
    },
    metadata_uri: {
        type: String,
        required: true,
    },
    twitter: {
        type: String,
        // required: true,
        default: ""
    },
    telegram: {
        type: String,
        // required: true,
        default: ""
    },
    bonding_curve: {
        type: String,
        required: true,
    },
    associated_bonding_curve: {
        type: String,
        // required: true,
    },
    creator: {
        type: String,
        // required: true,
    },
    created_timestamp: {
        type: Number,
        // required: true,
    },
    raydium_pool: {
        type: String,
        // required: true,
        default: null
    },
    complete: {
        type: Boolean,
        default: false
    },

    total_supply: {
        type: Number,
        required: true,
    },
    website: {
        type: String,
        default: ""
    },

    show_name: {
        type: Boolean,
        default: true,
    },
    king_of_the_hill_timestamp: {
        type: Number
        // required: true
    },

    market_cap: {
        type: Number,
        required: true
    },
    reply_count: {
        type: Number,
        // require?d: true
        default: 0
    },


    last_reply: {
        type: Number,
        default: 0
    },

    nsfw: {
        type: Boolean,
        default: true
    },
    market_id: {
        type: Number,
        default: null
    },
    inverted: {
        type: Number,
        default: null
    },

    username: {
        type: String,
        default: ""
    },

    profile_image: {
        type: String,
        default: ""
    },
    creator_username: {
        type: String,
        default: ""
    },
    creator_profile_image: {
        type: String,
        default: ""
    },
    usd_market_cap: {
        type: Number,
        default: 0
    },
    profile_image: {
        type: String,
        default: null
    },
});

const TradingModel = mongoose.model('Trading', userSchema);


module.exports = TradingModel;