const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  buySolAmount: {
    type: Number,
    default: 0.1,
  },
  slippage: {
    type: Number,
    default: 10,
  }
});

const SettingsModel = mongoose.model('Setting', settingSchema);

// Function
async function find(id) {
  try {
    const setting = await SettingsModel.findOne({ id: id });
    if (!setting) {
      // throw new Error(`Settings with id ${id} not found`);
      return null
    }
    return setting;
  } catch (error) {
    console.error('Error finding settings:', error);
    throw error;
  }
}

async function create(id) {
  try {
    const newSetting = new SettingsModel({
      id: id,
      buySolAmount: 0.1,
      slippage: 10
    });
    await newSetting.save();
    return newSetting;
  } catch (error) {
    console.error('Error creating settings:', error);
    throw error;
  }
}

async function update(id, params) {
  try {
    const data = await SettingsModel.findOneAndUpdate({ id: id }, params, {
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
  SettingsModel,
  find,
  create,
  update
};
