const bs58 = require('bs58')
const solanaWeb3 = require('@solana/web3.js');
const { PublicKey } = solanaWeb3
const fs = require('fs').promises;
const { time } = require('console');

(async () => {
    const conn = new solanaWeb3.Connection("https://api.devnet.solana.com")
    const publicKey = new PublicKey("AXymq7nLuCgKgVdSdcxQNtNpyb4QTv3fLXJgjhFoTKay")

    console.log({ publicKey })
    const resx = await conn.getBalance(publicKey)
    console.log({ resx })
    await conn.requestAirdrop(publicKey, 5600000000)
    await function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }(30000)

    const res = await conn.getBalance(publicKey)
    console.log({ res })


})()