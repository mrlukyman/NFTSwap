import { NftSwap } from '@traderxyz/nft-swap-sdk'
import { ethers } from 'ethers'
import { OwnedNft } from 'alchemy-sdk'
import { toast } from 'react-toastify';

export const swap = async (userAddress: `0x${string}`, makerNftList: OwnedNft[], takerNftList: OwnedNft[], takerAddress: `0x${string}`) => {

  //@ts-expect-error
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signerUserA = provider.getSigner();

  // Setup the sample data for the swap...
  const CHAIN_ID = 137; // Polygon Mainnet

  const makerNfts = makerNftList.map((nft) => {
    return {
      tokenAddress: nft.contract.address,
      tokenId: nft.tokenId,
      type: nft.tokenType,
    }
  })

  const takerNfts = takerNftList.map((nft) => {
    return {
      tokenAddress: nft.contract.address,
      tokenId: nft.tokenId,
      type: nft.tokenType,
    }
  })
  const MATIC = {
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI contract address
    amount: '000000000000001000', // 1,000 DAI (DAI is 18 digits) -- amount to swap
    type: 'ERC20' as const,
  };

  // User A Trade Data
  const walletAddressUserA = userAddress;
  const assetsToSwapUserA = [...makerNfts];

  // User B Trade Data
  const walletAddressUserB = takerAddress;
  const assetsToSwapUserB = [...takerNfts];

  // ............................
  // Part 1 of the trade -- User A (the 'maker') initiates an order
  // ............................
  const nftSwapSdk = new NftSwap(provider, signerUserA, CHAIN_ID);
  // Note: For brevity, we assume all assets are approved for swap in this example.
  // See previous example on how to approve an asset.

  const order = nftSwapSdk.buildOrder(
    //@ts-expect-error
    assetsToSwapUserA,
    assetsToSwapUserB,
    walletAddressUserA
  );
  const signedOrder = await nftSwapSdk.signOrder(order, userAddress)
    .then((res) => {
      toast.success('Order signed successfully');
      return res
    })
  
  // Not so bad, right? We can arbitrarily add more assets to our swap without introducing additional complexity!
  return signedOrder
}

export const part2 = async (makerData: any) => {
  const signedOrder = makerData;
  //@ts-expect-error
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signerUserB = provider.getSigner();

  // Setup the sample data for the swap...
  const CHAIN_ID = 137; // Polygon Mainnet 

  // ............................
  // Part 2 of the trade -- User B (the 'taker') accepts and fills order from User A and completes trade
  // ............................
  const nftSwapSdk = new NftSwap(provider, signerUserB, CHAIN_ID);

  const fillTx = await nftSwapSdk.fillSignedOrder(signedOrder);

  const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash);
  console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
  return fillTxReceipt.transactionHash;
}
