import { configureStore } from '@reduxjs/toolkit'
import { userSliceReducer } from './userSlice'
import { uiSliceReducer } from './uiSlice'
import { tradeSliceReducer } from './tradeSlice'

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ui: uiSliceReducer,
    trade: tradeSliceReducer,
  },
})

