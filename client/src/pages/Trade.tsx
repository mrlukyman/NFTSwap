import React, { useCallback, useEffect, useState } from 'react'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import config from '../config.json'
import styled from 'styled-components'
import { TradingPanel } from '../components/TradingPanel'
import { Header } from '../components/Header'
import { Container, Text } from '../styles/GlobalStyles'
import { useSelector } from 'react-redux'

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`

const TradingPanelWrapper = styled(Container)`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Trade = () => {
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  const receiver = useSelector((state: any) => state.user.user.walletAddress)

  return (
    <Container>
      <Header />
      {isLoggedin
        ?
        (
          <Wrapper>
            <TradingPanel />
          </Wrapper>
        )
        :
        (
          <TradingPanelWrapper>
            <Text>Please connect your wallet</Text>
          </TradingPanelWrapper>
        )
      }
    </Container>
  )
}
