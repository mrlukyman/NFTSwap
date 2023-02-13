import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  receiverAddress: null,
  isSubmitted: false,
  receiverListOfTokens: [
    {
    tokenAddress: null,
    tokenAmount: null,
    }
  ],
}

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setReceiverAddress: (state, action) => {
      state.isSubmitted = true
      state.receiverAddress = action.payload
    },
    removeReceiverAddress: (state) => {
      state.isSubmitted = false
      state.receiverAddress = null
    },
    addTokensToReceiver: (state, action) => {
      state.receiverListOfTokens = [...state.receiverListOfTokens, action.payload]
    },
    removeTokensFromReceiver: (state, action) => {
      state.receiverListOfTokens = state.receiverListOfTokens.filter(
        (token) => token.tokenAddress !== action.payload
      )
    },
    removeAllTokensFromReceiver: (state) => {
      state.receiverListOfTokens = []
    }
  },
})

export const receiverSliceReducer = receiverSlice.reducer
export const { setReceiverAddress, removeReceiverAddress } = receiverSlice.actions