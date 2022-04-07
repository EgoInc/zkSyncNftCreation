import * as zksync from 'zksync';
import { Wallet } from 'zksync';
import  cids from 'cids';
import { CID } from 'multiformats/cid';
import {base16} from "multiformats/bases/base16";
import * as ethers from 'ethers';

async function main(): Promise<void> {


    const syncProvider = await zksync.getDefaultProvider('rinkeby');
    const ethersProvider = ethers.getDefaultProvider('rinkeby');
    // Create ethereum wallet using ethers.js
    const MNEMONIC = env.MNEMONIC;
    const ethWallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(ethersProvider);
    // Derive zksync.Signer from ethereum wallet.
    const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

    let balancePromise = await ethWallet.getBalance();
    console.log("You've been logged in with address", ethWallet.address);
    console.log("Your balance", ethers.utils.formatEther(balancePromise));


/*
    const withdraw = await syncWallet.withdrawFromSyncToEthereum({
        ethAddress: ethWallet.address,
        token: 'ETH',
        amount: ethers.utils.parseEther('1.0')
      });
    const deposit = await syncWallet.depositToSyncFromEthereum({
        depositTo: syncWallet.address(),
        token: 'ETH',
        amount: ethers.utils.parseEther('0.1')
      });
    // Await verification
    // Completes when the tx reaches finality on Ethereum
    const depositReceipt = await deposit.awaitVerifyReceipt();
    console.log(deposit);
      console.log("Your balance", ethers.utils.formatEther(balancePromise));
*/

    //get state of zksync account
    const walletAddress = "0xEA79A85AF89068BD7e57902335e4932F54d8079E";
    //console.log('state',await syncProvider.getState(walletAddress));
/*

    let CIDhash = CID.parse("QmQhkT5iJKTXukxaKC9UhBYQue9paX9YU3XbGyGQo4yBQV");

    let cid = CIDhash.toV1().toString(base16.encoder);
    let cidLength = cid.length;
    //console.log(cidLength);
    let contentHash = cid.slice(cidLength-64, cidLength+1);
    contentHash = '0x' + contentHash;
    //console.log(contentHash);

    const start = new Date().getTime();
    console.log ("Start minting");
    var i:number;
    for (i=0;i<100;i++)
    {
        const testNFT_tm =  await syncWallet.mintNFT({
                                                    recipient: walletAddress,
                                                    contentHash: contentHash,
                                                    feeToken: "ETH"
                                                  });
        const receipt = await testNFT_tm.awaitReceipt();
        console.log("Created NFT id: ", i);                                              
    }                                       
    
    
    let elapsed = new Date().getTime() - start;
    

    // Get state of account
    const state = await syncWallet.getAccountState();
    // View committed NFTs
    console.log(state.committed.nfts);
    // View verified NFTs
    console.log(state.verified.nfts);

    console.log ("Total minting time", elapsed);
    */


    const { totalFee: fee } = await syncProvider.getTransactionFee('FastWithdraw', syncWallet.address(), "ETH");
    console.log("TotalFee", fee);
    //Withdraw to L1
    const withdraw = await syncWallet.withdrawNFT({
        to: walletAddress,
        token: 82335 ,
        feeToken: "ETH",
        fee: fee,
        fastProcessing: true});

    const receipt = await withdraw.awaitReceipt();
    console.log(receipt);
      

}

main();