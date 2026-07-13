import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

// โครงเดียวกับ BUDGET_YEAR (mock ระหว่างยังไม่ต่อ API)
const initialState = {
  years: [
    { year: 2027, status: 'open', description: 'FY2027', reminderDate: null, cutoffDate: null, updatedBy: null },
    { year: 2026, status: 'open', description: 'FY2026', reminderDate: null, cutoffDate: null, updatedBy: null },
    { year: 2025, status: 'closed', description: 'FY2025', reminderDate: null, cutoffDate: '2025-12-31', updatedBy: 'Corp Plan Admin' },
  ],
  currentYear: 2027,
}

const today = () => dayjs().format('YYYY-MM-DD')

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
    // เพิ่มปีใหม่ — validation "Year already exists." ทำที่หน้า UI ก่อน dispatch
    addYear(state, action) {
      const { year, description, reminderDate } = action.payload
      state.years.push({
        year,
        status: 'open',
        description: description || `FY${year}`,
        reminderDate: reminderDate || null,
        cutoffDate: null,
        updatedBy: null,
      })
    },
    // แก้ description / reminderDate
    editYear(state, action) {
      const { year, description, reminderDate, updatedBy } = action.payload
      const by = state.years.find((b) => b.year === year)
      if (by) {
        by.description = description
        by.reminderDate = reminderDate || null
        by.updatedBy = updatedBy
      }
    },
    // ปิดปี — cutoffDate = วันนี้ (ตามต้นแบบ confirmCloseYear)
    closeYear(state, action) {
      const { year, updatedBy } = action.payload
      const by = state.years.find((b) => b.year === year)
      if (by) {
        by.status = 'closed'
        by.cutoffDate = today()
        by.updatedBy = updatedBy
      }
    },
    // เปิดปีอีกครั้ง (ตามต้นแบบ reopenYear)
    reopenYear(state, action) {
      const { year, updatedBy } = action.payload
      const by = state.years.find((b) => b.year === year)
      if (by) {
        by.status = 'open'
        by.cutoffDate = today()
        by.updatedBy = updatedBy
      }
    },
  },
})

export const { setCurrentYear, setYears, addYear, editYear, closeYear, reopenYear } = yearSlice.actions
export default yearSlice.reducer
