import { OwnedNft } from "alchemy-sdk";
import styled from 'styled-components';
import { TradingCard } from './TradingCard';

const Wrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex: 1;
`

interface Props {
  targetWalletAddressList: OwnedNft[]
}

export const NftTradingList = ({ targetWalletAddressList }: Props) => {
  return (
    <Wrapper>
      {
        targetWalletAddressList?.map((nft: OwnedNft) => (
          nft.rawMetadata
            ? <TradingCard
              title={nft.rawMetadata.name}
              imgSrc={nft.rawMetadata.image}
              priceInEur="1"
            />
            : null
        ))}
    </Wrapper>
  )
}