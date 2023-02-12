import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Input, SmallText, Text } from '../styles/GlobalStyles'
import { useDebounce } from 'use-debounce'
import Fuse from 'fuse.js'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import { receiverType } from '../types/basicTypes'
import { setReceiverAddress, removeReceiverAddress } from '../store/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Colors } from '../styles/Colors'
import { userSearchType } from '../types/basicTypes'
import { ProfileSearchCard } from './ProfileSearchCard'


const GET_USERS = gql`
  query Query {
    getUsers {
      walletAddress
      username
    }
  }
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

const ButtonWrapper = styled.button`
  width: 100%;
  border: none;
  background: none;
`

export const ProfileSearch = () => {
  const address = useSelector((state: any) => state.user.user.walletAddress)
  const dispatch = useDispatch()
  const [receiver, setReceiver] = useState('')
  const [debouncedReceiver] = useDebounce(receiver, 500)
  const [users, setUsers] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])


  const [getUsers] = useLazyQuery(GET_USERS)

  const getAddresses = useCallback(async () => {
    getUsers().then((res) => {
      console.log(res.data.getUsers)
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

  useEffect(() => {
    let result = fuse.search(debouncedReceiver).map(user => user.item)
    setSearchResults(result)
  }, [debouncedReceiver, fuse])

  useEffect(() => {
    getAddresses()
  }, [getAddresses])

  const handleAddressSubmit = (e: any, walletAddress: string) => {
    e.preventDefault()
    console.log(walletAddress)
    if (walletAddress) {
      dispatch(setReceiverAddress(walletAddress))
    } else {
      alert('Please enter a valid username or an address')
    }
  }
  return (
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
            <ButtonWrapper onClick={(e: any) => handleAddressSubmit(e, result.walletAddress)}> {/* TODO: This shouldn't be wrapped in a button I think.. think of a way to add the on click event on the component */}
              <ProfileSearchCard key={result.walletAddress} username={result.username} walletAddress={result.walletAddress} />
            </ButtonWrapper>
          )
        })}
      </FormWrapper>
    </AddressWrapper>
  )
}
