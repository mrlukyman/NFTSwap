import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  walletAddress: null,
  username: null,
  isSubmitted: false,
  listOfTokens: [
    {

    }
  ],
}

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setReceiverInfo: (state, action) => {
      state.walletAddress = action.payload.walletAddress
      state.username = action.payload.username
      state.isSubmitted = true
    },
    removeReceiverInfo: (state) => {
      state.walletAddress = null
      state.username = null
      state.isSubmitted = false
    },
    addTokensToReceiver: (state, action) => {
      state.listOfTokens = [...state.listOfTokens, action.payload]
    },
    // removeTokensFromReceiver: (state, action) => {
    //   state.listOfTokens = state.listOfTokens.filter(
    //     (token) => token.tokenId !== action.payload
    //   )
    // },
    removeAllTokensFromReceiver: (state) => {
      state.listOfTokens = []
    }
  },
})

export const receiverSliceReducer = receiverSlice.reducer
export const { 
  setReceiverInfo, 
  removeReceiverInfo, 
  addTokensToReceiver, 
  removeAllTokensFromReceiver, 
   } = receiverSlice.actions