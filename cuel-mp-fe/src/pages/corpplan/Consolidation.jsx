import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDeptName } from '../../store/deptSlice.js'
import { fmtDate } from '../../utils/gantt.jsx'
import {
  MONTH_KEYS,
  getValidMonthRange,
  getProjMonthRange,
  getDeptProjects,
  getMostAllocatedProject,
  getMovDate,
} from '../../utils/manpower.js'
import { MONTHS } from '../../constants/index.js'

/**
 * Corp Plan Consolidation — ตามต้นแบบ sec-corpplan + renderCorpPlan:
 * มุมมองรวมทั้งบริษัท: filter 5 ตัว → stat cards 6 ใบ → ตาราง พนักงาน × โปรเจกต์ × 12 เดือน (rowspan)
 * + แถว Monthly Total และ Export 2 แบบ (by Project / 1 row per emp)
 */

// ป้ายสถานะการส่งแบบพื้นอ่อน ตาม statusBadge ของต้นแบบ
const SUB_BADGE = {
  pending: { label: '⏱ Draft', bg: '#fffbeb', color: '#f59e0b' },
  pending_approver: { label: '📨 Pending Approver', bg: '#fffbeb', color: '#f59e0b' },
  returned_by_approver: { label: '↩ Returned by Approver', bg: '#fef2f2', color: '#ef4444' },
  submitted: { label: '✔ Submitted to Corp Plan', bg: '#eaf2ff', color: '#3b82f6' },
  verified: { label: '✓ Verified', bg: '#ecfdf3', color: '#22c55e' },
  rejected: { label: '✕ Rejected', bg: '#fef2f2', color: '#ef4444' },
}

const EMPTY_ARR = []
const EMPTY_OBJ = {}

export default function Consolidation() {
  const { currentYear } = useSelector((s) => s.year)
  const { departments } = useSelector((s) => s.dept)
  const employees = useSelector((s) => s.employee.byYear[currentYear]) ?? EMPTY_ARR
  const projects = useSelector((s) => s.project.byYear[currentYear]) ?? EMPTY_ARR
  const subs = useSelector((s) => s.submission.byYear[currentYear]) ?? EMPTY_OBJ

  const [f, setF] = useState({ dept: 'all', proj: 'all', type: 'all', mov: 'all', sub: 'all' })

  const deptName = (code) => {
    const d = departments.find((x) => x.code === code)
    return d ? getDeptName(d, currentYear) : `Dept ${code}`
  }

  // ---- filter พนักงาน ตามลำดับเดียวกับต้นแบบ ----
  const emps = useMemo(() => {
    let list = [...employees]
    if (f.sub !== 'all') list = list.filter((e) => ((subs[e.deptCode] || {}).status || 'pending') === f.sub)
    if (f.dept !== 'all') list = list.filter((e) => e.deptCode === Number(f.dept))
    if (f.type !== 'all') list = list.filter((e) => e.allocType === f.type)
    if (f.mov !== 'all') {
      if (f.mov === 'existing')
        list = list.filter((e) => !e.newRequestDate && !e.transferInDate && !e.transferOutDate && !e.movResignDate && !e.resignDate)
      else if (f.mov === 'new') list = list.filter((e) => e.newRequestDate)
      else if (f.mov === 'transferIn') list = list.filter((e) => e.transferInDate)
      else if (f.mov === 'transferOut') list = list.filter((e) => e.transferOutDate)
      else if (f.mov === 'resign') list = list.filter((e) => e.movResignDate || e.resignDate)
    }
    if (f.proj !== 'all')
      list = list.filter((e) => e.allocations?.[f.proj] && Object.values(e.allocations[f.proj]).some((v) => parseFloat(v) > 0))
    return list.sort((a, b) => a.deptCode - b.deptCode || a.name.localeCompare(b.name))
  }, [employees, subs, f])

  // ---- สถิติหัวหน้า (ใช้ dept + submission filter; Year End HC ใช้ type ด้วย) ----
  const stats = useMemo(() => {
    const verifiedDepts = new Set(Object.entries(subs).filter(([, v]) => v.status === 'verified').map(([k]) => parseInt(k)))
    const submittedDepts = new Set(Object.entries(subs).filter(([, v]) => v.status === 'submitted').map(([k]) => parseInt(k)))
    let s1 = f.dept !== 'all' ? employees.filter((e) => e.deptCode === Number(f.dept)) : employees
    const s2 = f.sub !== 'all' ? s1.filter((e) => ((subs[e.deptCode] || {}).status || 'pending') === f.sub) : s1
    const s3 = f.type !== 'all' ? s2.filter((e) => e.allocType === f.type) : s2
    return {
      total: s2.length,
      verified: s2.filter((e) => verifiedDepts.has(e.deptCode)).length,
      submitted: s2.filter((e) => submittedDepts.has(e.deptCode)).length,
      direct: s2.filter((e) => e.allocType === 'Direct').length,
      indirect: s2.filter((e) => e.allocType === 'Indirect').length,
      yearEnd: s3.filter((e) => getValidMonthRange(e, currentYear).end === 11).length,
    }
  }, [employees, subs, f, currentYear])

  // ---- ยอดรวมรายเดือน (คิดตามช่วง valid ของคนและช่วง scope ของโปรเจกต์) ----
  const monthTotals = useMemo(
    () =>
      MONTH_KEYS.map((mk, mi) => {
        let t = 0
        emps.forEach((emp) => {
          const vRange = getValidMonthRange(emp, currentYear)
          if (mi < vRange.start || mi > vRange.end) return
          getDeptProjects(emp, projects).forEach((proj) => {
            const pRange = emp.allocType === 'Direct' ? getProjMonthRange(proj, currentYear) : null
            if (pRange && (mi < pRange.startMi || mi > pRange.endMi)) return
            t += parseFloat(emp.allocations?.[proj.name]?.[mk]) || 0
          })
        })
        return t
      }),
    [emps, projects, currentYear],
  )

  // ---- Export CSV 2 แบบ ----
  const download = (rows, name) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = name
    a.click()
  }
  const exportByProject = () => {
    const rows = [['Emp Code', 'Name', 'Dept', 'Department', 'Alloc Type', 'Project', ...MONTHS]]
    emps.forEach((emp) => {
      getDeptProjects(emp, projects).forEach((proj) => {
        const a = emp.allocations?.[proj.name] || {}
        rows.push([emp.empCode, emp.name, emp.deptCode, deptName(emp.deptCode), emp.allocType, proj.name, ...MONTH_KEYS.map((mk) => a[mk] || 0)])
      })
    })
    download(rows, `consolidation_by_project_${currentYear}.csv`)
  }
  const exportFlat = () => {
    const rows = [['Emp Code', 'Name', 'Dept', 'Department', 'Alloc Type', 'Main Project', ...MONTHS]]
    emps.forEach((emp) => {
      const totals = MONTH_KEYS.map((mk) =>
        getDeptProjects(emp, projects).reduce((s, proj) => s + (parseFloat(emp.allocations?.[proj.name]?.[mk]) || 0), 0),
      )
      rows.push([emp.empCode, emp.name, emp.deptCode, deptName(emp.deptCode), emp.allocType, getMostAllocatedProject(emp, projects), ...totals])
    })
    download(rows, `consolidation_flat_${currentYear}.csv`)
  }

  const filterSel = (key, label, options) => (
    <div className="flex items-center gap-1.5">
      <label className="text-[11px] font-semibold text-slate-400 uppercase">{label}:</label>
      <select
        className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] outline-none focus:border-primary"
        value={f[key]}
        onChange={(e) => setF({ ...f, [key]: e.target.value })}
      >
        {options}
      </select>
    </div>
  )

  const statCard = (label, value, color, muted) => (
    <div
      className={`rounded-md px-[18px] py-3.5 border-l-4 flex items-center justify-between ${
        muted ? 'bg-slate-50 border-slate-300 opacity-85' : 'bg-white border-slate-300 shadow-sm'
      }`}
    >
      <div className={`text-[11px] font-semibold uppercase ${muted ? 'text-slate-400' : 'text-slate-400'}`}>{label}</div>
      <div className={`font-extrabold ${muted ? 'text-[18px]' : 'text-[20px]'}`} style={{ color: color || '#1f2937' }}>
        {value}
      </div>
    </div>
  )

  return (
    <div>
      {/* page-header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[18px] font-bold text-primary-dark">Corp Plan Consolidation</div>
          <div className="text-[12px] text-slate-400 mt-0.5">Consolidated manpower plan from all submitted departments</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-proto bg-success text-white hover:opacity-90" onClick={exportByProject}>
            ⬇ Export (by Project)
          </button>
          <button className="btn-proto text-white hover:opacity-90" style={{ background: '#0d6e3f' }} onClick={exportFlat}>
            ⬇ Export (1 row/emp)
          </button>
        </div>
      </div>

      {/* filter bar 5 ตัว */}
      <div className="flex gap-2.5 items-center flex-wrap bg-white rounded-md px-4 py-[11px] mb-3.5 shadow-sm">
        {filterSel('dept', 'Dept', [
          <option key="all" value="all">All</option>,
          ...departments.map((d) => (
            <option key={d.code} value={d.code}>
              {d.code} — {deptName(d.code)}
            </option>
          )),
        ])}
        {filterSel('proj', 'Project', [
          <option key="all" value="all">All Projects</option>,
          ...projects.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          )),
        ])}
        {filterSel('type', 'Type', [
          <option key="all" value="all">All</option>,
          <option key="d" value="Direct">Direct</option>,
          <option key="i" value="Indirect">Indirect</option>,
        ])}
        {filterSel('mov', 'Movement', [
          <option key="all" value="all">All</option>,
          <option key="e" value="existing">Existing</option>,
          <option key="n" value="new">New Request</option>,
          <option key="ti" value="transferIn">Transfer In</option>,
          <option key="to" value="transferOut">Transfer Out</option>,
          <option key="r" value="resign">Resign</option>,
        ])}
        {filterSel('sub', 'Status', [
          <option key="all" value="all">All</option>,
          <option key="p" value="pending">Draft</option>,
          <option key="pa" value="pending_approver">Pending Approver</option>,
          <option key="ra" value="returned_by_approver">Returned by Approver</option>,
          <option key="s" value="submitted">Submitted to Corp Plan</option>,
          <option key="v" value="verified">Verified</option>,
          <option key="rj" value="rejected">Rejected</option>,
        ])}
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-5">
        {statCard('Total Records', stats.total)}
        {statCard('Verified HC', stats.verified, '#0a7a3a')}
        {statCard('Submitted HC', stats.submitted, '#0055bb')}
        {statCard('Direct', stats.direct, '#2563eb')}
        {statCard('Indirect', stats.indirect, '#7c3aed')}
        {statCard(`Year End HC ${currentYear}`, stats.yearEnd, '#64748b', true)}
      </div>

      {/* ตารางรวม */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="p-[18px]">
          <div id="consolidation-table" className="table-scroll" style={{ '--table-offset': '420px', '--stick-l1': '80px' }}>
          <table className="tbl w-full border-collapse text-[12px] min-w-[1700px]">
            <thead>
              <tr >
                <th rowSpan={2}>Emp Code</th>
                <th rowSpan={2}>Name</th>
                <th rowSpan={2}>Position</th>
                <th rowSpan={2}>Dept</th>
                <th rowSpan={2}>Department</th>
                <th rowSpan={2}>Emp Type</th>
                <th rowSpan={2}>Alloc</th>
                <th rowSpan={2}>Movement</th>
                <th rowSpan={2}>Start Date</th>
                <th rowSpan={2}>Mov Date</th>
                <th rowSpan={2}>Main Project</th>
                <th rowSpan={2}>Sub Status</th>
                <th rowSpan={2}>Project</th>
                <th rowSpan={1} colSpan={12} className="!text-center !bg-blue-400">Allocation {currentYear}</th>
                <th rowSpan={2}>Remark</th>
              </tr>
              <tr className='subhead'>
                {MONTHS.map((m) => (
                  <th rowSpan={1} key={m} className="!text-center !px-1.5">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emps.length === 0 && (
                <tr>
                  <td colSpan={26} className="!text-center !text-slate-400 !py-6">
                    No records match the current filters.
                  </td>
                </tr>
              )}
              {emps.map((emp) => {
                const sub = subs[emp.deptCode] || { status: 'pending' }
                const badge = SUB_BADGE[sub.status || 'pending'] || SUB_BADGE.pending
                const move = emp.newRequestDate
                  ? 'New Req'
                  : emp.transferInDate
                    ? 'Trans In'
                    : emp.transferOutDate
                      ? 'Trans Out'
                      : emp.movResignDate || emp.resignDate
                        ? 'Resign'
                        : ''
                const projsEmp = getDeptProjects(emp, projects)
                const vRange = getValidMonthRange(emp, currentYear)
                const movDate = getMovDate(emp)
                const mainProj = getMostAllocatedProject(emp, projects)
                return projsEmp.map((proj, pi) => {
                  const a = emp.allocations?.[proj.name] || {}
                  const pRange = emp.allocType === 'Direct' ? getProjMonthRange(proj, currentYear) : null
                  return (
                    <tr key={emp.empCode + proj.name}>
                      {pi === 0 && (
                        <>
                          <td rowSpan={projsEmp.length}>
                            <strong>{emp.empCode}</strong>
                          </td>
                          <td rowSpan={projsEmp.length}>{emp.name}</td>
                          <td rowSpan={projsEmp.length} className="!text-[11px]">
                            {emp.position}
                          </td>
                          <td rowSpan={projsEmp.length}>
                            <span className="inline-block bg-primary-light text-primary rounded-[3px] px-1.5 py-px text-[10px] font-bold">
                              {emp.deptCode}
                            </span>
                          </td>
                          <td rowSpan={projsEmp.length} className="!text-[11px]">
                            {deptName(emp.deptCode)}
                          </td>
                          <td rowSpan={projsEmp.length} className="!text-[11px] !font-bold !text-primary">
                            {emp.status || ''}
                          </td>
                          <td rowSpan={projsEmp.length}>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase ${
                                emp.allocType === 'Direct' ? 'bg-primary-light text-primary' : 'bg-info-bg text-info'
                              }`}
                            >
                              {emp.allocType}
                            </span>
                          </td>
                          <td rowSpan={projsEmp.length}>
                            {move && (
                              <span className="inline-flex px-2 py-0.5 rounded-xl text-[10px] font-bold bg-accent-light text-[#7a5c00]">
                                {move}
                              </span>
                            )}
                          </td>
                          <td rowSpan={projsEmp.length} className="!text-[11px] whitespace-nowrap">
                            {emp.startDate ? fmtDate(emp.startDate) : '—'}
                          </td>
                          <td rowSpan={projsEmp.length} className="!text-[11px] whitespace-nowrap">
                            {movDate ? fmtDate(movDate) : '—'}
                          </td>
                          <td rowSpan={projsEmp.length} className="!text-[11px] !font-semibold !text-blue-700 max-w-[140px] !whitespace-normal">
                            {mainProj || '—'}
                          </td>
                          <td rowSpan={projsEmp.length}>
                            <span
                              className="inline-flex px-2 py-0.5 rounded-xl text-[10px] font-bold whitespace-nowrap"
                              style={{ background: badge.bg, color: badge.color }}
                            >
                              {badge.label}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="!text-[11px] !font-semibold !pl-2.5">{proj.name}</td>
                      {MONTH_KEYS.map((mk, mi) => {
                        const outOfRange = mi < vRange.start || mi > vRange.end
                        const outOfProj = pRange && (mi < pRange.startMi || mi > pRange.endMi)
                        if (outOfRange || outOfProj)
                          return (
                            <td key={mk} className="!text-center !text-[11px] !text-slate-300 !bg-[#fafafa]">
                              —
                            </td>
                          )
                        const v = parseFloat(a[mk]) || 0
                        return (
                          <td key={mk} className="!text-center !text-[11px]">
                            {v > 0 ? v.toFixed(2) : '—'}
                          </td>
                        )
                      })}
                      {pi === 0 && (
                        <td rowSpan={projsEmp.length} className="!text-[11px] !text-slate-600 max-w-[160px] !whitespace-normal">
                          {emp.inputRemark !== undefined ? emp.inputRemark : emp.remark || ''}
                        </td>
                      )}
                    </tr>
                  )
                })
              })}
              {emps.length > 0 && (
                <tr className="bg-blue-100 font-bold border-t-2 border-blue-300">
                  <td colSpan={13} className="!px-3 !py-[7px] !text-[11px] !text-primary-dark !font-bold">
                    Monthly Total
                  </td>
                  {monthTotals.map((t, i) => (
                    <td key={i} className="!text-center !text-[11px] !font-bold !text-primary-dark">
                      {t > 0 ? t.toFixed(2) : '—'}
                    </td>
                  ))}
                  <td />
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
