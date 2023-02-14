import styled from 'styled-components';
import { FaEthereum } from 'react-icons/fa'
import { SmallText, MediumText } from '../styles/GlobalStyles'
import { nftListType } from '../types/basicTypes'

const Card = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 1rem;
  position: relative;
  &:hover{
    cursor: pointer;
    ${({ interactive }: nftListType) => interactive === true && ('transform: translateY(-0.4rem); transition: transform 0.2s ease-in-out;')}
  }
`

const Image = styled.img`
  flex: 1;
  object-fit: cover;
  border-radius: 1rem;
  aspect-ratio: 1/1;
  overflow: hidden;

`

const Video = styled.video`
  flex: 1;
  object-fit: cover;
  border-radius: 1rem;
  aspect-ratio: 1/1;
`

const Shadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 1rem;
  background: linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%);
`

const BottomPartWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  padding-bottom: 1rem;
  z-index: 1;
  padding-left: 1rem;
`

const PriceInEth = styled(SmallText)`
  margin: 0;
  display: flex;
  align-items: center;
`

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
`

type Props = {
  imgSrc: string | undefined
  title: string | undefined
  priceInEth: string | undefined
  interactive?: boolean
  showShadow?: boolean
}

export const NftCard = ({ imgSrc, title, priceInEth, interactive, showShadow }: Props) => {
  return (
    <Card interactive={interactive}>
      {showShadow === false ? null : <Shadow />}
      {
        imgSrc?.includes('mp4')
          ?
          <Video src={imgSrc} autoPlay loop muted />
          :
          <Image src={imgSrc?.includes('ipfs')
            ?
            imgSrc.replace('ipfs://', 'https://ipfs.io/ipfs/')
            :
            imgSrc}
          />
      }
      <BottomPartWrapper>
        <MediumText>{title}</MediumText>
        <PriceWrapper>
          {priceInEth &&
            <>
              <PriceInEth>
                floor pice: {priceInEth}
              </PriceInEth>
              <FaEthereum />
            </>
          }
        </PriceWrapper>
      </BottomPartWrapper>
    </Card>
  )
}