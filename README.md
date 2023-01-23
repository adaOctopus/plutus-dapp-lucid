## This is a PLutus UI Dapp built with the `lucid-cardano` library.


### How to build

- Clone the repo locally: https://github.com/tas2017/plutus-dapp-lucid
- cd to the root (leap) directory
- run : `npm install`
- run : `npm run dev`
- visit localhost:3000 the app should be up and running there.

### Current Status
1. Send ADA to an address with MESH: Done
2. Lock funds to a script with constructed custom datum with MESH: Done
3. Lock funds & Mint multiple tokens with Mesh: Done

### Steps to interact with this repo:
1) inside root directory run : `npm i`
2) Then once done, run `npm run dev`
3) Go to `localhost:3000` and you should be able to view the Dapp.


### Notes

MeshSDK has a bug with CSL and we cannot mint multiple tokens from multiple policies in the same transaction.
We get MIssingRedeemer errors from SHelley

THereore, the PLutus Contracts I have written can be interacted with only via cardano-cli at the moment (read the other repo for info: https://github.com/tas2017/plutus-mint-lock-unlock-dapp)

In this implementation we are doing these simple demonstrations:

- Send 5 ADA to an address
- Lock some funds with a DATUM (50 tADA hardcoded)
- Lock funds to my smart contract and mint an NFT for identification and WizardTokens
- Redeeming those funds, is currently pending.

All functionalities are built in a modular form (each component does one thing. Read the code to understand, it is very simple.)

If help is needed, message in the PlutusWizards discord https://discord.gg/hvGtC7Xh