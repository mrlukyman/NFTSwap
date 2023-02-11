import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client'
import { NftList } from './NftList'
import config from '../config.json'
import { Input } from '../styles/GlobalStyles'
import { Button } from '../styles/GlobalStyles'
import { SmallText, Text } from '../styles/GlobalStyles'
import { Colors } from '../styles/Colors'
import { getFragmentQueryDocument } from '@apollo/client/utilities'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  background: ${Colors.cardBackground};
  border-radius: 1rem;
  padding: 1rem;
  max-height: content;
  position: relative;
  height: 85vh;
`

const NftListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 1rem;
  margin-right: 1rem;
  // make the list scrollable
  overflow-y: scroll;
  // hide the scrollbar
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const TrdingPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 1rem;
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
  margin: 2rem 0 0 0;
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
  &:hover {
    box-shadow: none;
  }
  &:first-child {
    border-radius: 0.5rem 0 0 0.5rem;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 100%);
  }
  &:last-child {
    border-radius: 0 0.5rem 0.5rem 0;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0.06)  0%, rgba(255, 255, 255, 0.15) 100%);
  }
  &:first-child:hover {
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
  margin: 0.5rem 0 0.5rem 0;
`

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const FormWrapper = styled.form`
  display: flex;
  width: 30rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`


const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    width: 500,
    height: "3rem",
    color: "#0a0909",
    margin: "1rem 0 0 0",
    borderRadius: "1rem",
    border: "1px solid #f71dfb84",
    background: 'white',
    fontSize: "1rem",
  }),
}

const GET_USERS = gql`
  query Query {
    getUsers {
      walletAddress
      username
    }
  }
`

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

export const TradingPanel = () => {
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [type, setType] = useState('')
  const [nft, setNft] = useState<OwnedNft>()
  const [transferAddress, setTransferAddress] = useState('0xa6f7eC2379d06fE18d78db1789f612238c3a3b99')
  // state for controlling which button is selected
  const [selected, setSelected] = useState('MyNFTs') //TODO: make better handeling of this
  const [userAddresses, setUserAddresses] = useState<any[]>([ //TODO: make this work
    {
      value: "",
      label: "",
    },

  ])

  const { data, loading, error } = useQuery(GET_USERS)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([])

  const getAddresses = useCallback(async () => {
    if (data) {
      const addresses = data.getUsers.map((user: any) => {
        return {
          value: user.walletAddress,
          label: user.username,
        }
      })
      setUserAddresses(addresses)
    }
  }, [data])


  const getNfts = useCallback(async () => {
    if (isLoggedin) {
      const myNfts = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
      const theirNfts = isLoggedin ? await alchemy.nft.getNftsForOwner(transferAddress) : { ownedNfts: [] }
      selected === 'MyNFTs' ? setListOfNfts(myNfts.ownedNfts) : setListOfNfts(theirNfts.ownedNfts)
      setTokenAddress(myNfts.ownedNfts[0].contract.address)
      setTokenId(myNfts.ownedNfts[0].tokenId)
      setType(myNfts.ownedNfts[0].tokenType)
      console.log(myNfts.ownedNfts)
    }
  }, [isLoggedin, selected, transferAddress, walletAddress])

  const handleAddressSubmit = (e: any) => {
    e.preventDefault()
    setTransferAddress(e.target.value)
  }

  const handleMyNftsClicked = () => {
    setSelected('MyNFTs')
    getNfts()
  }

  const handleTheirNftsClicked = () => {
    setSelected('TheirNFTs')
    getNfts()
  }

  useEffect(() => {
    getAddresses()
    getNfts()
  }, [getAddresses, getNfts])

  return (
    <Wrapper>
      {transferAddress ? (
        <>
          <NftListWrapper>
            <SelectorWrapper>
              <SelectButton onClick={handleMyNftsClicked}>My NFTs</SelectButton>
              <SelectButton onClick={handleTheirNftsClicked}>Their NFTs</SelectButton>
            </SelectorWrapper>
            {selected === 'MyNFTs' ? (
              <NftList interactive />
            ) : (
              <NftList nftList={listOfNfts} interactive />
            )
            }
          </NftListWrapper>
          <TrdingPanel>
            <SmallText>Token Address</SmallText>
            <input
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />
            <SmallText>Token Id</SmallText>
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <SmallText>Type</SmallText>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <TradeButton>Trade</TradeButton>
          </TrdingPanel>
        </>
      ) : (
        <AddressWrapper>
          <Text>Transfer Address</Text>
          <SmallText>Enter the address of the wallet you want to trade with</SmallText>
          <FormWrapper onSubmit={handleAddressSubmit}>
            <Select
              styles={customStyles}
              value={transferAddress}
              options={userAddresses}
              placeholder='0x...'
            />
            <TradeButton type='submit'>Trade</TradeButton>
          </FormWrapper>
        </AddressWrapper>
      )}
    </Wrapper>
  )
}
