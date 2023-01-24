## This is a PLutus UI Dapp built with the `lucid-cardano` library.


### How to build

- Clone the repo locally: https://github.com/tas2017/plutus-dapp-lucid
- cd to the root (leap) directory
- run : `npm install`
- run : `npm run dev`
- visit localhost:3000 the app should be up and running there.

### Current Status
1. Send ADA to an address with MESH: Done (update line 33 SendAda.tsx file with address you want to send tADA)
2. Lock funds to a script with constructed custom datum with MESH: Done
3. Lock funds & Mint multiple tokens with Mesh: Done
4. Unlock funds from the script using a custom redeemer action.

### Steps to interact with this repo:
1. inside root directory run : `npm i`
2. Then once done, run `npm run dev`
3. Go to `localhost:3000` and you should be able to view the Dapp.
4. Each of the 4 functions lives under the 4 Components/TxActions
5. The main page is the index.tsx file (hopefully you have some familiarity with NextJS)


### Notes

MeshSDK has a bug with CSL and we cannot mint multiple tokens from multiple policies in the same transaction.
We get MIssingRedeemer errors from SHelley

THereore, the PLutus Contracts I have written can be interacted with only via cardano-cli at the moment (read the other repo for info: https://github.com/tas2017/plutus-mint-lock-unlock-dapp)

In this implementation we are doing these simple demonstrations:

- Send 5 ADA to an address
- Lock some funds with a DATUM (50 tADA hardcoded)
- Lock funds to my smart contract and mint an NFT for identification and WizardTokens
- Redeeming those funds


--> For redeeming funds make sure you update the txHash string in the `_getAssetUtxo` function in line 71 at `RedeemLockedFunds.tsx` code file
--> For redeeming the funds you first need to lock some :) I have hardcoded 100 tAda to send, make sure your wallet is funded.

All functionalities are built in a modular form (each component does one thing. Read the code to understand, it is very simple.)

If help is needed, message in the PlutusWizards discord https://discord.gg/hvGtC7Xh