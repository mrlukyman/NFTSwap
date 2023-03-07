import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Alchemy, Network, OwnedNft, AlchemyProvider, AlchemyConfig } from "alchemy-sdk"
import Select from 'react-select'
import { NftSwap } from '@traderxyz/nft-swap-sdk'
import { NftList } from './NftList'
import config from '../config.json'
import { Button, MediumText, Text, Title } from '../styles/GlobalStyles'
import { SmallText } from '../styles/GlobalStyles'
import { Colors } from '../styles/Colors'
import { ProfileSearch } from './ProfileSearch'
import { receiverType } from '../types/basicTypes'
import { useDispatch } from 'react-redux'
import { removeReceiverInfo } from '../store/receiverSlice'
import { useSigner } from 'wagmi'
import signer, { ethers } from 'ethers'
import ts from 'typescript'

// From your app, provide NftSwap the web3 provider, signer for the user's wallet, and the chain id.


const Wrapper = styled.div`
  display: flex;
  flex: 1;
  background: ${Colors.cardBackground};
  border-radius: 1rem;
  padding: 1rem;
  max-height: content;
  position: relative;
  height: 85vh;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.4);
`

const NftListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 0 0 1rem 1rem;
  margin-right: 1rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const TrdingPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TradingPanelWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: row;
`

const TradeButton = styled(Button)`
  background: ${Colors.buttonBackground};
  width: 10rem;
  height: 3rem;
  transition: 0.1s ease-in;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    background: ${Colors.buttonBackground};
  }
`

const SelectButton = styled(Button)`
  flex: 1;
  height: 3rem;
  margin: 0 0 0.5rem 0;
  border-radius: 0.5rem 0.5rem 0 0;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #ffffff3d;
  &:hover {
    box-shadow: none;
  }
  &:nth-child(2) {
    border-radius: 0;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 100%);
  }
  &:last-child {
    border-radius: 0 0.5rem 0.5rem 0;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.06)  0%, rgba(255, 255, 255, 0.15) 100%);
  }
  &:nth-child(2):hover {
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.06) 100%);
  }
  &:last-child:hover {
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.06)  0%, rgba(255, 255, 255, 0.3) 100%);
  }
`

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 0.5rem 0;
`

const GoBackButton = styled(Button)`
  background: linear-gradient(90deg,rgba(255, 255, 255, 0.06)  0%, rgba(255, 255, 255, 0.15) 100%);
  width: 3rem;
  height: 3rem;
  border: 1px solid #ffffff3d;
  border-radius: 0.5rem 0 0 0.5rem;
  color: #fff;
  font-size: 1.5rem;
  &:hover {
    box-shadow: none;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.06)  0%, rgba(255, 255, 255, 0.3) 100%);
  }
`

const MyNftList = styled.div`
  border-radius: 1rem;
  padding: 1rem;
  width: 50rem; // TODO: make this responsive
  margin: 0 0 2rem 0;
  background: ${Colors.cardBackground};
`

const TradeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ApproveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1rem 0 0 0;
`

const ApproveCheckbox = styled.input`
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 1rem 0 0;
`

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

enum NftListSwitch {
  MY_NFTS,
  THEIR_NFTS,
}

const alchemy = new Alchemy(settings)

export const TradingPanel = () => {
  const dispatch = useDispatch()
  const senderAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const isSubmitted = useSelector((state: any) => state.trade.isSubmitted)
  const receiverWalletAddress = useSelector((state: any) => state.trade.walletAddress)
  const receiverUsername = useSelector((state: any) => state.trade.username)

  // state for controlling which button is selected
  const [selected, setSelected] = useState(NftListSwitch.MY_NFTS)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([])
  const [listOfSenderNfts, setListOfSenderNfts] = useState<OwnedNft[]>([])
  const [listOfReceiverNfts, setListReceiverOfNfts] = useState<OwnedNft[]>([])

  const swap = async (userAddress: string) => {

    //@ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const CHAIN_ID = 137; //rinkeby

    const waves = {
      tokenAddress: "0x2953399124f0cbb46d2cbacd8a89cf0599974963",
      tokenId: "75521973858386990637520923633327380022055191100259040999208965571016910700545",
      type: "ERC1155",
    };
    const line = {
      tokenAddress: "0x2953399124f0cbb46d2cbacd8a89cf0599974963",
      tokenId: "92983535497502719937003952852199878577727116762198675210170283774041655345153",
      type: "ERC1155",
    };
    // User A Trade Data
    const walletAddressUserA = userAddress;
    const assetsToSwapUserA = [waves];

    // User B Trade Data
    // const walletAddressUserB = nftHolder;
    const assetsToSwapUserB = [line];
    // ............................
    // Part 1 of the trade -- User A (the 'maker') initiates an order
    // ............................

    // Initiate the SDK for User A.
    // Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
    const nftSwapSdk = new NftSwap(provider, signer, CHAIN_ID);

    // Check if we need to approve the NFT for swapping
    //@ts-expect-error
    const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(assetsToSwapUserA[0], walletAddressUserA);

    // If we do need to approve User A's CryptoPunk for swapping, let's do that now
    if (!approvalStatusForUserA.contractApproved) {
      //@ts-expect-error
      const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserA[0], walletAddressUserA);
      const approvalTxReceipt = await approvalTx.wait();
      console.log(`Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`);
    }

    // Create the order (Remember, User A initiates the trade, so User A creates the order)
    //@ts-expect-error
    const order = nftSwapSdk.buildOrder(assetsToSwapUserA, assetsToSwapUserB, walletAddressUserA);

    // Sign the order (User A signs since they are initiating the trade)
    const signedOrder = await nftSwapSdk.signOrder(order, walletAddressUserA);
    // Part 1 Complete. User A is now done. Now we send the `signedOrder` to User B to complete the trade.
    return signedOrder;
    // console.log({
    //   userAddress,
    //   userNFT,
    //   nftHolder,
    //   nftContract,
    // });
  }

  // export async function part2(userAddress, userNFT, makerData) {
  //   let signedOrder = makerData;

  //   const provider = new ethers.providers.Web3Provider(window.ethereum);

  //   const CHAIN_ID = 4; //rinkeby
  //   const Aether_420 = {
  //     tokenAddress: userNFT,
  //     tokenId: "420",
  //     type: "ERC721",
  //   };

  //   // User B Trade Data
  //   const walletAddressUserB = userAddress;
  //   const assetsToSwapUserB = [Aether_420];
  //   // ............................
  //   // Part 2 of the trade -- User B (the 'taker') accepts and fills order from User A and completes trade
  //   // ............................
  //   // Initiate the SDK for User B.
  //   const signer = provider.getSigner();
  //   console.log(signer);
  //   const nftSwapSdk = new NftSwap(provider, signer, CHAIN_ID);

  //   // Check if we need to approve the NFT for swapping
  //   const approvalStatusForUserB = await nftSwapSdk.loadApprovalStatus(assetsToSwapUserB[0], walletAddressUserB);
  //   // If we do need to approve NFT for swapping, let's do that now
  //   if (!approvalStatusForUserB.contractApproved) {
  //     const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserB[0], walletAddressUserB);
  //     const approvalTxReceipt = await approvalTx.wait();
  //     console.log(`Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`);
  //   }
  //   // The final step is the taker (User B) submitting the order.
  //   // The taker approves the trade transaction and it will be submitted on the blockchain for settlement.
  //   // Once the transaction is confirmed, the trade will be settled and cannot be reversed.
  //   const fillTx = await nftSwapSdk.fillSignedOrder(signedOrder, undefined, {
  //     gasLimit: "500000",
  //     // HACK(johnnrjj) - Rinkeby still has protocol fees, so we give it a little bit of ETH so its happy.
  //     value: ethers.utils.parseEther("0.01"),
  //   });
  //   console.log(fillTx);
  //   const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash);

  //   console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);

  //   return fillTxReceipt.transactionHash;
  // }

  const handleMyNftsClicked = useCallback(async () => {
    setSelected(NftListSwitch.MY_NFTS)
    const myNfts = isLoggedin ? await alchemy.nft.getNftsForOwner(senderAddress) : { ownedNfts: [] }
    setListOfNfts(myNfts.ownedNfts)
    console.log(myNfts.ownedNfts)
    // console.log(myNfts.ownedNfts)
  }, [isLoggedin, senderAddress])

  const handleTheirNftsClicked = useCallback(async () => {
    setSelected(NftListSwitch.THEIR_NFTS)
    const theirNfts = isLoggedin ? await alchemy.nft.getNftsForOwner(receiverWalletAddress) : { ownedNfts: [] }
    console.log(theirNfts.ownedNfts)
    setListOfNfts(theirNfts.ownedNfts)
  }, [isLoggedin, receiverWalletAddress])

  const handleBack = () => {
    dispatch(removeReceiverInfo())
    setSelected(NftListSwitch.MY_NFTS)
    setListOfSenderNfts([])
    setListReceiverOfNfts([])
  }

  const handleNftClicked = (nft: OwnedNft) => {
    if (selected === NftListSwitch.MY_NFTS) {
      if (listOfSenderNfts.some((nftInList) => nftInList.tokenId === nft.tokenId)) {
        return
      }
      setListOfSenderNfts([...listOfSenderNfts, nft])
    } else {
      if (listOfReceiverNfts.some((nftInList) => nftInList.tokenId === nft.tokenId)) {
        return
      }
      setListReceiverOfNfts([...listOfReceiverNfts, nft])
    }
  }

  useEffect(() => {
    handleMyNftsClicked()
  }, [handleMyNftsClicked])
  return (
    <>
      <Wrapper>
        {isSubmitted ? (
          <>
            <NftListWrapper>
              <SelectorWrapper>
                <GoBackButton onClick={handleBack}>&lt;</GoBackButton>
                <SelectButton onClick={handleMyNftsClicked}>My NFTs</SelectButton>
                <SelectButton onClick={handleTheirNftsClicked}>Their NFTs</SelectButton>
              </SelectorWrapper>
              {selected === NftListSwitch.MY_NFTS ? (
                <NftList handleNftClicked={handleNftClicked} size='medium' interactive />
              ) : (
                <NftList handleNftClicked={handleNftClicked} nftList={listOfNfts} size='medium' interactive />
              )
              }
            </NftListWrapper>

            <TradingPanelWrapper>
              <TrdingPanel>
                <Text>Your NFTs</Text>
                <MyNftList>
                  <NftList handleNftClicked={handleNftClicked} showShadow={false} nftList={listOfSenderNfts} interactive size='small' />
                  <ApproveWrapper>
                    <ApproveCheckbox type='checkbox' />
                    <MediumText>Approve trade</MediumText>
                  </ApproveWrapper>
                </MyNftList>
                <Text>{receiverUsername}'s NFTs</Text>
                <MyNftList>
                  <NftList handleNftClicked={handleNftClicked} showShadow={false} nftList={listOfReceiverNfts} interactive size='small' />
                </MyNftList>
                <TradeInfoWrapper>
                  <TradeButton onClick={() => swap(senderAddress)}>Trade</TradeButton>
                </TradeInfoWrapper>
              </TrdingPanel>
            </TradingPanelWrapper>
          </>
        ) : (
          <ProfileSearch />
        )}
      </Wrapper>
    </>
  )
}
