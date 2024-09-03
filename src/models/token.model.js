
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mint: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    image_uri: {
        type: String,
        // required: true,
    },
    metadata_uri: {
        type: String,
        required: true,
    },
    twitter: {
        type: String,
        default: ""
    },
    telegram: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    bonding_curve: {
        type: String,
        required: true,
    },
    associated_bonding_curve: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    created_timestamp: {
        type: Number,
        required: true,
    },
    raydium_pool: {
        type: Boolean,
        default: false,
    },
    complete: {
        type: Boolean,
        default: false
    },
    virtual_sol_reserves: {
        type: Number,
        required: true,
    },
    virtual_token_reserves: {
        type: Number,
        required: true,
    },
    hidden: {
        type: Boolean,
        default: false
    },
    total_supply: {
        type: Number,
        default: 1000000000000000,
    },
    show_name: {
        type: Boolean,
        default: true,
    },
    last_trade_timestamp: {
        type: Number,
        default: null
    },
    king_of_the_hill_timestamp: {
        type: Number,
        default: null
    },
    market_cap: {
        type: Number,
        required: true,
    },
    nsfw: {
        type: Boolean,
        default: false,
    },

    market_id: {
        type: Number,
        default: null,
    },

    king_of_the_hill_timestamp: {
        type: Number,
        default: null,
    },
    usd_market_cap: {
        type: Number,
        default: null,
    },
    is_banned: {
        type: Boolean,
        default: false,
    },
    reply_count: {
        type: Number,
        default: 0,
    },

    inverted: {
        type: Boolean,
        default: false,
    },
    real_sol_reserves: {
        type: Number,
        default: 0,
    },
    real_token_reserves: {
        type: Number,
        default: 0,
    },
});

const TokenModel = mongoose.model('Token', userSchema);

module.exports = TokenModel;