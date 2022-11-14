import React from "react"
import { Header } from '../Header';
import { NftList } from "../NftList";
import { Container } from '../styles/GlobalStyles';

export const Profile = () => {
  return (
    <Container>
      <Header />
      <NftList />
    </Container>
  )

}