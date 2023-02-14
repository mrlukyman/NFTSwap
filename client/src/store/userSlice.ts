import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedin: false,
  user: {
    email: null,
    username: null,
    name: null,
    walletAddress: null,
  },
  listOfTokens: [
    {
    }
  ],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedin = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isLoggedin = false
      state.user = initialState.user
    },
    addTokensToSender: (state, action) => {
      state.listOfTokens = [...state.listOfTokens, action.payload]
    },
    // removeTokensFromSender: (state, action) => {
    //   state.listOfTokens = state.listOfTokens.filter(
    //     (token) => token.tokenAddress !== action.payload
    //   )
    // },
    removeAllTokensFromSender: (state) => {
      state.listOfTokens = []
    }
  }
})

export const userSliceReducer = userSlice.reducer
export const {login, logout, addTokensToSender, removeAllTokensFromSender} = userSlice.actions