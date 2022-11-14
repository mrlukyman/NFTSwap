import React from 'react';
import { NftList } from '../NftList';
import { Header } from '../Header';
import { Hero } from '../Hero';
import { SupportedWallets } from '../SupportedWallets';
//import { Trade } from './Trade';
import { Container } from '../styles/GlobalStyles';

export const Home = () => {
  return (
    <Container>
      <Header />
      <Hero />
      <SupportedWallets />
    </Container>
  );
}
