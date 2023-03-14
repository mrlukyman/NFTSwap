import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { Button, Title } from '../styles/GlobalStyles'
import nft_trade from '../assets/trade_interface.png'
import { Link } from 'react-router-dom'
import Tilt from 'react-parallax-tilt';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 5rem 0 20rem 0;
  text-align: center;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex-direction: ;
  width: 100%;
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
  width: 60%;
  height: auto;
`


export const TradeSection = () => {
  return (
    <Wrapper>
      <Title style={{ float: 'right' }}>Try our trading interface!</Title>
      <Tilt perspective={100000}>
        <Image alt="nfts" src={nft_trade}></Image>
      </Tilt>
      <TextWrapper>
        <Link to='/trade'>
          <HeroButton>Trade NFTs</HeroButton>
        </Link>
      </TextWrapper>
    </Wrapper>

  )
}