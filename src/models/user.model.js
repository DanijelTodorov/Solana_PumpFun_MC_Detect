const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  referrerId: {
    type: String,
    default: ""
  },
  allowed: {
    type: Boolean,
    default: false
  },
  limitMarketCap: {
    type: Number,
    default: 10000
  }
});

const UserModel = mongoose.model('User', userSchema);


module.exports = UserModel;