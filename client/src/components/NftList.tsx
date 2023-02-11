import { useCallback, useEffect, useState } from 'react'
import { NftCard } from './NftCard'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import styled from 'styled-components'
import { useLoadingContext } from 'react-router-loading'
import config from '../config.json'
import { useSelector } from 'react-redux'
import { nftListType } from '../types/basicTypes'

const Wrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-auto-rows: minmax(0px, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
`

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

export const NftList = ({ interactive, nftList }: nftListType) => {
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([]);
  const loadingContext = useLoadingContext();

  const [isLoading, setIsLoading] = useState(true);

  const getNfts = useCallback(async () => {
    const nfts = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
    nftList
      ?
      setListOfNfts(nftList)
      :
      setListOfNfts(nfts.ownedNfts);
    setIsLoading(false);
  }, [isLoggedin, nftList, walletAddress])

  useEffect(() => {
    setIsLoading(true);
    getNfts();
    setIsLoading(false);
    loadingContext.done();
  }, [getNfts, loadingContext])

  console.log(listOfNfts)
  return (
    <Wrapper>
      {
        isLoading ? <p>loading</p> :
          listOfNfts?.map((nft: OwnedNft) => (
            nft.rawMetadata && nft.tokenId !== "0"
              ? (
                <>
                  <NftCard
                    interactive={interactive}
                    key={nft.tokenId}
                    imgSrc={nft.rawMetadata.image}
                    title={nft.title}
                    priceInEth="0.0032"
                  />
                </>
              )
              : null
          ))}
    </Wrapper>
  )
}