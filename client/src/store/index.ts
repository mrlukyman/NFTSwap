import { configureStore } from '@reduxjs/toolkit'
import { userSliceReducer } from './userSlice'
import { uiSliceReducer } from './uiSlice'

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ui: uiSliceReducer,
  },
})

