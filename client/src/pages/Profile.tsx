import { Avatar } from 'connectkit'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { NftList } from "../components/NftList"
import { Container } from '../styles/GlobalStyles'
import { Text } from '../styles/GlobalStyles'
import profile_background from '../assets/profile_background.png'
import { Footer } from '../components/Footer'

const Username = styled(Text)`
  margin: 1rem 0;
`

const UserDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5rem 0;
  padding: 2rem;
  &::before {
    background: url(${profile_background});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    content: "";
    position: absolute;
    height: 20rem;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    filter: blur(10rem);
  }
`

export const Profile = () => {
  const username = useSelector((state: any) => state.user.user.username)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const address = useSelector((state: any) => state.user.user.walletAddress)

  return (
    <>
      <Container>
        <Header />
        {isLoggedin ? (
          <>
            <UserDataWrapper>
              <Avatar address={address} size={200} />
              <Username>@{username}</Username>
            </UserDataWrapper>
            <Text>Your NFTs</Text>
            <NftList size='large' />
          </>
        ) : (
          <Text>Please login to view your profile</Text>
        )}
      </Container>
      <Footer />
    </>
  )
}
