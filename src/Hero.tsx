import React from 'react';
import styled from 'styled-components';
import { Button, LightText, Title } from './styles/GlobalStyles';
import nft_image from './assets/hero_nfts.png';
import milky_way from './assets/milky_way.png';


const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin: 5rem 0 20rem 0;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex: 1;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1;
`

const HeroButton = styled(Button)`
  height: 3.7rem;
  background: rgba(248, 29, 251, 0.05);
  border: 1px solid #F81DFB;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 2rem 0 0;
  width: 15rem;
`

const Image = styled.img`
  width: 40%;
  height: auto;
`

const AbsoluteImage = styled.img`
  position: absolute;
  width: 100%;
  height: auto;
  top: 32rem;
  left: 0;
  z-index: -1;
`

export const Hero = () => {
  return (
    <>
      <Wrapper>
        <TextWrapper>
          <Title>Trade your NFTs with other people</Title>
          <LightText>NFTswap lets you trade your NFTs with outher people fast and semlessly</LightText>
          <ButtonWrapper>
            <HeroButton>Trade</HeroButton>
            <HeroButton>Offer</HeroButton>
          </ButtonWrapper>
        </TextWrapper>
        <Image alt="nfts" src={nft_image}></Image>
      </Wrapper>
      <AbsoluteImage alt="milky way" src={milky_way}></AbsoluteImage>
    </>
  )
}