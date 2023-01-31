import React, { Provider, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../styles/Colors'
import { SmallText } from '../styles/GlobalStyles'
import { Button } from '../styles/GlobalStyles'
import { useSelector } from 'react-redux'
import config from '../config.json'
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk"
import { NftSwap } from '@traderxyz/nft-swap-sdk';
import detectEthereumProvider from '@metamask/detect-provider';
import { BaseProvider } from '@ethersproject/providers'

const Wrapper = styled.div`
  width: 10rem;
  height: 83vh;
  background: ${Colors.cardBackground};
  border-radius: 15px;
  padding: 1rem;
`

const TrdingPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  margin-right: 5px;
  align-items: center;
  flex: 1;
  justify-content: space-between;
`

const TradeButton = styled(Button)`
  background: ${Colors.buttonBackground};
  width: 10rem;
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  transition: 0.1s ease-in;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    height: 3.5rem;
    background: ${Colors.buttonBackground};
  }
`
const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

const { ethereum } = window




export const TradingPanel = () => {
  const username = useSelector((state: any) => state.user.user.username)
  const name = useSelector((state: any) => state.user.user.name)
  const email = useSelector((state: any) => state.user.user.email)
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [type, setType] = useState('')
  const [nft, setNft] = useState<OwnedNft>()

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([])

  // From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.
  // const chainId = 137 // for Polygon
  // const nftSwapSdk = new NftSwap(ethereum as unknown as BaseProvider, walletAddress, chainId)

  // const nftToSwapUserA = {
  //   tokenAddress: tokenAddress,
  //   tokenId: tokenId,
  //   type: 'ERC1155' as const,
  // }
  // const assetsToSwapUserA = [nftToSwapUserA]

  // const approve = async () => {
  //   const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(
  //     nftToSwapUserA,
  //     walletAddress
  //   );
  //   // If we do need to approve User A's CryptoPunk for swapping, let's do that now
  //   if (!approvalStatusForUserA.contractApproved) {
  //     const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
  //       nftToSwapUserA,
  //       walletAddress
  //     );
  //     const approvalTxReceipt = await approvalTx.wait();
  //     console.log(
  //       `Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x v4 (txHash: ${approvalTxReceipt.transactionHash})`
  //     );
  //   }
  // }


  useEffect(() => {
    const main = async () => {
      // Get all NFTs
      const nfts = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
      setListOfNfts(nfts.ownedNfts);
      setTokenAddress(nfts.ownedNfts[0].contract.address)
      setTokenId(nfts.ownedNfts[0].tokenId)
      setType(nfts.ownedNfts[0].tokenType)
      console.log(nfts.ownedNfts)
    };
    main()
  }, [isLoggedin, walletAddress])

  return (
    <Wrapper>
      <TrdingPanel>
        <TradeButton>Trade</TradeButton>
        <SmallText>Amount</SmallText>
      </TrdingPanel>
    </Wrapper>
  )
}
