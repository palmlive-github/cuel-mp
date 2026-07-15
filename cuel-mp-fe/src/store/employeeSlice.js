import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

/**
 * โครงตามต้นแบบ: employees ต่อปี + employeeSetup (สถานะ freeze ต่อปี) + oracle staging
 * Employee Setup แสดงเฉพาะระเบียน Oracle master — NR/TI เป็นข้อมูล Manpower Input ไม่แสดงที่นี่
 */
const E = (empCode, name, position, deptCode, location, status, allocType, resignDate = null, remark = '') => ({
  empCode,
  name,
  position,
  deptCode,
  location,
  status, // Employee Type: SN | CN | SE | CE | SNW
  allocType,
  startDate: '2024-01-01',
  resignDate,
  remark,
  newRequestDate: null,
  transferInDate: null,
  transferOutDate: null,
})

// mock ชุดย่อยจาก INIT ของต้นแบบ (ครอบคลุมหลายแผนก/หลายประเภท)
const BASE_2027 = [
  E('A0054', 'Neil Evans', 'General Manager - Serial Production & Technology Development', 2640, 'BKK', 'SN', 'Indirect'),
  E('A2067', 'Paul Johnstone', 'Senior Coating & Insulation Superintendent', 2570, 'LCB', 'CE', 'Direct'),
  E('A2111', 'Yada Baibua', 'Technical Assistant', 2500, 'LCB', 'CN', 'Direct'),
  E('A2175', 'Attasit Korchaiyapruk', 'Managing Director', 2000, 'BKK', 'SN', 'Indirect', '2026-06-30', 'Remark input'),
  E('A2334', 'Anirut Kittiwajanasakul', 'Marine and Logistic Coordinator', 2240, 'BKK', 'CN', 'Direct'),
  E('A2383', 'Natdhapon Pansanoi', 'Project Engineer', 2200, 'LCB', 'CN', 'Direct'),
  E('A2406', 'Christopher Macintyre', 'Project Planning and Control Manager', 2210, 'LCB', 'SN', 'Indirect'),
  E('A2415', 'Damrong Khosuk', 'IT Systems Developer', 2730, 'BKK', 'CN', 'Indirect'),
  E('A2418', 'Pornpimon Chankham', 'Document Control Officer', 2250, 'BKK', 'CN', 'Direct'),
  E('A2424', 'Tharapong Ampavanonth', 'Senior Production Engineer', 2500, 'LCB', 'CN', 'Direct'),
  E('U0052', 'Bancha Matanavee', 'Welding Foreman', 2580, 'LCB', 'SNW', 'Direct'),
  E('U0082', 'Phaiboon Saensoongnoen', 'Senior Fabrication Supervisor', 2520, 'LCB', 'SN', 'Direct'),
  E('U0089', 'Thanarak Tongkao', 'Administration Manager', 2820, 'LCB', 'SN', 'Indirect'),
  E('U0384', 'Bunterng Nantijai', 'Senior Piping Supervisor', 2530, 'LCB', 'SN', 'Direct'),
  E('U0445', 'Wipada Puripatwattanakul', 'Senior IT Support', 2730, 'LCB', 'SN', 'Indirect'),
  E('U0625', 'Karaked Haruanmitr', 'Human Resources Manager', 2810, 'LCB', 'SN', 'Indirect'),
  E('U0781', 'Poonsak Promnok', 'E&I Superintendent', 2540, 'LCB', 'SN', 'Direct'),
  E('U1011', 'Somsak Nantawong', 'Pipe Welder 6G/TIG', 2580, 'LCB', 'SNW', 'Direct'),
  E('U1282', 'Kandanai Chotipunsopon', 'Corporate IT Manager', 2730, 'BKK', 'SN', 'Indirect'),
  E('U1456', 'Supatta Boonsrang', 'Senior Project Close-out Coordinator', 2740, 'BKK', 'SN', 'Direct'),
  E('U1497', 'Wanlop Wannawanich', 'Deputy General Manager - Operations', 2000, 'BKK', 'SN', 'Indirect'),
  E('U1793', 'Surasak Ratanasatayanon', 'Project Finance and Cost Control Manager', 2740, 'BKK', 'SN', 'Indirect'),
]

const initialState = {
  byYear: { 2027: JSON.parse(JSON.stringify(BASE_2027)), 2026: [], 2025: [] },
  // สถานะ freeze ต่อปี — ตาม INIT.employeeSetup
  setup: {
    2027: { status: 'frozen', frozenDate: '2027-09-01', frozenBy: 'Corp Plan Admin' },
    2026: { status: 'frozen', frozenDate: '2026-06-08', frozenBy: 'Juntra Laohakunakorn' },
    2025: { status: 'frozen', frozenDate: '2024-10-10', frozenBy: 'Corp Plan Admin' },
  },
  // staging จาก Oracle (job ทุกวัน 22:00 น.) — mock เป็นชุดเดียวกับ baseline
  oracleStg: { 2027: BASE_2027 },
  dataRefreshDate: '2026-05-05',
  // ยังไม่มีข้อมูล manpower input ใน FE — flag สำหรับกติกาบล็อก Load Oracle
  hasManpowerInput: { 2027: false },
  positionList: [
    'Accounting Manager', 'Administration Manager', 'Corporate IT Manager', 'Cost Controller', 'Crane Operator',
    'Document Control Officer', 'E&I Superintendent', 'E&I Supervisor', 'Fabrication Superintendent',
    'Fabrication Supervisor', 'Human Resources Manager', 'IT Support', 'IT Systems Developer', 'Managing Director',
    'Pipe Welder 6G/TIG', 'Piping Foreman', 'Piping Superintendent', 'Production Engineer', 'Production Manager',
    'Project Engineer', 'Project Manager', 'Rigging Supervisor', 'Scaffolding Supervisor', 'Senior IT Support',
    'Senior Production Engineer', 'Technical Assistant', 'Welder Multi coded', 'Welding Foreman', 'Welding Supervisor',
  ],
}

const listOf = (state, year) => {
  if (!state.byYear[year]) state.byYear[year] = []
  return state.byYear[year]
}
const setupOf = (state, year) => {
  if (!state.setup[year]) state.setup[year] = { status: 'draft', frozenDate: null, frozenBy: null }
  return state.setup[year]
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployee(state, action) {
      const { year, emp } = action.payload
      listOf(state, year).push({ ...emp, newRequestDate: null, transferInDate: null, transferOutDate: null })
    },
    editEmployee(state, action) {
      const { year, empCode, patch } = action.payload
      const e = listOf(state, year).find((x) => x.empCode === empCode)
      if (e) Object.assign(e, patch)
    },
    deleteEmployee(state, action) {
      const { year, empCode } = action.payload
      state.byYear[year] = listOf(state, year).filter((e) => e.empCode !== empCode)
    },
    freeze(state, action) {
      const { year, by } = action.payload
      state.setup[year] = { status: 'frozen', frozenDate: dayjs().format('YYYY-MM-DD'), frozenBy: by }
    },
    unfreeze(state, action) {
      setupOf(state, action.payload.year).status = 'draft'
    },
    // แทนที่รายชื่อทั้งหมดด้วยข้อมูลจาก staging (ตาม confirmSyncHRSystem)
    loadOracle(state, action) {
      const { year } = action.payload
      state.byYear[year] = JSON.parse(JSON.stringify(state.oracleStg[year] || []))
      state.dataRefreshDate = dayjs().format('YYYY-MM-DD')
    },
  },
})

export const { addEmployee, editEmployee, deleteEmployee, freeze, unfreeze, loadOracle } = employeeSlice.actions
export default employeeSlice.reducer
