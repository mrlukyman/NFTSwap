import { configureStore } from '@reduxjs/toolkit'
import { userSliceReducer } from './userSlice'
import { uiSliceReducer } from './uiSlice'
import { receiverSliceReducer } from './receiverSlice'

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ui: uiSliceReducer,
    trade: receiverSliceReducer,
  },
})

