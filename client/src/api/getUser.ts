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

export const useGetUser = () => {
  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER)

  return { getUser, data, loading, error }
}