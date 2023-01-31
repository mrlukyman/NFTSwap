import React from "react"
import styled from "styled-components"
import { SmallText } from "../styles/GlobalStyles"
import { Colors } from "../styles/Colors"

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 15px;
  width: 11rem;
  height: 18rem;
  background: ${Colors.cardBackground};
  margin: 0.5rem;

`

const Image = styled.img`
  flex: 1;
  object-fit: cover;
  border-radius: 15px;
  aspect-ratio: 1/1;
`

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
`

type Props = {
  title: string | undefined
  imgSrc: string | undefined
  priceInEur: string
}

export const TradingCard = (props: Props) => {
  return (
    <>
      <Card>
        <Image src={props.imgSrc} />
        <DataWrapper>
          <SmallText>{props.priceInEur}€</SmallText>
          <SmallText>{props.title}</SmallText>
        </DataWrapper>
      </Card>
    </>
  )
}