import { createSlice } from '@reduxjs/toolkit'

/**
 * โครงตามต้นแบบ: departments (global, ชื่อรายปีใน yearNames) + deptManagersByYear + deptGroupDefs (global)
 * ข้อมูล mock ตรงกับ INIT ของ Manpower_Plan.html
 */
const D = (code, allocType, isParent, parentCode, name) => ({
  code,
  allocType,
  isParent,
  parentCode,
  yearNames: { 2025: name },
})

const initialState = {
  departments: [
    D(2000, 'Indirect', false, null, 'Corporate Management and staff'),
    D(2020, 'Indirect', true, null, 'Commercial Contract and Compliance'),
    D(2021, 'Direct', false, 2020, 'Commercial Contract and Compliance - Prime Contract Administration'),
    D(2050, 'Direct', false, null, 'Health, Environment and Safety'),
    D(2110, 'Direct', false, null, 'Operations Services - Quality Assurance and Quality Control'),
    D(2120, 'Indirect', false, null, 'Operations Services - Facilities and Security'),
    D(2140, 'Indirect', false, null, 'Government Affairs'),
    D(2200, 'Direct', true, null, 'Projects Management'),
    D(2210, 'Direct', false, 2200, 'Projects Management - Project Planning and Control'),
    D(2240, 'Direct', false, 2200, 'Projects Management - Offshore Services'),
    D(2250, 'Direct', false, 2200, 'Projects Management - Document Management'),
    D(2300, 'Indirect', false, null, 'Engineering and Design - Management and Support Team'),
    D(2320, 'Direct', false, null, 'Engineering and Design - Civil & Structural Engineering'),
    D(2330, 'Direct', false, null, 'Engineering and Design - Facilities Engineering'),
    D(2340, 'Direct', false, null, 'Engineering and Design - E&I Automation'),
    D(2350, 'Direct', false, null, 'Engineering and Design - Construction Engineering'),
    D(2400, 'Direct', false, null, 'Strategic Supply Chain Management - Corporate Procurement'),
    D(2410, 'Direct', false, null, 'Strategic Supply Chain Management - Corporate Subcontracting'),
    D(2420, 'Direct', false, null, 'Strategic Supply Chain Management - Logistics and Materials Management'),
    D(2430, 'Direct', false, null, 'Strategic Supply Chain Management - Field Procurement'),
    D(2450, 'Direct', false, null, 'Strategic Supply Chain Management - Warehouse'),
    D(2500, 'Direct', true, null, 'Construction'),
    D(2520, 'Direct', false, 2500, 'Construction - Structural'),
    D(2530, 'Direct', false, 2500, 'Construction - Piping'),
    D(2540, 'Direct', false, 2500, 'Construction - E&I and Pre-Commissioning'),
    D(2550, 'Direct', false, 2500, 'Construction - Production Services'),
    D(2560, 'Direct', false, 2500, 'Construction - Pressure Testing and Mechanical Completion'),
    D(2570, 'Direct', false, 2500, 'Construction - Painting and Insulation'),
    D(2580, 'Direct', false, 2500, 'Construction - Welding'),
    D(2600, 'Indirect', false, null, 'Strategic Business Development - Business Development'),
    D(2610, 'Indirect', false, null, 'Strategic Business Development - Proposals'),
    D(2640, 'Indirect', false, null, 'Serial Production & Technology Development Department'),
    D(2700, 'Indirect', false, null, 'CFO Office - Finance'),
    D(2710, 'Indirect', false, null, 'CFO Office - Accounting'),
    D(2720, 'Indirect', false, null, 'CFO Office - Corporate Planning'),
    D(2730, 'Indirect', false, null, 'CFO Office - Corporate IT'),
    D(2740, 'Direct', false, null, 'CFO Office - Project Finance and Cost Control'),
    D(2800, 'Indirect', false, null, 'Human Resources - Organization Development'),
    D(2810, 'Indirect', false, null, 'Human Resources - Business Partner'),
    D(2820, 'Indirect', false, null, 'Human Resources - Administration'),
  ],
  managersByYear: {
    2027: {
      2500: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2520: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2530: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2540: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2550: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2560: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2570: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2580: { requester: '', approver: 'Chi Yiu Wing', reviewer: '' },
      2730: { requester: 'Phaisarn Rojthana', approver: 'Kandanai Chotipunsopon', reviewer: '' },
      2740: { requester: 'Nandaparth Suthanaudomrux', approver: 'Surasak Ratanasatayanon', reviewer: '' },
    },
  },
  groupDefs: [
    { name: 'Corporate Office', depts: [2000, 2020, 2021, 2040, 2600, 2610, 2700, 2710, 2720, 2730, 2740, 2800, 2810, 2820] },
    { name: 'HESS', depts: [2050] },
    { name: 'QC', depts: [2110] },
    { name: 'Facilities', depts: [2120] },
    { name: 'GA', depts: [2140] },
    { name: 'PMT', depts: [2200, 2210, 2240, 2250] },
    { name: 'ED', depts: [2300, 2320, 2330, 2340, 2350] },
    { name: 'SSCM', depts: [2400, 2410, 2420, 2430, 2450] },
    { name: 'Construction', depts: [2500, 2520, 2530, 2540, 2550, 2560, 2570, 2580] },
    { name: 'Serial Product', depts: [2640] },
  ],
  managerPool: [
    'Neil Evans', 'Thanarak Tongkao', 'Karaked Haruanmitr', 'Katekhaw Damrongsoontornchai', 'Suraphi Praromwong',
    'Kandanai Chotipunsopon', 'Pornchai Rayathong', 'Ketsuda Chaisakdanukul', 'Wanlop Wannawanich',
    'Pornchai Apirajkamol', 'Chotithach Charajchamroen', 'Chalermpan Chantasophonno', 'Nutthaphon Phosri',
    'Somanong Kantornvichaiwat', 'Chate Nakarit', 'Surasak Ratanasatayanon', 'Thammasorn Anunt-areechote',
    'Chakrit Chaiwong', 'Panatda Kaewyongkot', 'Chalerm Srisuk', 'Sarunyoo Choochuen', 'Pipatpong Phaopootorn',
    'Porntip Salaitanawatwong', 'Narongchai Prapakornwiriya', 'Rungsak Chuakaew', 'Pandaree Thammakhan',
    'Prakasit Naksomvongkul', 'Saowaluk Treenalin', 'Prasit Sodaprom', 'Phaisarn Rojthana', 'Attasit Korchaiyapruk',
    'Intira Sonmuang', 'Apichaya Charupinijkul', 'Anat Tingsa-nga', 'Sirawit Manamungprasert', 'Viboon Kanque',
    'Manu Thongrat', 'Suwichan Thangkhum', 'Napatsuda Rungruang', 'Christopher Macintyre', 'Soontorn Kongraksawej',
    'Yiu Wing Chi', 'Tanwa Sukkasem', 'Chakarin Iampichit', 'Kit Nontamit', 'Yuwanda Raksaphon', 'Tanit Panitpongsri',
    'Sarinthorn Rojarayanont', 'Sanan Jornpliew', 'Narakorn Duangdao', 'Somkiat Patcharanaruemon',
    'Pollawat Kanjanaket', 'Thai Tingsomchaisilp',
  ],
}

const ensureYear = (state, year) => {
  if (!state.managersByYear[year]) state.managersByYear[year] = {}
  return state.managersByYear[year]
}

const deptSlice = createSlice({
  name: 'dept',
  initialState,
  reducers: {
    addDept(state, action) {
      const { year, code, name, allocType, requester, approver, reviewer } = action.payload
      state.departments.push({ code, allocType, isParent: false, parentCode: null, yearNames: { [year]: name } })
      state.departments.sort((a, b) => a.code - b.code)
      ensureYear(state, year)[code] = { requester: requester || '', approver: approver || '', reviewer: reviewer || '' }
    },
    editDept(state, action) {
      const { year, code, name, allocType, requester, approver, reviewer } = action.payload
      const d = state.departments.find((x) => x.code === code)
      if (!d) return
      d.yearNames[year] = name
      d.allocType = allocType
      ensureYear(state, year)[code] = { requester: requester || '', approver: approver || '', reviewer: reviewer || '' }
    },
    deleteDept(state, action) {
      state.departments = state.departments.filter((d) => d.code !== action.payload.code)
    },
    setManagerRole(state, action) {
      const { year, code, role, value } = action.payload
      const m = ensureYear(state, year)
      if (!m[code]) m[code] = { requester: '', approver: '', reviewer: '' }
      m[code][role] = value
    },
    copyFromPrevYear(state, action) {
      const { year } = action.payload
      const prev = year - 1
      state.departments.forEach((d) => {
        if (d.yearNames[prev]) d.yearNames[year] = d.yearNames[prev]
      })
      state.managersByYear[year] = JSON.parse(JSON.stringify(state.managersByYear[prev] || {}))
    },
    addGroup(state, action) {
      const { name, depts } = action.payload
      state.groupDefs.push({ name, depts })
    },
    editGroup(state, action) {
      const { index, name, depts } = action.payload
      const g = state.groupDefs[index]
      if (g) {
        g.name = name
        g.depts = depts
      }
    },
    deleteGroup(state, action) {
      state.groupDefs.splice(action.payload.index, 1)
    },
  },
})

export const { addDept, editDept, deleteDept, setManagerRole, copyFromPrevYear, addGroup, editGroup, deleteGroup } =
  deptSlice.actions
export default deptSlice.reducer

// helper กลาง — ชื่อแผนกของปี (fallback ชื่อปีแรกที่มี ตาม getDeptName ของต้นแบบ)
export const getDeptName = (dept, year) =>
  dept.yearNames[year] || dept.yearNames[Object.keys(dept.yearNames)[0]] || `Dept ${dept.code}`
