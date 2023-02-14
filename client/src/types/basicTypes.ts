import { OwnedNft } from 'alchemy-sdk'

export type nftListType = {
  interactive?: boolean
  nftList?: OwnedNft[]
  size?: string
  showShadow?: boolean
  elementsPerRow?: number | string
}

export type receiverType = {
  receiver: string
}

export type userSearchType = {
  username: string
  walletAddress: string
}