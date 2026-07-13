import { createSlice } from '@reduxjs/toolkit'

/**
 * โครงตามต้นแบบ: projectsByYear + projectScopesByYear (รวมเป็นก้อนเดียวต่อโปรเจกต์)
 * project: { id, name, units, category, scopes: [{ scope, start, finish }] }
 * id 0 = "All Projects" (system — ห้ามแก้/ลบ ใช้โดยพนักงาน Indirect)
 */
const initialState = {
  byYear: {
    2027: [
      { id: 0, name: 'All Projects', units: '', category: '', scopes: [] },
      {
        id: 1,
        name: 'CVX Phase 71/73',
        units: '4 Jackets',
        category: 'Ongoing',
        scopes: [
          { scope: 'Engineering', start: '2027-01-01', finish: '2027-06-30' },
          { scope: 'Fabrication', start: '2027-03-01', finish: '2027-11-30' },
        ],
      },
      {
        id: 2,
        name: 'PTTEP Zawtika 1F',
        units: '',
        category: 'New',
        scopes: [{ scope: 'Fabrication', start: '2027-01-01', finish: '2027-12-31' }],
      },
      { id: 3, name: 'Bundle IV', units: '', category: '', scopes: [] },
    ],
    2026: [{ id: 0, name: 'All Projects', units: '', category: '', scopes: [] }],
    2025: [{ id: 0, name: 'All Projects', units: '', category: '', scopes: [] }],
  },
  nextId: { 2027: 4, 2026: 1, 2025: 1 },
}

const listOf = (state, year) => {
  if (!state.byYear[year]) {
    state.byYear[year] = [{ id: 0, name: 'All Projects', units: '', category: '', scopes: [] }]
    state.nextId[year] = 1
  }
  return state.byYear[year]
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject(state, action) {
      const { year, name } = action.payload
      const list = listOf(state, year)
      list.push({ id: state.nextId[year]++, name, units: '', category: '', scopes: [] })
    },
    renameProject(state, action) {
      const { year, id, name } = action.payload
      const p = listOf(state, year).find((x) => x.id === id)
      if (p) p.name = name
    },
    deleteProject(state, action) {
      const { year, id } = action.payload
      state.byYear[year] = listOf(state, year).filter((p) => p.id !== id)
    },
    setUnits(state, action) {
      const { year, id, units } = action.payload
      const p = listOf(state, year).find((x) => x.id === id)
      if (p) p.units = units
    },
    // เพิ่มแถว scope — ค่าเริ่มต้น 1 Jan – 31 Dec ของปีนั้น (ตามต้นแบบ addProjScopeRow)
    addScopeRow(state, action) {
      const { year, id } = action.payload
      const p = listOf(state, year).find((x) => x.id === id)
      if (p) p.scopes.push({ scope: '', start: `${year}-01-01`, finish: `${year}-12-31` })
    },
    deleteScopeRow(state, action) {
      const { year, id, index } = action.payload
      const p = listOf(state, year).find((x) => x.id === id)
      if (p && p.scopes[index]) p.scopes.splice(index, 1)
    },
    setScopeField(state, action) {
      const { year, id, index, field, value } = action.payload
      const p = listOf(state, year).find((x) => x.id === id)
      if (p && p.scopes[index]) p.scopes[index][field] = value
    },
  },
})

export const { addProject, renameProject, deleteProject, setUnits, addScopeRow, deleteScopeRow, setScopeField } =
  projectSlice.actions
export default projectSlice.reducer
