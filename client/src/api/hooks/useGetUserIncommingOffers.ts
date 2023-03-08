import { gql, useQuery } from "@apollo/client"

const GET_USER_INCOMMING_OFFERS = gql`
  query Query($walletAddress: String!) {
    getUserIncommingOffers(walletAddress: $walletAddress) {
      id
      makerData
      makerNfts
      takerNfts
      status
      maker {
        username
      }
      makerWalletAddress
    }
  }
`

export const useGetUserIncommingOffers = (walletAddress: string) => {
  const { data, loading, error } = useQuery(GET_USER_INCOMMING_OFFERS, {
    variables: { walletAddress },
  })

  return { data, loading, error }
}