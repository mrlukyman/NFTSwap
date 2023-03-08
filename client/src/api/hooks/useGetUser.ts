import { gql, useLazyQuery } from '@apollo/client'

const GET_USER = gql`
  query GetUser($walletAddress: String!) {
    getUser(walletAddress: $walletAddress) {
      email
      name
      username
    }
  }
`

export const useGetUser = (walletAddress: `0x${string}` | undefined) => {
  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER, {
    variables: { walletAddress },
    })

  return { getUser, data, loading, error }
}