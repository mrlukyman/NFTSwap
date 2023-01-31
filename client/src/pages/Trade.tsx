import React, { useEffect, useState } from 'react'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import config from '../config.json'
import styled from 'styled-components'
import { TradingPanel } from '../components/TradingPanel'
import { Header } from '../components/Header'
import { Container, Text } from '../styles/GlobalStyles'
import { NftTradingList } from '../components/NftTradingGrid'
import { useSelector } from 'react-redux'

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TradingPanelWrapper = styled(Container)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Trade = () => {
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  const [senderList, setSenderList] = useState<OwnedNft[]>([])
  const [receiverList, setReceiverList] = useState<OwnedNft[]>([])

  const tradeReceiver = "0xcd92D0e9CCCc52337F78f08c1Af4237624f57c0D"

  useEffect(() => {
    const main = async () => {
      if (isLoggedin) {
        const sender = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
        const receiver = isLoggedin ? await alchemy.nft.getNftsForOwner(tradeReceiver) : { ownedNfts: [] }
        setSenderList(sender.ownedNfts)
        setReceiverList(receiver.ownedNfts)
      }
    }
    main()
  }, [isLoggedin, walletAddress])
  return (

    <Container>
      <Header />
      {isLoggedin ? (
        <Wrapper>
          <NftTradingList targetWalletAddressList={senderList} />
          <TradingPanel />
          <NftTradingList targetWalletAddressList={receiverList} />
        </Wrapper>
      )
        : (
          <TradingPanelWrapper>
            <Text>Please connect your wallet</Text>
          </TradingPanelWrapper>
        )
      }
    </Container>
  )
}
