const solanaWeb3 = require('@solana/web3.js');
const { Connection, PublicKey, Keypair, clusterApiUrl } = solanaWeb3
const fs = require('fs').promises;
const BufferLayout = require('buffer-layout');
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
(async () => {
    console.log("\n#1 Create Payer Account : who will pay for deployment")
    const payerAccount = new Keypair() // can create from seed if want to deploy to mainnet.
    console.log({
        payerAccount: {
            publicKey: payerAccount.publicKey.toBytes(),
            publicKeyBase58: payerAccount.publicKey.toBase58(),
            secretKey: payerAccount.secretKey
        }
    })
    console.log("\n#2 Air drop money to Payer Account ...");
    const devnet = clusterApiUrl('devnet') // "https://api.devnet.solana.com"
    const conn = new Connection(devnet)
    await conn.requestAirdrop(payerAccount.publicKey, 9000000000)
    await sleep(20000)

    console.log("\n#3 Create Program Account : smart contract need separate account to attach.");
    const programAccount = new Keypair()
    const programId = programAccount.publicKey
    console.log('Program loaded to account')
    console.log({
        programAccount: {
            programId: programId.toBytes(),
            programIdBase58: programId.toBase58(),
            secretKey: programAccount.secretKey
        }
    })
    console.log("\n#4 Loading Program to Account : upload smart contract using BPF LOADER ...");
    const smartcontract = await fs.readFile('./solana-json.so')
    console.log({ smartcontract })
    await solanaWeb3.BpfLoader.load(conn, payerAccount, programAccount, smartcontract, solanaWeb3.BPF_LOADER_PROGRAM_ID)

    console.log("\n#5 Create App Account : account for the app itself which will store any data required for the dApp.");
    const appAccount = new Keypair()
    console.log('app Account')
    console.log({
        appAccount: {
            publicKey: appAccount.publicKey.toBytes(),
            publicKeyBase58: appAccount.publicKey.toBase58(),
            secretKey: appAccount.secretKey
        }
    })

    console.log("\n#6 Deploy Program to App Account : deploy smart contact for App Account");
    const space = BufferLayout.struct([BufferLayout.blob(1000, 'txt')]).span
    console.log({ space })
    const lamports = 3000000000;
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.createAccount({
            fromPubkey: payerAccount.publicKey,
            newAccountPubkey: appAccount.publicKey,
            lamports,
            space,
            programId,
        })
    )

    await solanaWeb3.sendAndConfirmTransaction(conn, transaction, [payerAccount, appAccount], {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
    })

    console.log("\n#7 Interact with smart contact : sending some data to store in dApp");
    const paddedMsg = "hello solana AnuchiO here".padEnd(1000);
    const buffer = Buffer.from(paddedMsg, 'utf8');
    const instruction = new solanaWeb3.TransactionInstruction({
        keys: [{ pubkey: appAccount.publicKey, isSigner: false, isWritable: true }],
        programId,
        data: buffer,
    })
    const signature = await solanaWeb3.sendAndConfirmTransaction(
        conn,
        new solanaWeb3.Transaction().add(instruction),
        [payerAccount],
        { commitment: 'singleGossip', preflightCommitment: 'singleGossip' },
    );

    console.log({ signature })

    console.log("\n#8 Fetch a transaction details for a confirmed transaction ...");
    await sleep(20000) // sleep wait for all node block sync
    const info = await conn.getConfirmedTransaction(signature)
    console.log({ info })


    console.log("\n#9 Fetch all the account info for the specified public key");
    const accountInfo = await conn.getAccountInfo(appAccount.publicKey);
    console.log({ accountInfo })
    const accInfo = Buffer.from(accountInfo?.data || "").toString().substr(4, 1000).trim();
    console.log({ accInfo })

    console.log({ result: "!!!!   SUCESSS  !!!!" })
    console.warn({ run: `solana confirm -v ${signature}` })
})()