// const { DataTypes } = require('sequelize');
// const sequelize = require('@/configs/database.js');

// const Income = sequelize.define(
//   'Income',
//   {
//     userId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     senderId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     referral: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     lucky: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//   },
//   {
//     underscored: true,
//     tableName: 'incomes',
//   }
// );

// module.exports = Income;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  referral: {
    type: Number
  },
  lucky: {
    type: Number
  },
});

const IncomeModel = mongoose.model('Income', userSchema);


module.exports = IncomeModel;