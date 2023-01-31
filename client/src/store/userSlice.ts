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
    }
  }
})

export const userSliceReducer = userSlice.reducer
export const userActions = userSlice.actions