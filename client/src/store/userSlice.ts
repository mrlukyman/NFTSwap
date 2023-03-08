import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedin: false,
  user: {
    email: null,
    username: null,
    name: null,
    walletAddress: null,
  },
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
    }
  }
})

export const userSliceReducer = userSlice.reducer
export const {login, logout} = userSlice.actions