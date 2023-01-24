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
  background: ${Colors.cardBackground};
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

`
const Image = styled.img`
  flex: 1;
  object-fit: cover;
  border-radius: 15px;
  aspect-ratio: 1/1;
`

const Price = styled(SmallText)`

`

type Props = {
  imgSrc: string | undefined
  priceInEur: string
}

export const TradingCard = (props: Props) => {
  return (
    <>
      <Card>
        <Image src={props.imgSrc} />
        <Price>{props.priceInEur}€</Price>
      </Card>
    </>
  )
}