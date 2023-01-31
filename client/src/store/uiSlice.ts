import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isModalOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen
    }
  }
})

export const uiSliceReducer = uiSlice.reducer
export const { toggleModal } = uiSlice.actions