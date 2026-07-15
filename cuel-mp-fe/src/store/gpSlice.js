import { createSlice } from '@reduxjs/toolkit'

/**
 * Graph Priority ตามต้นแบบ: 3 แผงต่อปี (project / dept / empType)
 * ค่า = เลขลำดับ 1..N ไม่มีช่องว่าง — reducer จัดการ clamp + compact ตาม saveGpField/_compactGpPanel
 */
const initialState = {
  byYear: {
    2025: { empType: { SN: 1, CN: 2, SE: 3, CE: 4, SNW: 5 }, project: {}, dept: {} },
    2026: { empType: { SN: 1, CN: 2, SE: 3, CE: 4, SNW: 5 }, project: {}, dept: {} },
    2027: { empType: { SN: 1, CN: 2, SE: 3, CE: 4, SNW: 5 }, project: {}, dept: {} },
  },
}

// re-assign 1..N เรียงตามค่า, เสมอกันให้ winnerKey ชนะ (ได้ตำแหน่งที่ขอ)
function compactPanel(panel, winnerKey) {
  const keys = Object.keys(panel).filter((k) => panel[k] !== null && panel[k] !== undefined && !isNaN(parseInt(panel[k])))
  keys.sort((a, b) => {
    const va = parseInt(panel[a])
    const vb = parseInt(panel[b])
    if (va !== vb) return va - vb
    if (a === winnerKey) return -1
    if (b === winnerKey) return 1
    return 0
  })
  keys.forEach((k, i) => {
    panel[k] = i + 1
  })
}

const gpSlice = createSlice({
  name: 'gp',
  initialState,
  reducers: {
    setGpField(state, action) {
      const { year, type, key, value } = action.payload
      if (!state.byYear[year]) state.byYear[year] = { empType: {}, project: {}, dept: {} }
      const panel = state.byYear[year][type]
      const parsed = parseInt(value)
      const newVal = value === '' || isNaN(parsed) ? null : parsed
      // clamp 1 … จำนวนรายการที่มีเลขอยู่ (+1 ถ้า key นี้ยังไม่มีเลข) — ตาม saveGpField
      const totalSet = Object.keys(panel).filter((k) => panel[k] !== null && panel[k] !== undefined && !isNaN(parseInt(panel[k]))).length
      const clamped =
        newVal === null ? null : Math.max(1, Math.min(newVal, totalSet + (panel[key] === null || panel[key] === undefined ? 1 : 0)))
      panel[key] = clamped
      compactPanel(panel, key)
    },
  },
})

export const { setGpField } = gpSlice.actions
export default gpSlice.reducer
