import { createSlice } from '@reduxjs/toolkit'

const saved = sessionStorage.getItem('mp_user')

const initialState = {
  user: saved ? JSON.parse(saved) : null, // { username, name, role, depts: [] }
  isAuthenticated: !!saved,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      sessionStorage.setItem('mp_user', JSON.stringify(action.payload))
      sessionStorage.setItem('mp_token', action.payload.token || 'mock-token')
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      sessionStorage.removeItem('mp_user')
      sessionStorage.removeItem('mp_token')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
