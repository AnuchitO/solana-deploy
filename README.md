# Solana Deploy
This is a example how to deploy smart contract (.so) on solana 

# Devnet Example
```bash
npm install
npm run deploy
```

# Deploying Mainnet

To deploy the contract on mainnet you'll need an account with some SOL tokens to pay for the transactions. You can load a user account using a private key buffer array.

Check the code in solana-json.rs to make sure this is what you are looking for. There are currently no checks on the data provider key so anyone can upload and modify the data stored in the contract. Editing this file will require rebuilding using "cargo build-bpf"
```javascript
const payerAccount = new solanaWeb3.Keypair.fromSecretKey([1,185,72,49,215,81,171,50,85,54,122,53,24,248,3,221,42,85,82,43,128,80,215,127,68,99,172,141,116,237,232,85,185,31,141,73,173,222,173,174,4,212,0,104,157,80,63,147,21,81,140,201,113,76,156,161,154,92,70,67,163,52,219,72]);
```

# Resources
https://docs.solana.com/developing/clients/javascript-api

https://docs.solana.com/developing/deployed-programs/examples

https://docs.solana.com/developing/deployed-programs/developing-rust

https://solongwallet.medium.com/solana-development-tutorial-program-101-2b168bffd541

https://jamesbachini.com/


# To Do
- Easy way to adjust data size
- Add secure data option on smartcontract
- Test random data such as unicode in json
- Audit smartcontract