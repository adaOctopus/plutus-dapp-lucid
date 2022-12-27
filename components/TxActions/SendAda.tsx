import React, { useEffect, useState } from "react";
import { Blockfrost, Lucid } from "lucid-cardano"; // NPM
import type { NextComponentType, NextPageContext } from "next";
import { AnyNaptrRecord } from "dns";
import {Card, Button} from '@web3uikit/core';

// Blockfrost ID Cardano Preprod : preprodl6mpfyj56kREeSk8UZ4cvKFYKGrJkbz6

// Added window in scope for cardano component.
declare const window: any;

const lucid = await Lucid.new(
    new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "preprodl6mpfyj56kREeSk8UZ4cvKFYKGrJkbz6"),
    "Preprod",
  );

interface Props {
    // walletApi : any;
}

const SendAda: NextComponentType<NextPageContext, {}, Props> = (
    props: Props
  ) => {

    const sendAdaToAddressX = async () => {

        // Assumes you are in a browser environment
        const api = await window.cardano.nami.enable();
        lucid.selectWallet(api);

        const tx = await lucid.newTx()
        .payToAddress("addr_test1vzzafh0n4da4wyd0cgeyqaa5nakxalvm6uwaf33jvlsnmycqxq00v", { lovelace: 5700000n })
        .complete();

        const signedTx = await tx.sign().complete();

        const txHash = await signedTx.submit();

        console.log(txHash);
            }

    return (

        <div className="grid">

        
          <Button theme="primary" type="button" text="Send 5 ADA$" onClick={sendAdaToAddressX}></Button>
        </div>
    )
   }


export default SendAda;
