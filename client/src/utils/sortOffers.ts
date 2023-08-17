export const sortOffers = (offers: any[]) => {
  return offers.sort((a, b) => {
    if (a.status === 'REJECTED') return 1
    if (b.status === 'REJECTED') return -1
    return 0
  })
}
