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
const lockScriptAddress = 'addr_test1wrgzpjxkl3249pfsjgmv7mueautkt28kgx2xhehjqhxanecznac34'


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

    const redeemLockedFunds = async () => {
        // connect to a wallet
        const wallet = await BrowserWallet.enable('nami');
        console.log(wallet, 'Here is the wallet.')
    }

    return (
        <div className="grid">
      <Button theme="translucent" type="button" text="Just Lock Funds" onClick={redeemLockedFunds}></Button>
      </div>
    )
  }

  export default RedeemLocked;