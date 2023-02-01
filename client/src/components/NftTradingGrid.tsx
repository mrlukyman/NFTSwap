import { OwnedNft } from "alchemy-sdk";
import styled from 'styled-components';
import { NftCard } from "./NftCard";

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
          nft.rawMetadata && nft.tokenId !== "0"
            ? <NftCard
              key={nft.tokenId}
              imgSrc={nft.rawMetadata.image}
              title={nft.title}
              priceInEth="1"
            />
            : null
        ))}
    </Wrapper>
  )
}