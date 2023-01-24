import React from 'react';
import { NftList } from '../components/NftList';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
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
