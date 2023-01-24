import React from 'react'
import styled from 'styled-components'
import { TradingPanel } from '../components/TradingPanel';
import { Header } from '../components/Header';
import { Container } from '../styles/GlobalStyles';
import { NftTradingList } from '../components/NftTradingGrid';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

`

export const Trade = () => {

  return (

    <Container>
      <Header />
      <Wrapper>
        <NftTradingList />
        <TradingPanel />
        <NftTradingList />
      </Wrapper>
    </Container>
  )
}
