import { OwnedNft } from 'alchemy-sdk'

export type nftListType = {
  interactive?: boolean
  nftList?: OwnedNft[]
}

export type receiverType = {
  receiver: string
}

export type userSearchType = {
  username: string
  walletAddress: string
}