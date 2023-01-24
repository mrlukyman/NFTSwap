import React, { useEffect, useState } from 'react';
import { NftCard } from './NftCard';
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import styled from 'styled-components';
import { useLoadingContext } from 'react-router-loading';
import { Container } from '../styles/GlobalStyles';
import { asyncForEach } from '../api/asyncHelper';
import config from '../config.json';
import { TradingCard } from './TradingCard';

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)

const Wrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`

export const NftTradingList = () => {
  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([]);
  const loadingContext = useLoadingContext();

  useEffect(() => {
    const main = async () => {
      // Get all NFTs
      const nfts = await alchemy.nft.getNftsForOwner("effektsvk.eth")
      // const mappedNfts: Nft[] = []
      // console.log(nfts)
      // await asyncForEach(nfts.ownedNfts, async (nft: OwnedNft) => {
      //   const options = {method: 'GET', headers: {accept: 'application/json'}};
      //   const nftSales = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/tMAv6td0-2LUKzf9-hTghVryZtd9xsqc/getNFTSales?contractAddress=${"0x" + parseInt(nft.contract.address, 16)}&tokenId=${nft.tokenId}&startBlock=latest&startLogIndex=0&startBundleIndex=0&ascendingOrder=true&marketplace=seaport`, options)
      //     .then(response => response.json())
      //     .catch(err => console.error(err))

      //   mappedNfts.push({
      //     ...nft,
      //     price: nftSales.nftSales[0]?.price
      //   })
      // })
      setListOfNfts(nfts.ownedNfts);
      loadingContext.done();
    };
    main();
  }, [loadingContext])
  return (
    <Wrapper>
      {
        listOfNfts?.map((nft: OwnedNft) => (
          nft.rawMetadata

            ? <> <TradingCard
              imgSrc={nft.rawMetadata.image}
              priceInEur="1"
            />
              <TradingCard
                imgSrc={nft.rawMetadata.image}
                priceInEur="1"
              />
              <TradingCard
                imgSrc={nft.rawMetadata.image}
                priceInEur="1"
              />
              <TradingCard
                imgSrc={nft.rawMetadata.image}
                priceInEur="1"
              /></>
            : null
        ))}
    </Wrapper>
  )
}