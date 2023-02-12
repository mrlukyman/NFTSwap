import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  receiverAddress: null,
  isSubmitted: false,
}

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setReceiverAddress: (state, action) => {
      state.isSubmitted = true
      state.receiverAddress = action.payload
    },
    //reset state
    removeReceiverAddress: (state) => {
      state.isSubmitted = false
      state.receiverAddress = null
    }
  },
})

export const tradeSliceReducer = tradeSlice.reducer
export const { setReceiverAddress, removeReceiverAddress } = tradeSlice.actions