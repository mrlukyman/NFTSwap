import { Header } from '../components/Header'
import { NftList } from "../components/NftList"
import { Container, SectionTitle } from '../styles/GlobalStyles'
import { Text } from '../styles/GlobalStyles'
import { useSelector } from 'react-redux'
import { Form } from '../components/Form'

export const Profile = () => {
  const username = useSelector((state: any) => state.user.user.username)
  const name = useSelector((state: any) => state.user.user.name)
  const email = useSelector((state: any) => state.user.user.email)
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  return (
    <Container>
      <Header />
      <SectionTitle>Profile</SectionTitle>
      {isLoggedin ? (
        <>
          <Text>Username: {username}</Text>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
          <Text>Wallet Address: {walletAddress}</Text>
        </>
      ) : (
        <Text>Please login to view your profile</Text>
      )}
      {
        username === null && (
          <Form />
        )
      }
      <NftList />
    </Container>
  )
}
