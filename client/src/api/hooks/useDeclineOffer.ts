import { gql, useMutation } from '@apollo/client'

const DECLINE_OFFER = gql`
  mutation Mutation($declineOfferId: Int!) {
    declineOffer(id: $declineOfferId) {
      status
    }
  }
`

export const useDeclineOffer = (offerId: number | undefined) => {
  const [declineOffer, { data, loading, error }] = useMutation(DECLINE_OFFER, {
    variables: { declineOfferId: offerId },
  })

  return { declineOffer, data, loading, error }
}