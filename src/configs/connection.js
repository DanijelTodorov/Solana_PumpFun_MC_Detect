const { web3 } = require('@coral-xyz/anchor');
const { Connection, clusterApiUrl } = require('@solana/web3.js');

const connection = new Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');

module.exports = connection;
