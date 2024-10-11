// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  colorScheme: 'light',
  screenHeight: 0,
  screenWidth: 0,
  hydrated: false,
  error: false,
  errorMessage: '',
  archivedErrors: [],
}

const ui = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setColorScheme: (state, action) => {
      if (action.payload.colorScheme !== undefined)
        state.colorScheme = action.payload.colorScheme
    },
    setHydrated: (state, action) => {
      if (action.payload.hydrated !== undefined)
        state.hydrated = action.payload.hydrated
    },
    dehydrate: (state, action) => {
      if (action.payload.dehydrate !== undefined) {
        state.hydrated = false

      }
    },
    setError: (state, action) => {
      state.error = true
      if (action.payload.errorMessage !== undefined) {
        state.errorMessage = action.payload.errorMessage
        state.archivedErrors.push(action.payload.errorMessage)
      }
    },
    clearError: (state, action) => {
      state.error = false
      state.errorMessage = ''
    },
    setScreenDims: (state, action) => {
      if (action.payload.screenHeight !== undefined)
        state.screenHeight = action.payload.screenHeight

      if (action.payload.screenWidth !== undefined)
        state.screenWidth = action.payload.screenWidth
    }
  }
})

export default ui.reducer

export const { setColorScheme, setHydrated, dehydrate, setError, clearError, setScreenDims } = ui.actions