import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import Select from 'react-select'
import { NftList } from './NftList'
import config from '../config.json'
import { Button, MediumText, Text } from '../styles/GlobalStyles'
import { SmallText } from '../styles/GlobalStyles'
import { Colors } from '../styles/Colors'
import { ProfileSearch } from './ProfileSearch'
import { receiverType } from '../types/basicTypes'
import { useDispatch } from 'react-redux'
import { removeReceiverInfo } from '../store/receiverSlice'
import { swap, part2 } from '../api/swap'
import { NftSwap } from '@traderxyz/nft-swap-sdk'
import { gql, useMutation } from '@apollo/client'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const GET_USER_INCOMMING_OFFERS = gql`
  query Query($walletAddress: String!) {
    getUserIncommingOffers(walletAddress: $walletAddress) {
      id
      makerData
      makerNfts
      takerNfts
      status
    }
  }   
`

const CREATE_OFFER = gql`
  mutation Mutation($makerWalletAddress: String!, $takerWalletAddress: String!, $makerData: JSON!, $makerNfts: [JSON]!, $takerNfts: [JSON]!) {
    createOffer(makerWalletAddress: $makerWalletAddress, takerWalletAddress: $takerWalletAddress, makerData: $makerData, makerNfts: $makerNfts, takerNfts: $takerNfts) {
      makerData
      makerNfts
      takerNfts
    }
  }
`

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

const TradeListText = styled(Text)`
  margin: 0 0 1rem 0;
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
  const defaultWalletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const isSubmitted = useSelector((state: any) => state.trade.isSubmitted)
  const receiverWalletAddress = useSelector((state: any) => state.trade.walletAddress)
  const receiverUsername = useSelector((state: any) => state.trade.username)

  const [createOffer] = useMutation(CREATE_OFFER, {
    onCompleted: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // state for controlling which button is selected
  const [selected, setSelected] = useState(NftListSwitch.MY_NFTS)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([])
  const [listOfSenderNfts, setListOfSenderNfts] = useState<OwnedNft[]>([])
  const [listOfReceiverNfts, setListReceiverOfNfts] = useState<OwnedNft[]>([])

  const handleMyNftsClicked = useCallback(async () => {
    setSelected(NftListSwitch.MY_NFTS)
    const myNfts = isLoggedin ? await alchemy.nft.getNftsForOwner(defaultWalletAddress) : { ownedNfts: [] }
    setListOfNfts(myNfts.ownedNfts)
    console.log(myNfts.ownedNfts)
    // console.log(myNfts.ownedNfts)
  }, [isLoggedin, defaultWalletAddress])

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
        //remove nft from list
        setListOfSenderNfts(listOfSenderNfts.filter((nftInList) => nftInList.tokenId !== nft.tokenId))
        console.log(listOfSenderNfts)
      } else if (listOfReceiverNfts.some((nftInList) => nftInList.tokenId === nft.tokenId)) {

        setListReceiverOfNfts(listOfReceiverNfts.filter((nftInList) => nftInList.tokenId !== nft.tokenId))
      } else {
        setListOfSenderNfts([...listOfSenderNfts, nft])
      }
    } else {
      if (listOfReceiverNfts.some((nftInList) => nftInList.tokenId === nft.tokenId)) {
        setListReceiverOfNfts(listOfReceiverNfts.filter((nftInList) => nftInList.tokenId !== nft.tokenId))
      } else if (listOfSenderNfts.some((nftInList) => nftInList.tokenId === nft.tokenId)) {
        setListOfSenderNfts(listOfSenderNfts.filter((nftInList) => nftInList.tokenId !== nft.tokenId))
      } else {
        setListReceiverOfNfts([...listOfReceiverNfts, nft])
      }
    }
  }

  const handleSwap = async () => {
    swap(defaultWalletAddress, listOfSenderNfts, listOfReceiverNfts, receiverWalletAddress)
      .then((res) => {
        createOffer({
          variables: {
            makerWalletAddress: defaultWalletAddress,
            takerWalletAddress: receiverWalletAddress,
            makerData: res,
            makerNfts: listOfSenderNfts,
            takerNfts: listOfReceiverNfts,
          },
        })
        dispatch(removeReceiverInfo())
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    handleMyNftsClicked()
  }, [handleMyNftsClicked])

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
                <MyNftList>
                  <TradeListText>Your NFTs</TradeListText>
                  <NftList handleNftClicked={handleNftClicked} showShadow={false} nftList={listOfSenderNfts} interactive size='small' />
                </MyNftList>
                <MyNftList>
                  <TradeListText>{receiverUsername}'s NFTs</TradeListText>
                  <NftList handleNftClicked={handleNftClicked} showShadow={false} nftList={listOfReceiverNfts} interactive size='small' />
                </MyNftList>
                <TradeInfoWrapper>
                  <TradeButton onClick={handleSwap}>Trade</TradeButton>
                  {/* <TradeButton onClick={(handlePart2)}>Part2</TradeButton> */}
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
