import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Input, SmallText, Text } from '../styles/GlobalStyles'
import { useDebounce } from 'use-debounce'
import Fuse from 'fuse.js'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { setReceiverInfo } from '../store/receiverSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Colors } from '../styles/Colors'
import { ProfileSearchCard } from './ProfileSearchCard'
import { useGetUserIncommingOffers } from '../api/hooks/useGetUserIncommingOffers'
import { NftList } from './NftList'
import { useGetUser } from '../api/hooks/useGetUser'
import { part2 } from '../api/swap'
import { format } from 'date-fns'

const GET_USERS = gql`
  query Query {
    getUsers {
      walletAddress
      username
    }
  }
`

const DECLINE_OFFER = gql`
  mutation Mutation($declineOfferId: Int!) {
    declineOffer(id: $declineOfferId) {
      id
    }
  }
`

const ACCEPT_OFFER = gql`
  mutation AcceptOffer($acceptOfferId: Int!) {
    acceptOffer(id: $acceptOfferId) {
      id
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
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
  padding: 1rem;
  border-radius: 1rem;
  background: ${Colors.cardBackground};
  position: relative;
`

const MyNftList = styled.div`
  border-radius: 1rem;
  padding: 1rem;
  width: 45rem; // TODO: make this responsive
  margin: 0 0 2rem 0;
  background: ${Colors.cardBackground};
`

const ShowTradeButton = styled(Button)`
  background: ${Colors.buttonBackground};
  width: 10rem;
  height: 3rem;
  transition: 0.1s ease-in;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 1rem;
  &:hover {
    background: ${Colors.buttonBackground};
  }
`

const TradeButton = styled(Button)`
  background: ${Colors.buttonBackground};
  width: 10rem;
  height: 3rem;
  transition: 0.1s ease-in;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 0 2rem;
  &:hover {
    background: ${Colors.buttonBackground};
  }
  &:first-child {
    margin-left: 0;
    background: transparent;
    border: none;
    width: max-content;
    &:hover {
      box-shadow: none;
    }
  }
`

const TradeButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  border-radius: 1rem;
`

const TradeInfo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0.6rem 0;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  color: #fff;
  text-align: center;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 0 1rem 0;
`

const TradeHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1rem 0;
`

export const ProfileSearch = () => {
  const address = useSelector((state: any) => state.user.user.walletAddress)
  const dispatch = useDispatch()
  const [receiver, setReceiver] = useState('')
  const [debouncedReceiver] = useDebounce(receiver, 500)
  const [users, setUsers] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [makerUsername, setMakerUsername] = useState<string>('')
  const [incommingOffers, setIncommingOffers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)


  const [getUsers] = useLazyQuery(GET_USERS)
  const getUserIncommingOffers = useGetUserIncommingOffers(address)
  const { getUser } = useGetUser(getUserIncommingOffers?.data?.getUserIncommingOffers[0]?.makerWalletAddress) //TODO: need to store multiple usernames
  const [declineOffer] = useMutation(DECLINE_OFFER)
  const [acceptOffer] = useMutation(ACCEPT_OFFER)

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

  const handleTradeAccept = async (makerData: any, id: number) => {
    setLoading(true)
    const tradeHash = part2(makerData)
      .then((res) => {
        acceptOffer({
          variables: {
            acceptOfferId: id
          }
        })
        setLoading(false)
        alert(`🎉 🥳 Order filled. TxHash: ${tradeHash}`)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleTradeDecline = (declineOfferId: number) => {
    // setIncommingOffers(incommingOffers.filter((offer: any) => parseInt(offer.id) !== declineOfferId))
    console.log(incommingOffers)
    declineOffer({
      variables: {
        declineOfferId
      }
    })
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    let result = fuse.search(debouncedReceiver).map(user => user.item)
    setSearchResults(result)
  }, [debouncedReceiver, fuse])

  useEffect(() => {
    getAddresses()
    getMakerUsername()
    const nextList = getUserIncommingOffers?.data.getUserIncommingOffers
    const reversedList = [...nextList].reverse()
    setIncommingOffers(reversedList)
  }, [getAddresses, getMakerUsername, getUserIncommingOffers?.data.getUserIncommingOffers])

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
      {showSearch ? (
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
      ) : (
        <TradeButtonWrapper>
          <ShowTradeButton onClick={() => setShowSearch(true)}>Create trade</ShowTradeButton>
        </TradeButtonWrapper>
      )
      }
      {incommingOffers?.map((offer: any, idx: number) => {
        return (
          <>
            <TradeWrapper>
              {offer.status === 'ACCEPTED' || offer.status === 'REJECTED' ?
                <>
                  <Overlay />
                  <TradeInfo style={offer.status === 'ACCEPTED' ? { background: 'green' } : { background: '#000' }} >
                    {offer.status === 'ACCEPTED' ? <Text>Trade accepted</Text> : <Text>Trade rejected</Text>}
                  </TradeInfo>
                </>
                : null
              }
              <TradeHeaderWrapper>
                <Text>{makerUsername} offered you a trade</Text>
                {/* format this date: 2023-03-13T22:34:12.021Z */}
                <SmallText>{format(Date.parse(offer.createdAt), "dd.MM.yy")} at {format(Date.parse(offer.createdAt), "hh:mm aaa")}</SmallText>
              </TradeHeaderWrapper>
              <MyNftList>
                <Text>Your NFTs</Text>
                <NftList nftList={offer.takerNfts} size='small' interactive showShadow={false} />
              </MyNftList>
              <MyNftList>
                <Text>{makerUsername}'s NFTs</Text>
                <NftList nftList={offer.makerNfts} size='small' interactive showShadow={false} />
              </MyNftList>
              {offer.status === 'ACCEPTED' || offer.status === 'REJECTED' ? null :
                <TradeButtonWrapper>
                  <TradeButton onClick={() => handleTradeDecline(parseInt(offer.id))}>Reject</TradeButton>
                  <TradeButton onClick={() => handleTradeAccept(offer.makerData, parseInt(offer.id))}>Accept</TradeButton>
                </TradeButtonWrapper>
              }
            </TradeWrapper>
          </>
        )
      })
      }
    </Wrapper >
  )
}
