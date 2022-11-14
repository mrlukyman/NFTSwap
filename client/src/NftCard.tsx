import React from 'react';
import styled from 'styled-components';
import { Colors } from './styles/Colors';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${Colors.cardBackground};
  backdrop-filter: blur(10px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 15px;
  height: 34rem;
  width: 24.5rem;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  flex: 1;
  align-items: space-between;
  justify-content: space-between;
`

const Image = styled.img`
  flex: 1;
  //height: 22.5rem;
  object-fit: cover;
  border-radius: 15px;
  aspect-ratio: 1/1;
`

const BottomPartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 2rem 1rem 0 1rem;
  flex: 1;
`

const AuthorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AuthorImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 10px;
`

const Title = styled.p`
  font-size: 25px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.3rem 0;
`

const AuthorName = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
`

const AtuthorNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-basis: 100%;
`

// const Sale = styled.p`
//   font-size: 16px;
//   font-weight: 400;
//   color: #fff;
//   margin: 0;
// `

const PriceInEth = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`
const PriceInEur = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  margin: 0;
`

// const BuyButton = styled.button`
//   height: 3.7rem;
//   background: rgba(248, 29, 251, 0.05);
//   border: 1px solid #F81DFB;
//   color: #fff;
//   font-size: 14px;
//   font-weight: 600;
// `

type Props = {
  imgSrc: string | undefined
  authorImgSrc: string | undefined
  title: string
  priceInEth: string | undefined
  priceInEur: string
}

export const NftCard = (props: Props) => {
  return (
    <Card>
      <Wrapper>
        <Image src={props.imgSrc} />
        <BottomPartWrapper>
          <AuthorWrapper>
            <AuthorImage src={props.authorImgSrc} />
            <AtuthorNameWrapper>
              <Title>{props.title}</Title>
            </AtuthorNameWrapper>
          </AuthorWrapper>
          <InfoWrapper>
            <PriceWrapper>
              <PriceInEth>{props.priceInEth} ETH</PriceInEth>
              <PriceInEur>({props.priceInEur}€)</PriceInEur>
            </PriceWrapper>
          </InfoWrapper>
          {/* <BuyButton>Buy Now</BuyButton> */}
        </BottomPartWrapper>
      </Wrapper>
    </Card>
  );
}