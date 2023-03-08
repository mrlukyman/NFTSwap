import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Input, SmallText, Text } from '../styles/GlobalStyles'
import { useDebounce } from 'use-debounce'
import Fuse from 'fuse.js'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import { receiverType } from '../types/basicTypes'
import { setReceiverInfo, removeReceiverInfo } from '../store/receiverSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Colors } from '../styles/Colors'
import { userSearchType } from '../types/basicTypes'
import { ProfileSearchCard } from './ProfileSearchCard'
import { useGetUserIncommingOffers } from '../api/hooks/useGetUserIncommingOffers'
import { NftList } from './NftList'
import { useGetUser } from '../api/hooks/useGetUser'
import { part2 } from '../api/swap'
import { useDeclineOffer } from '../api/hooks/useDeclineOffer'

const GET_USERS = gql`
  query Query {
    getUsers {
      walletAddress
      username
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem 0 0 0;
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

const TradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 0 0;
`

const MyNftList = styled.div`
  border-radius: 1rem;
  padding: 1rem;
  width: 45rem; // TODO: make this responsive
  margin: 0 0 2rem 0;
  background: ${Colors.cardBackground};
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

const TradeButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ProfileSearch = () => {
  const address = useSelector((state: any) => state.user.user.walletAddress)
  const dispatch = useDispatch()
  const [receiver, setReceiver] = useState('')
  const [debouncedReceiver] = useDebounce(receiver, 500)
  const [users, setUsers] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [makerUsername, setMakerUsername] = useState<string>('')
  const [tradeId, setTradeId] = useState<number>()

  const [getUsers] = useLazyQuery(GET_USERS)
  const getUserIncommingOffers = useGetUserIncommingOffers(address)
  const { getUser } = useGetUser(getUserIncommingOffers?.data.getUserIncommingOffers[0].makerWalletAddress)
  const { declineOffer } = useDeclineOffer(tradeId)

  const getMakerUsername = useCallback(async () => {
    getUser()
      .then((res) => {
        setMakerUsername(res.data.getUser.username)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [getUser])


  const getAddresses = useCallback(async () => {
    getUsers().then((res) => {
      if (res.data.getUsers) {
        setUsers(res.data.getUsers)
      }
    }).catch((err) => {
      console.log(err)
    })
  }, [getUsers])

  const fuse = useMemo(
    () =>
      new Fuse(users, {
        keys: ['username', 'walletAddress'],
        threshold: 0.3,
        distance: 100,
        includeScore: true,
        shouldSort: true,
        location: 0,
        useExtendedSearch: true,
        sortFn: function (a, b) {
          return a.score - b.score
        }
      }),
    [users]
  )

  const handleTradeAccept = async (makerData: any) => {
    const tradeHash = part2(makerData).then((res) => {
      tradeHash && alert(`🎉 🥳 Order filled. TxHash: ${tradeHash}`)
      //TODO: add accept offer mutation
    })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleTradeDecline = (id: any) => {
    setTradeId(id) //TODO: FIX THIS
    declineOffer()
    alert('Offer declined')
  }

  useEffect(() => {
    let result = fuse.search(debouncedReceiver).map(user => user.item)
    setSearchResults(result)
  }, [debouncedReceiver, fuse])

  useEffect(() => {
    getAddresses()
    getMakerUsername()
  }, [getAddresses, getMakerUsername])

  const handleAddressSubmit = (e: any, walletAddress: string, username: string) => {
    e.preventDefault()
    if (walletAddress) {
      dispatch(setReceiverInfo({ walletAddress: walletAddress, username: username }))
    } else {
      alert('Please enter a valid username or an address')
    }
  }
  return (
    <Wrapper>
      <AddressWrapper>
        <Text>Transfer Address</Text>
        <SmallText>Enter the username or the address of the user you want to trade with</SmallText>
        <FormWrapper>
          <Input
            type='text'
            placeholder='@username or 0x...'
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          {searchResults.map((result: any) => { //TODO: this should be Fuse.FuseResult<userSearchType> (it think) but it doesn't work
            if (result.walletAddress === address) {
              return null
            }
            return (
              <ProfileSearchCard
                key={result.walletAddress}
                handleAddressSubmit={(e: React.MouseEvent<HTMLElement>) =>
                  handleAddressSubmit(e, result.walletAddress, result.username)}
                username={result.username} walletAddress={result.walletAddress}
              />
            )
          })}
        </FormWrapper>
      </AddressWrapper>
      {getUserIncommingOffers.data.getUserIncommingOffers.filter((nft: any) => nft.status === 'PENDING').map((offer: any) => {
        return (
          <TradeWrapper>
            <MyNftList>
              <Text>{makerUsername} offered you a trade</Text>
              <Text>Your NFTs</Text>
              <NftList nftList={offer.takerNfts} size='small' interactive showShadow={false} />
            </MyNftList>
            <MyNftList>
              <Text>{makerUsername}'s NFTs</Text>
              <NftList nftList={offer.makerNfts} size='small' interactive showShadow={false} />
            </MyNftList>
            <TradeButtonWrapper>
              <TradeButton onClick={() => handleTradeAccept(offer.makerData)}>Accept</TradeButton>
              <TradeButton onClick={() => handleTradeDecline(offer.id)}>Decline</TradeButton>
            </TradeButtonWrapper>
          </TradeWrapper>
        )
      })
      }
    </Wrapper>
  )
}
