import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { topbar } from "react-router-loading"
import { Nav } from './Nav'
import { Colors } from '../styles/Colors'
import { Link } from 'react-router-dom'
import { userActions } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { gql } from '@apollo/client'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import { useGetUser } from '../api/getUser'

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

const LogoLink = styled(Link)`
  font-size: 3rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-decoration: none;
`

const Logo = styled.img`
  width: 3rem;
  height: 3rem;
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

export const Header = () => {
  const dispatch = useDispatch()
  // const [getUser] = useLazyQuery(GET_USER)
  const { getUser } = useGetUser()
  const { address, isConnected } = useAccount()
  const navigate = useNavigate()


  const handleConnect = useCallback(async (newAccount: string | undefined) => {
    getUser({ variables: { walletAddress: newAccount } })
      .then(({ data }) => {
        if (data) {
          console.log('data', data)
          if (data.getUser === null) {
            dispatch(userActions.login({
              email: null,
              username: null,
              name: null,
              walletAddress: newAccount
            }))
            console.log('redirecting')
            navigate("/register")
          } else {
            dispatch(userActions.login({
              email: data.getUser.email,
              username: data.getUser.username,
              name: data.getUser.name,
              walletAddress: newAccount
            }))
          }
        }
      })
  }, [dispatch, getUser, navigate])

  useEffect(() => {
    if (isConnected) {
      handleConnect(address)
    } else {
      dispatch(userActions.logout())
    }
  }, [address, dispatch, handleConnect, isConnected])
  return (
    <Wrapper>
      <LogoLink to="/">
        <Logo alt="logo" src={logo}></Logo>
      </LogoLink>
      <Nav />
      <UserWrapper>
        <ConnectKitButton />
      </UserWrapper>
    </Wrapper>
  )
}