import styled from 'styled-components';
import { FaEthereum } from 'react-icons/fa'
import { Text } from '../styles/GlobalStyles'

const Card = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  max-width: 25rem;
  flex-direction: column;
  border-radius: 16px;
  margin-right: 1rem;
  position: relative;
`

const Image = styled.img`
  flex: 1;
  object-fit: cover;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  
`

const Shadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  border-radius: 16px;

  background: linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%);
`

const Video = styled.video`
  flex: 1;
  object-fit: cover;
  border-radius: 16px;
  width: 100%;
  height: 100%;
`

const BottomPartWrapper = styled.div`
  position: absolute;
  gap: 2px;
  bottom: 0px;
  padding-bottom: 12px;
  z-index: 1;
  padding-left: 16px;
`

const PriceInEth = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
`

type Props = {
  imgSrc: string | undefined
  title: string
  priceInEth: string | undefined
}

export const NftCard = ({ imgSrc, title, priceInEth }: Props) => {
  return (
    <Card>
      <Shadow />
      {imgSrc?.includes('mp4') ? <Video src={imgSrc} autoPlay loop muted /> : <Image src={imgSrc} />}
      <BottomPartWrapper>
        <Text>{title}</Text>
        <PriceInEth>
          {priceInEth}
          <FaEthereum />
        </PriceInEth>
      </BottomPartWrapper>
    </Card>
  );
}