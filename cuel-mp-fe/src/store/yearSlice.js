import { createSlice } from '@reduxjs/toolkit'

// ปีงบประมาณ mock ระหว่างยังไม่ต่อ API — โครงเดียวกับ BUDGET_YEAR
const initialState = {
  years: [
    { year: 2027, status: 'open', description: 'FY2027' },
    { year: 2026, status: 'open', description: 'FY2026' },
    { year: 2025, status: 'closed', description: 'FY2025' },
  ],
  currentYear: 2027,
}

const yearSlice = createSlice({
  name: 'year',
  initialState,
  reducers: {
    setCurrentYear(state, action) {
      state.currentYear = action.payload
    },
    setYears(state, action) {
      state.years = action.payload
    },
  },
})

export const { setCurrentYear, setYears } = yearSlice.actions
export default yearSlice.reducer
