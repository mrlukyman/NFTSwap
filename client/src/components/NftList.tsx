import { useCallback, useEffect, useState } from 'react';
import { NftCard } from './NftCard';
import { Alchemy, Network, OwnedNft } from "alchemy-sdk";
import styled from 'styled-components';
import { useLoadingContext } from 'react-router-loading';
import config from '../config.json';
import { useSelector } from 'react-redux';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 2rem;
`

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

export const NftList = () => {
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([]);
  const loadingContext = useLoadingContext();

  const getNfts = useCallback(async () => {
    const nfts = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
    setListOfNfts(nfts.ownedNfts);
  }, [isLoggedin, walletAddress])

  useEffect(() => {
    getNfts();
    loadingContext.done();
  }, [getNfts, loadingContext])

  console.log(listOfNfts)
  return (
    <Wrapper>
      {
        listOfNfts?.map((nft: OwnedNft) => (
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