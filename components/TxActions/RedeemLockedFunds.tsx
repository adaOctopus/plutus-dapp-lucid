import React, {useEffect, useState } from 'react';
import type { NextComponentType, NextPageContext } from "next";
import { Transaction, Asset, KoiosProvider, PlutusScript,resolvePlutusScriptAddress } from '@meshsdk/core';
import { resolveDataHash } from '@meshsdk/core';
import type { Data } from '@meshsdk/core';
import { BrowserWallet } from '@meshsdk/core';
import {Card, Button} from '@web3uikit/core';
import { useLovelace } from '@meshsdk/react';

// Added window in scope for cardano component.
declare const window: any;

// Lock Script Address in Preprod Testnet (this is the contract I coded named LockScriptV2 in the backend associated repo)
const lockScriptAddress = 'addr_test1wzxy9z03jyxkk5reuytc8zlj9hw9x5hn84r2ckyv8rlhcpqnxm59d'

// The datum matching the data hash in the utxo with the locked funds at the script address
const datumConstructor: Data = {
    alternative: 0,
    fields: [100000000, '48946af1bb8e9480298e8cdf47cf7eed715956f5abdeee92ca0a26ee'],
  };


// This is the redeemer json format for unlocking funds, 42 is the password number, 50000000 is the amount of ada to unlock.
//   {"constructor":1,"fields":[{"int":100000000},{"int":42}]}
const unlockingRedeemer = {
    data: { alternative: 0, fields: [100000000, 42]},
}

// Resolving the address of my LockScriptV2 contract
const lockingScript: PlutusScript = {
    code: '5908b65908b3010000323232332232323232323232323233223233223232323232322323223232232325335323232533553353500222333573466e1c0052054024023102213357389201134f6f70732077726f6e672070617373776f72640002115335323235002222222222222533533355301b12001321233001225335002210031001002502425335333573466e3c0380040c40c04d409800454094010840c440bcd401088004d40048800840884cd5ce24811a4f6f7073206e6f7420636f7272656374207369676e61747572650002110213333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4070074d5d0a80619a80e00e9aba1500b33501c01e35742a014666aa040eb9407cd5d0a804999aa8103ae501f35742a01066a0380526ae85401cccd540800a9d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40d1d69aba150023035357426ae8940088c98c80dccd5ce01d01c81a89aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a81a3ad35742a004606a6ae84d5d1280111931901b99ab9c03a039035135573ca00226ea8004d5d09aba2500223263203333573806c06a06226aae7940044dd50009aba1500533501c75c6ae854010ccd540800988004d5d0a801999aa8103ae200135742a00460506ae84d5d1280111931901799ab9c03203102d135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00860306ae84d5d1280211931901099ab9c02402301f3333573466e1cd55cea803240004664424660020060046eb4d5d0a8031bad357426ae8940188c98c8080cd5ce01181100f1999ab9a3370e6aae7540212000232321233001003002375c6ae84d5d128049bad35742a010464c6403e66ae7008808407440804c98c8078cd5ce24810350543500020135573ca00226ea80044d55cf280089baa001135573ca00226ea8004c8004d5406088448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80c111999aab9f0012500a233500930043574200460066ae880080608c8c8cccd5cd19b8735573aa004900011991091980080180118071aba150023005357426ae8940088c98c8058cd5ce00c80c00a09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180b9aba1500233500f016357426ae8940088c98c806ccd5ce00f00e80c89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403a66ae7008007c06c0680644d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201733573803403202a26ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355015223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301613574200222440042442446600200800624464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900919ab9c01501401000f135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01301200e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00f00e00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00680600409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00b00a80880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae7003c0380280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801801600e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7003403002001c0184d55cea80089baa0012323333573466e1d40052002200623333573466e1d40092000200623263200633573801201000800626aae74dd5000a4c244004244002240029210350543100112323001001223300330020020011',
    version: 'V2',
};
const lockingScriptAddr = resolvePlutusScriptAddress(lockingScript, 1);


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

        if (utxos) {
            console.log(utxos, "Script utxos")
        }
      
        let utxo = utxos.find((utxo: any) => {
            // Update this string with the input utxo txHash of the one you want to redeem.
            return utxo.input.txHash == 'd5a86d4e31308e7ab2a2cf090311a5115bf3e1e5fddf2a9750bffa1294a8a42a';
        });

        console.log(utxo, "1 utxo")

        return utxo;
    }

    const assetUtxo = async () => await _getAssetUtxo({
        scriptAddress: lockScriptAddress,
        datum: {
            value: datumConstructor
        }
      });

    

    // This is the main function to unlock the funds.
    const redeemLockedFunds = async () => {
        // connect to a wallet
        const wallet = await BrowserWallet.enable('nami');
        console.log(wallet, 'Here is the wallet.')
        const usedAddr = await wallet.getChangeAddress()
        const correctUtxo = await assetUtxo()
        if (wallet && usedAddr && correctUtxo) {

            const tx = new Transaction({ initiator: wallet })
              .redeemValue(({
                value: correctUtxo,
                script: lockingScript,
                datum: datumConstructor,
                redeemer: unlockingRedeemer,
              }))
              .sendValue(usedAddr, correctUtxo) // address is recipient address
              .setRequiredSigners([usedAddr]);
            const unsignedTx = await tx.build();
            // note that the partial sign is set to true
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            console.log(txHash, 'Transaction done')
            
        }
    }
          

    return (
        <div className="grid">
      <Button theme="translucent" type="button" text="Just Unlock Funds" onClick={redeemLockedFunds}></Button>
      </div>
    )
  }

  export default RedeemLocked;