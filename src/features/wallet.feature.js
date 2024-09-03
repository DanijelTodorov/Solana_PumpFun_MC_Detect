const {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
} = require('@solana/web3.js')

const base58 = require('bs58');

const getTokenAccountBalance = async (walletAddress, mintAddress) => {

    const connection = new Connection(process.env.RPC_URL, {
        commitment: 'confirmed',
    })
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { mint: new PublicKey(mintAddress) }
    )

    // Extract the token amount from the first account (if multiple accounts exist)
    const balance =
        tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount
    return balance || 0
}

const getWalletSOLBalance = async (walletAddress, isLamport = false) => {
    const connection = new Connection(process.env.RPC_URL, {
        commitment: 'confirmed',
    })
    let balance = 0;
    try {
        if (isLamport) {
            balance = await connection.getBalance(new PublicKey(walletAddress))
        } else {
            balance = await connection.getBalance(new PublicKey(walletAddress)) / LAMPORTS_PER_SOL
        }
    } catch (error) {
        console.log(error)
    }
    return balance || 0
}

const getWalletFromPrivateKey = (privateKey) => {
    try {
        const key = base58.decode(privateKey)
        const keypair = Keypair.fromSecretKey(key);

        const publicKey = keypair.publicKey.toBase58()
        const secretKey = base58.encode(keypair.secretKey)

        return { publicKey, secretKey, wallet: keypair }
    } catch (error) {
        return null;
    }
}

module.exports = {
    getTokenAccountBalance,
    getWalletFromPrivateKey,
    getWalletSOLBalance
}