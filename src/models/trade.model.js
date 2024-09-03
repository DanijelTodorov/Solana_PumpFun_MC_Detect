// const { DataTypes } = require('sequelize');
// const sequelize = require('@/configs/database.js');

// const Trade = sequelize.define(
//   'Trade',
//   {
//     userId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     inputMint: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     inAmount: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     outputMint: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     outAmount: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//   },
//   {
//     underscored: true,
//     tableName: 'trades',
//   }
// );

// module.exports = Trade;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  inputMint: {
    type: String,
    required: true,
  },

  inAmount: {
    type: Number,
    required: true,
  },
  outputMint: {
    type: String,
    required: true,
  },
  outAmount: {
    type: Number,
    required: true,
  },
});

const TradeModel = mongoose.model('Trade', userSchema);


module.exports = TradeModel;
