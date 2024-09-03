const mongoose = require('mongoose');

// Define the main schema
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  }
});

const WalletModel = mongoose.model('Wallet', userSchema);


// Function to create wallet info for a user
async function create_wallets(userId, privateKey, publicKey) {
  console.log(">>> Database >>> Create Wallets", userId, privateKey, publicKey);

  try {
    // Check if the userId already exists
    const existingWallet = await WalletModel.findOne({ id: userId });
    if (existingWallet) {
      console.log(">>> Wallet with this ID already exists:", userId);
      throw new Error('Wallet with this ID already exists');
    }

    // If not, create a new wallet
    const wallet = new WalletModel({
      id: userId,
      privateKey: privateKey,
      publicKey: publicKey
    });

    console.log("[DATABASE] Create Wallet : ", wallet);
    return await wallet.save();
  } catch (error) {
    console.error('Error creating wallets:', error);
    throw error;
  }
}

// Function to find wallet info for a user by user ID
async function find_wallet(userId) {
  try {
    const wallet = await WalletModel.findOne({ id: userId.toString() });
    if (!wallet) {
      return null;
    }
    return wallet;
  } catch (error) {
    console.error('Error fetching wallet by id:', error);
    return null;
    throw error;

  }
}

// Function to update wallet info for a user by user ID
async function update_wallet(userId, privateKey, publicKey) {
  const walletInfo = await WalletModel.findOneAndUpdate(
    { id: userId },
    { privateKey: privateKey, publicKey: publicKey },
    { new: true }
  );
  return walletInfo;
}

module.exports = {
  WalletModel,
  create_wallets,
  find_wallet,
  update_wallet
};