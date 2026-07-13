import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import yearReducer from './yearSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    year: yearReducer,
  },
})
