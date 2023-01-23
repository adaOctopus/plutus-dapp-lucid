import React, {useEffect, useState } from 'react';
import type { NextComponentType, NextPageContext } from "next";
import { Transaction, Asset, KoiosProvider } from '@meshsdk/core';
import { resolveDataHash } from '@meshsdk/core';
import type { Data } from '@meshsdk/core';
import { BrowserWallet } from '@meshsdk/core';
import {Card, Button} from '@web3uikit/core';
import { useLovelace } from '@meshsdk/react';

// Added window in scope for cardano component.
declare const window: any;

// Lock Script Address in Preprod Testnet (this is the contract I coded named LockScriptV2 in the backend associated repo)
const lockScriptAddress = 'addr_test1wrgzpjxkl3249pfsjgmv7mueautkt28kgx2xhehjqhxanecznac34'


const datumConstructor: Data = {
    alternative: 0,
    fields: [100000000, '85d4ddf3ab7b5711afc2324077b49f6c6efd9bd71dd4c63267e13d93'],
  };


// This is the redeemer json format for unlocking funds, 42 is the password number, 50000000 is the amount of ada to unlock.
//   {"constructor":1,"fields":[{"int":100000000},{"int":42}]}

const unlockingRedeemer : Data = {
    alternative: 1,
    fields: [50000000, 42]
}


interface Props {}

const RedeemLocked: NextComponentType<NextPageContext, {}, Props> = (
    props: Props
  ) => {

    const [adaAMount, setAdaAmount] = useState('')

    const handleAda = e => {
        setAdaAmount(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        console.log(adaAMount)
    }

    async function _getAssetUtxo({ scriptAddress, datum }) {
        const koios = new KoiosProvider('preprod');
      
        const utxos = await koios.fetchAddressUTxOs(
          scriptAddress
        );
      
        const dataHash = resolveDataHash(datumConstructor);
        console.log(dataHash)
      
        let utxo = utxos.find((utxo: any) => {
            return utxo.output.dataHash == dataHash;
        });

        return utxo;
    }

    const assetUtxo = async () => await _getAssetUtxo({
        scriptAddress: lockScriptAddress,
        datum: {
            value: datumConstructor
        }
      });

    


    const redeemLockedFunds = async () => {
        // connect to a wallet
        const wallet = await BrowserWallet.enable('nami');
        console.log(wallet, 'Here is the wallet.')
        const usedAddr = await wallet.getChangeAddress()
        assetUtxo()
        if (wallet && usedAddr) {

            // // create the unlock asset transaction
            // const tx = new Transaction({ initiator: wallet })
            //  .redeemValue(
            //     {
            //         value: assetUtxo,
            //         script: {
            //             version: 'V2',
            //             code: '70d020c8d6fc555285309236cf6f99ef1765a8f641946be6f205cdd9e7',
            //         },
            //         datum: {
            //             value: datumConstructor
            //         },
            //         redeemer: unlockingRedeemer
            //         })
            // .sendValue(usedAddr, assetUtxo) // address is recipient address
            // .setRequiredSigners([usedAddr]);
            // const unsignedTx = await tx.build();
            // // note that the partial sign is set to true
            // const signedTx = await wallet.signTx(unsignedTx, true);
            // const txHash = await wallet.submitTx(signedTx);
            // console.log(txHash, 'Transaction done')

            
        }
    }
          

    return (
        <div className="grid">
      <Button theme="translucent" type="button" text="Just Unlock Funds" onClick={redeemLockedFunds}></Button>
      </div>
    )
  }

  export default RedeemLocked;