import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { topbar } from "react-router-loading"
import { Nav } from './Nav'
import { Colors } from '../styles/Colors'
import { Link } from 'react-router-dom'
import { userActions } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { gql, useLazyQuery } from '@apollo/client'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

topbar.config({
  autoRun: true,
  barThickness: 5,
  barColors: {
    0: '#3a0528b0',
    .3: '#a91573af',
    1.0: Colors.primary,
  },
  shadowBlur: 10,
  shadowColor: 'pink',
  className: 'topbar'
})

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  height: 5rem;
  margin: 1rem 0 3rem 0;
`

const Logo = styled(Link)`
  font-size: 3rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-decoration: none;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const GET_USER = gql`
  query GetUser($walletAddress: String!) {
    getUser(walletAddress: $walletAddress) {
      email
      name
      username
    }
  }
`

enum LoginState {
  NOT_LOGGED_IN,
  NOT_REGISTERED,
  REGISTERED,
}

export const Header = () => {
  const dispatch = useDispatch()

  const [getUser] = useLazyQuery(GET_USER)

  const { address, isConnected } = useAccount()

  const handleConnect = useCallback(async (newAccount: any) => {
    console.log('handleConnect', newAccount)
    getUser({ variables: { walletAddress: newAccount } })
      .then(({ data }) => {
        if (data) {
          console.log('data', data)
          if (data.getUser === null) {
            // setLoginState(LoginState.NOT_REGISTERED)
            dispatch(userActions.login({
              email: null,
              username: null,
              name: null,
              walletAddress: newAccount
            }))
          } else {
            // setLoginState(LoginState.REGISTERED)
            dispatch(userActions.login({
              email: data.getUser.email,
              username: data.getUser.username,
              name: data.getUser.name,
              walletAddress: newAccount
            }))
          }
        }
      })
  }, [dispatch, getUser])

  useEffect(() => {
    if (isConnected) {
      handleConnect(address)
    }
  }, [address, handleConnect, isConnected])
  return (
    <Wrapper>
      <Logo to="/">NFTswap</Logo>
      <Nav />
      <UserWrapper>
        <ConnectKitButton showBalance />
      </UserWrapper>
    </Wrapper>
  )
}