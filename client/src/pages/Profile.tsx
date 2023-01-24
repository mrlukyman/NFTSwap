import React from "react"
import { Header } from '../components/Header';
import { NftList } from "../components/NftList";
import { Container } from '../styles/GlobalStyles';
import { Text } from '../styles/GlobalStyles';

export const Profile = () => {
  const user = "effektsvk"
  return (
    <Container>
      <Header />
      <Text>User: {user}</Text>
      <NftList />
    </Container>
  )
}
