import React from 'react';
import styled from 'styled-components';
import { SectionTitle, Blur } from './styles/GlobalStyles';
import { Text } from './styles/GlobalStyles';
import supported_wallets from './assets/supported_wallets.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const TextGradient = styled(Text)`
  background: linear-gradient(90.13deg, #FFFFFF 0%, #F81DFB 99.96%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 600;
`

const Image = styled.img`
  width: 100%;
  height: auto;
  margin: 0rem 0 5rem 0;
`

export const SupportedWallets = () => {
  return (
      <Wrapper>
        <Blur />
        <TextGradient>Trade with world's most trusted and fastest wallets</TextGradient>
        <SectionTitle>Wallets We Support</SectionTitle>
        <Image src={supported_wallets} />
      </Wrapper>
  );
}