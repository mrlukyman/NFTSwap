import { Header } from '../components/Header'
import { NftList } from "../components/NftList"
import { Container, SectionTitle } from '../styles/GlobalStyles'
import { Text } from '../styles/GlobalStyles'
import { useSelector } from 'react-redux'
import { Form } from '../components/Form'

export const Profile = () => {
  const username = useSelector((state: any) => state.user.user.username)
  const name = useSelector((state: any) => state.user.user.name)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  return (
    <Container>
      <Header />
      <SectionTitle>Profile</SectionTitle>
      {isLoggedin ? (
        <>
          <Text>{name}</Text>
          <Text>@{username}</Text>
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
