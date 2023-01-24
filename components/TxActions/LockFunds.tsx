import React, {useEffect, useState } from 'react';
import type { NextComponentType, NextPageContext } from "next";
import { Transaction, Asset } from '@meshsdk/core';
import { resolveDataHash } from '@meshsdk/core';
import type { Data } from '@meshsdk/core';
import { BrowserWallet } from '@meshsdk/core';
import {Card, Button} from '@web3uikit/core';
import { useLovelace } from '@meshsdk/react';

// Added window in scope for cardano component.
declare const window: any;

// Lock Script Address in Preprod Testnet (this is the contract I coded named LockScriptV2 in the backend associated repo)
const lockScriptAddress = 'addr_test1wzxy9z03jyxkk5reuytc8zlj9hw9x5hn84r2ckyv8rlhcpqnxm59d'

// The lockScript requires a DATUM, in order to redem the funds, therefore we will construct a DATUM to be attached when we lock the funds.
// i.e THis is the datum-lock.json example used with Haskell helper function
// {"constructor":0,"fields":[{"int":100000000},{"bytes":"85d4ddf3ab7b5711afc2324077b49f6c6efd9bd71dd4c63267e13d93"}]} Gets an INteger (amount of ADA) & PubKeyHash

// NOW. With Mesh we construct it in the following way.

const datumConstructor: Data = {
    alternative: 0,
    fields: [100000000, '48946af1bb8e9480298e8cdf47cf7eed715956f5abdeee92ca0a26ee'],
  };

const datumConstructorHash = resolveDataHash(datumConstructor);
console.log(datumConstructorHash, 'Datum hash')
// Datum hash of the above JSON from HASKELL and the constructed one with MESH match perfectly : 20e5d73b65b51bf99bb027b3060dc5dcf8c4018dc16068f31ad50ab6ec2d5ab6


// Tx COnstruction With Mesh




interface Props {}

const LockFundsWDatum: NextComponentType<NextPageContext, {}, Props> = (
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

    const connectWalletLockFunds = async () => {
        // connect to a wallet
        const wallet = await BrowserWallet.enable('nami');
        console.log(wallet, 'Here is the wallet.')
        const tx = new Transaction({ initiator: wallet })
            .sendLovelace(
                {
                address: lockScriptAddress,
                datum: {
                    value: datumConstructor
                },
                },
                '100000000'
            );
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash)
    }

    return (
        <div className="grid">
      <Button theme="translucent" type="button" text="Just Lock Funds" onClick={connectWalletLockFunds}></Button>
      </div>
    )
  }


export default LockFundsWDatum;