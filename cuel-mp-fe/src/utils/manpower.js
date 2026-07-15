/**
 * Helper กลางของกฎ Manpower — port ตรงจากต้นแบบ Manpower_Plan.html
 * ใช้ร่วมกันระหว่าง Consolidation / Input Plan / Reports
 */

export const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/**
 * ช่วงเดือนที่กรอกได้ของพนักงาน (ตาม getValidMonthRange):
 * NR/TI = เริ่มจากเดือนนั้น · TO/Resign = กฎวันที่ 1 (ออกวันที่ 1 → เดือนก่อนหน้าเป็นเดือนสุดท้าย)
 * คืน {start:12,end:11} = ไม่มีเดือนที่กรอกได้ในปีนี้
 */
export function getValidMonthRange(emp, yr) {
  let start = 0
  let end = 11
  if (emp.newRequestDate) {
    const d = new Date(emp.newRequestDate)
    const dy = d.getFullYear()
    if (dy > yr) return { start: 12, end: 11 }
    if (dy === yr) start = Math.max(start, d.getMonth())
  }
  if (emp.transferInDate) {
    const d = new Date(emp.transferInDate)
    const dy = d.getFullYear()
    if (dy > yr) return { start: 12, end: 11 }
    if (dy === yr) start = Math.max(start, d.getMonth())
  }
  if (emp.transferOutDate) {
    const d = new Date(emp.transferOutDate)
    const dy = d.getFullYear()
    if (dy < yr) return { start: 12, end: 11 }
    if (dy === yr) end = Math.min(end, d.getDate() === 1 ? d.getMonth() - 1 : d.getMonth())
  }
  if (emp.resignDate) {
    const d = new Date(emp.resignDate)
    const dy = d.getFullYear()
    if (dy < yr) return { start: 12, end: 11 }
    if (dy === yr) end = Math.min(end, d.getDate() === 1 ? d.getMonth() - 1 : d.getMonth())
  }
  if (emp.movResignDate) {
    const d = new Date(emp.movResignDate)
    const dy = d.getFullYear()
    if (dy < yr) return { start: 12, end: 11 }
    if (dy === yr) end = Math.min(end, d.getDate() === 1 ? d.getMonth() - 1 : d.getMonth())
  }
  if (end < 0) return { start: 12, end: 11 }
  if (end < start) end = start
  return { start, end }
}

/**
 * ช่วงเดือนของโปรเจกต์จาก scope rows (กฎ Min/Max + clamp เข้าปีงบ) ตาม getProjMonthRange
 * คืน null = ไม่มี scope (ไม่จำกัดเดือน) · {startMi:12,endMi:-1} = อยู่นอกปีทั้งหมด
 */
export function getProjMonthRange(project, yr) {
  if (!project || !project.scopes || !project.scopes.length) return null
  let earliest = null
  let latest = null
  project.scopes.forEach((sc) => {
    if (sc.start) {
      const d = new Date(sc.start)
      if (!earliest || d < earliest) earliest = d
    }
    if (sc.finish) {
      const d = new Date(sc.finish)
      if (!latest || d > latest) latest = d
    }
  })
  if (!earliest && !latest) return null
  const yearStart = new Date(`${yr}-01-01`)
  const yearEnd = new Date(`${yr}-12-31`)
  if (!earliest || earliest <= yearStart) earliest = yearStart
  if (!latest || latest >= yearEnd) latest = yearEnd
  if (earliest > yearEnd || latest < yearStart) return { startMi: 12, endMi: -1 }
  const startMi = earliest.getFullYear() < yr ? 0 : earliest.getMonth()
  const endMi = latest.getFullYear() > yr ? 11 : latest.getMonth()
  return { startMi, endMi }
}

// โปรเจกต์ที่พนักงานกรอกได้: Indirect = All Projects แถวเดียว, Direct = ทุกโปรเจกต์ยกเว้น All Projects
export function getDeptProjects(emp, projects) {
  if (emp.allocType === 'Indirect') return projects.filter((p) => p.name === 'All Projects')
  return projects.filter((p) => p.name !== 'All Projects')
}

// โปรเจกต์ที่ถูกจัดสรรมากที่สุดของพนักงาน
export function getMostAllocatedProject(emp, projects) {
  let maxProj = ''
  let maxTotal = -1
  getDeptProjects(emp, projects).forEach((proj) => {
    const a = (emp.allocations && emp.allocations[proj.name]) || {}
    const total = Object.values(a).reduce((s, v) => s + (parseFloat(v) || 0), 0)
    if (total > maxTotal) {
      maxTotal = total
      maxProj = proj.name
    }
  })
  return maxProj
}

export function getMovDate(emp) {
  return emp.newRequestDate || emp.transferInDate || emp.transferOutDate || emp.movResignDate || emp.resignDate || ''
}
