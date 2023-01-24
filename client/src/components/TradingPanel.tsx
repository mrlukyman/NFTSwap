import React, { useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../styles/Colors'
import { SmallText } from '../styles/GlobalStyles'
import { Button } from '../styles/GlobalStyles'

const Wrapper = styled.div`
  width: 10rem;
  height: 83vh;
  background: ${Colors.cardBackground};
  border-radius: 15px;
  padding: 1rem;
`

const TrdingPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  margin-right: 5px;
  align-items: center;
  flex: 1;
  justify-content: space-between;
`

const TradeButton = styled(Button)`
  background: ${Colors.buttonBackground};
  width: 10rem;
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  transition: 0.1s ease-in;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    height: 3.5rem;
    background: ${Colors.buttonBackground};
  }
`

export const TradingPanel = () => {
  const [price, setPrice] = useState(0)
  return (
    <Wrapper>
      <TrdingPanel>
        <TradeButton>Trade</TradeButton>
        <SmallText>Amount: {price}</SmallText>
      </TrdingPanel>
    </Wrapper>
  )
}
