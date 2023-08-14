import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { topbar } from "react-router-loading"
import { Nav } from './Nav'
import { Colors } from '../styles/Colors'
import { Link } from 'react-router-dom'
import { login, logout } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { gql } from '@apollo/client'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { ProfileSearch } from "./ProfileSearch";
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import { useGetUser } from '../api/hooks/useGetUser'
import { useGetUserIncommingOffers } from '../api/hooks/useGetUserIncommingOffers'
import { CgArrowsExchange, CgMathPercent, CgProfile } from 'react-icons/cg'
import { BiWallet } from "react-icons/bi"

enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

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
  height: 2rem;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const TradeIcon = styled(CgArrowsExchange)`
  width: 2.5rem;
  height: 2.5rem;
  color: #fff;
  margin-right: 1rem;
`

const WalletIcon = styled(BiWallet)`
  width: 2rem;
  height: 2rem;
  color: #fff;
  margin-right: 1rem;
`

const ProfileIcon = styled(CgProfile)`
  width: 2rem;
  height: 2rem;
  color: #fff;
  margin-right: 1rem;
`

const TradeIconContainer = styled.div`
  position: relative;
`

const TradeIconBadge = styled.div`
  width: 0.7rem;
  height: 0.7rem;
  background: #02ec16;
  border-radius: 50%;

  position: absolute;
  top: 1px;
  right: 0.86rem;
`

export const Header = () => {
  const dispatch = useDispatch()
  const { address, isConnected } = useAccount()
  const { getUser } = useGetUser(address)
  const navigate = useNavigate()
  const [incommingOffers, setIncommingOffers] = useState<any[]>([])

  const { data, loading, error } = useGetUserIncommingOffers(address as `0x${string}`)


  const handleConnect = useCallback((newAccount: `0x${string}` | undefined) => {
    getUser({ variables: { walletAddress: newAccount } })
      .then(({ data }) => {
        if (data) {
          if (data.getUser !== null) {
            dispatch(login({
              email: data.getUser.email,
              username: data.getUser.username,

              walletAddress: newAccount
            }))
          } else {
            console.log("no user found, redirecting to register")
            dispatch(login({
              email: null,
              username: null,

              walletAddress: newAccount
            }))
            navigate("/register")
          }
        } else {
          console.log("no user found, redirecting to register")
          dispatch(login({
            email: null,
            username: null,
            name: null,
            walletAddress: newAccount
          }))
          navigate("/register")
        }
      })
  }, [dispatch, getUser, navigate])

  useEffect(() => {
    if (isConnected) {
      handleConnect(address)
      setIncommingOffers(data?.getUserIncommingOffers?.filter((offer: any) => offer.status === OfferStatus.PENDING))
    } else {
      dispatch(logout())
    }
  }, [address, data, dispatch, handleConnect, isConnected])

  return (
    <Wrapper>
      <LogoLink to="/">
        <Logo alt="logo" src={logo}></Logo>
      </LogoLink>
      {/* <Nav /> */}
      <UserWrapper>
        {isConnected
          ?
          <>
            <TradeIconContainer>
              <Link to="/trade">
                <TradeIcon />
                {incommingOffers?.length > 0 ? <TradeIconBadge /> : null}
              </Link>
            </TradeIconContainer>
            <Link to="/profile">
              <ProfileIcon />
            </Link>
          </>
          : null

        }
        <ConnectKitButton />
      </UserWrapper>
    </Wrapper>
  )
}
