import { useCallback, useEffect, useState } from 'react'
import { NftCard } from './NftCard'
import { Alchemy, Network, OwnedNft } from "alchemy-sdk"
import styled from 'styled-components'
import { useLoadingContext } from 'react-router-loading'
import config from '../config.json'
import { useSelector } from 'react-redux'
import { nftListType } from '../types/basicTypes'

//add types
const sizeOptions: any = { //TODO: type this better
  small: '8',
  medium: '18',
  large: '20',
}

const Wrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-auto-rows: minmax(0px, 1fr);
  grid-template-columns: ${(
  { size, elementsPerRow }: { size: string, elementsPerRow: number | string }) =>
    `
      repeat(${elementsPerRow}, 
      minmax(${sizeOptions[size]}rem, 1fr))
    `
  };
  @media (max-width: 1740px) {
    grid-template-columns: ${(
    { size }: { size: string }) =>
    `
      repeat(auto-fill, 
      minmax(${size === 'small' ? 8 : 12}rem, 1fr))
    `
  }}
  @media (max-width: 1424px) {
    grid-template-columns: ${(
    { size }: { size: string }) =>
    `
      repeat(auto-fill, 
      minmax(${size === 'small' ? 6 : 10}rem, 1fr))
    `
  }}
  @media (max-width: 687px) {
    grid-template-columns: ${(
    { size }: { size: string }) =>
    `
      repeat(auto-fill, 
      minmax(${size === 'small' ? 3 : 10}rem, 1fr))
    `
  }}

`

const Placeholder = styled.div`
  display: flex;
  flex: 1;
  background: #ffffff18;
  border-radius: 1rem;
`

const settings = {
  apiKey: config.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(settings)

export const NftList = ({ interactive, nftList, size, showShadow, elementsPerRow }: nftListType) => {
  const walletAddress = useSelector((state: any) => state.user.user.walletAddress)
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)

  const [listOfNfts, setListOfNfts] = useState<OwnedNft[]>([]);
  const loadingContext = useLoadingContext();

  const [isLoading, setIsLoading] = useState(true);

  const getNfts = useCallback(async () => {
    const nfts = isLoggedin ? await alchemy.nft.getNftsForOwner(walletAddress) : { ownedNfts: [] }
    nftList
      ?
      setListOfNfts(nftList.filter((nft: OwnedNft) => nft.tokenId !== "0"))
      :
      setListOfNfts(nfts.ownedNfts.filter((nft: OwnedNft) => nft.tokenId !== "0"));
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
    <>
      <Wrapper size={size || 'medium'} elementsPerRow={elementsPerRow || 'auto-fill'}>
        {isLoading ? <p>loading</p> :
          listOfNfts?.map((nft: OwnedNft) => (
            nft.rawMetadata && nft.tokenId !== "0"
              ? (
                <>
                  <NftCard
                    showShadow={showShadow}
                    interactive={interactive}
                    key={nft.tokenId}
                    imgSrc={nft.rawMetadata.image}
                    title={size === 'small' ? undefined : nft.title}
                    priceInEth={size === 'small' ? undefined : '0.1'}
                  />
                </>
              )
              : null
          ))
        }
        {
          showShadow === false
            ? Array.from(Array(10 - listOfNfts.length).keys()).map((i) => (
              <Placeholder key={i} />
            ))
            : listOfNfts.length < 10 && listOfNfts.length > 0 && interactive
              ? Array.from(Array(9 - listOfNfts.length).keys()).map((i) => (
                <Placeholder key={i} />
              ))
              : null
        }

      </Wrapper>
    </>
  )
}