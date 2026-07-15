import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal.jsx'
import { addEmployee, editEmployee, deleteEmployee, freeze, unfreeze, loadOracle } from '../../store/employeeSlice.js'
import { getDeptName } from '../../store/deptSlice.js'
import { EMP_TYPES, LOCATIONS, ROLES } from '../../constants/index.js'

// dd/mm/yyyy ตาม fmtDate ของต้นแบบ
const fmtDate = (s) => {
  if (!s) return '—'
  const p = String(s).split('-')
  return p.length === 3 && p[0].length === 4 ? `${p[2]}/${p[1]}/${p[0]}` : s
}

// สีป้าย Emp Type ตาม renderEmployees
const ST_COLOR = { SN: '#2563eb', CN: '#0ea5e9', SE: '#8b5cf6', CE: '#f59e0b', SNW: '#0d9488' }

const EMPTY_FORM = {
  empCode: '',
  name: '',
  position: '',
  deptCode: '',
  location: 'BKK',
  status: 'SN',
  allocType: 'Direct',
  startDate: '',
  resignDate: '',
  remark: '',
}

/**
 * Employee Setup — ตามต้นแบบ sec-employees + renderEmployees:
 * workflow guide 3 ขั้น → freeze bar → filter bar → ตาราง 12 คอลัมน์
 * Load Oracle (บล็อกเมื่อ frozen / มี input แล้ว / ปีปิด), Freeze/Unfreeze, Add/Edit/Delete
 */
export default function Employees() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { years, currentYear } = useSelector((s) => s.year)
  const { departments } = useSelector((s) => s.dept)
  const empState = useSelector((s) => s.employee)

  const locked = years.find((y) => y.year === currentYear)?.status === 'closed'
  const isViewer = user?.role === ROLES.VIEWER
  const setup = empState.setup[currentYear] || { status: 'draft', frozenDate: null, frozenBy: null }
  const isFrozen = setup.status === 'frozen'
  const hasInput = empState.hasManpowerInput[currentYear] || false
  const allEmps = empState.byYear[currentYear] || []
  // แสดงเฉพาะระเบียน Oracle master (กรอง NR/TI ออกตามต้นแบบ)
  const baseEmps = allEmps.filter((e) => !e.newRequestDate && !e.transferInDate)

  const [filters, setFilters] = useState({ dept: 'all', alloc: 'all', search: '' })
  const [modal, setModal] = useState(null) // {type:'add'|'edit'|'oracle'}
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const deptCodes = useMemo(() => [...new Set(baseEmps.map((e) => e.deptCode))].sort(), [baseEmps])
  const emps = useMemo(() => {
    let list = [...baseEmps].sort((a, b) => a.deptCode - b.deptCode || a.empCode.localeCompare(b.empCode))
    if (filters.dept !== 'all') list = list.filter((e) => e.deptCode === Number(filters.dept))
    if (filters.alloc !== 'all') list = list.filter((e) => e.allocType === filters.alloc)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q))
    }
    return list
  }, [baseEmps, filters])

  const deptName = (code) => {
    const d = departments.find((x) => x.code === code)
    return d ? getDeptName(d, currentYear) : `Dept ${code}`
  }

  // ---- actions ----
  const doFreeze = () => {
    if (locked) {
      showToast(`Cannot freeze: Budget Year ${currentYear} is closed.`)
      return
    }
    if (window.confirm(`Freeze employee list for Year ${currentYear}?`)) {
      dispatch(freeze({ year: currentYear, by: user.name }))
      showToast('Employee list frozen ✓')
    }
  }
  const doUnfreeze = () => {
    if (locked) {
      showToast(`Cannot unfreeze: Budget Year ${currentYear} is closed.`)
      return
    }
    if (window.confirm(`Unfreeze employee list for Year ${currentYear}?`)) {
      dispatch(unfreeze({ year: currentYear }))
    }
  }
  const openOracle = () => {
    if (isFrozen) {
      showToast('Employee list is frozen. Unfreeze first.')
      return
    }
    if (hasInput) {
      showToast('Cannot load Oracle data — departments have already entered manpower plan data')
      return
    }
    setModal({ type: 'oracle' })
  }
  const confirmOracle = () => {
    const prev = allEmps.length
    dispatch(loadOracle({ year: currentYear }))
    const fresh = empState.oracleStg[currentYear]?.length || 0
    setModal(null)
    showToast(`Loaded ${fresh} employees from Oracle HRMS ✓ (${Math.max(fresh - prev, 0)} added, ${Math.max(prev - fresh, 0)} removed)`)
  }
  const doExport = () => {
    const rows = [
      ['Emp Code', 'Name', 'Position', 'Dept', 'Department', 'Location', 'Emp Type', 'Alloc Type', 'Start Date', 'Resign Date', 'Remark'],
      ...emps.map((e) => [e.empCode, e.name, e.position, e.deptCode, deptName(e.deptCode), e.location, e.status, e.allocType, e.startDate || '', e.resignDate || '', e.remark || '']),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = `employees_${currentYear}.csv`
    a.click()
  }
  const openAdd = () => {
    if (locked) {
      showToast(`Budget Year ${currentYear} is closed`)
      return
    }
    setForm({ ...EMPTY_FORM, deptCode: departments[0]?.code || '' })
    setModal({ type: 'add' })
  }
  const openEdit = (e) => {
    setForm({ ...e, startDate: e.startDate || '', resignDate: e.resignDate || '', remark: e.remark || '' })
    setModal({ type: 'edit' })
  }
  const confirmAdd = () => {
    if (!form.empCode.trim() || !form.name.trim()) {
      alert('Emp Code and Name are required.')
      return
    }
    if (allEmps.find((e) => e.empCode === form.empCode.trim())) {
      alert('Emp Code already exists.')
      return
    }
    dispatch(
      addEmployee({
        year: currentYear,
        emp: { ...form, empCode: form.empCode.trim(), name: form.name.trim(), deptCode: Number(form.deptCode), startDate: form.startDate || null, resignDate: form.resignDate || null },
      }),
    )
    setModal(null)
    showToast(`Employee ${form.empCode.trim()} added`)
  }
  const confirmEdit = () => {
    if (!form.name.trim()) {
      alert('Emp Code and Name are required.')
      return
    }
    dispatch(
      editEmployee({
        year: currentYear,
        empCode: form.empCode,
        patch: { ...form, deptCode: Number(form.deptCode), startDate: form.startDate || null, resignDate: form.resignDate || null },
      }),
    )
    setModal(null)
    showToast(`Employee ${form.empCode} updated`)
  }
  const doDelete = (e) => {
    if (window.confirm(`Delete employee ${e.empCode}?`)) {
      dispatch(deleteEmployee({ year: currentYear, empCode: e.empCode }))
    }
  }

  const guideCard = (num, title, body, done) => (
    <div
      className={`flex-1 min-w-[200px] flex items-start gap-2.5 rounded-md px-3.5 py-2.5 ${
        done ? 'bg-success-bg border border-[#b7dfca]' : 'bg-white shadow-sm'
      }`}
    >
      <span
        className={`text-white rounded-full w-[22px] h-[22px] inline-flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
          done ? 'bg-success' : 'bg-primary'
        }`}
      >
        {num}
      </span>
      <div>
        <div className={`text-[11px] font-bold mb-px ${done ? 'text-success' : 'text-primary-dark'}`}>{title}</div>
        <div className="text-[11px] text-slate-500">{body}</div>
      </div>
    </div>
  )

  return (
    <div>
      {/* page-header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[18px] font-bold text-primary-dark">
            Employee Setup
            {locked && (
              <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-xl bg-slate-100 text-slate-500 border border-slate-200 ml-2.5 align-middle">
                🔒 Year Closed
              </span>
            )}
          </div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            Manage and finalize the employee list for each budget year before manpower input begins
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn-proto bg-white text-primary border border-primary hover:bg-primary-light disabled:opacity-45"
            disabled={hasInput || isFrozen || locked || isViewer}
            title={hasInput ? 'Cannot load Oracle data — departments have already entered manpower plan data' : isFrozen ? 'Unfreeze employee list first' : ''}
            onClick={openOracle}
          >
            🔄 Load Oracle Employee Data
          </button>
          <button className="btn-ghost" onClick={doExport}>
            ⬇ Export Employee List
          </button>
          <button
            className="btn-prototype-primary disabled:opacity-45"
            disabled={isFrozen || locked || isViewer}
            title={isFrozen ? 'Unfreeze the employee list first' : ''}
            onClick={openAdd}
          >
            ＋ Add Employee
          </button>
        </div>
      </div>

      {/* workflow guide 3 ขั้น */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-start gap-2.5 bg-white rounded-md px-3.5 py-2.5 shadow-sm">
          <span className="bg-primary text-white rounded-full w-[22px] h-[22px] inline-flex items-center justify-center text-[11px] font-extrabold shrink-0">
            1
          </span>
          <div>
            <div className="text-[11px] font-bold text-primary-dark mb-px">Load &amp; Confirm Oracle Data</div>
            <div className="text-[11px] text-slate-500">
              Click <strong>Load Oracle Employee Data</strong> (~September or October) to pull the latest active
              headcount from Oracle. Allocation types are auto-set from each department&apos;s default. Adjust any
              exceptions manually.
            </div>
            {hasInput && (
              <div className="mt-2 bg-danger-bg border border-red-300 rounded-md px-3 py-2 text-[11px] text-danger font-semibold">
                ⚠ Load Oracle Employee Data is disabled — departments have already entered manpower plan data. Loading
                would overwrite their input.
              </div>
            )}
          </div>
        </div>
        {guideCard(
          2,
          'Freeze',
          <>
            Once the list is confirmed, click <strong>Freeze Employee List</strong>. This locks the data and department
            managers can start entering their manpower plans.
          </>,
          false,
        )}
        {guideCard(
          '✓',
          'Ready',
          'Department managers can now log in and submit their manpower plans. You can unfreeze if corrections are needed.',
          true,
        )}
      </div>

      {/* freeze bar */}
      <div className="flex items-center justify-between bg-white rounded-md px-[18px] py-3 mb-4 shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-3.5 py-1 rounded-[20px] text-[12px] font-bold uppercase ${
              isFrozen ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
            }`}
          >
            {isFrozen ? 'Frozen' : 'Draft'}
          </span>
          <span className="text-[11px] text-slate-400">
            {isFrozen
              ? `Frozen on ${fmtDate(setup.frozenDate)} by ${setup.frozenBy}`
              : 'Not yet frozen — requesters cannot input manpower plan'}
          </span>
        </div>
        {!isViewer && (
          <div className="flex gap-2">
            {isFrozen ? (
              <button className="btn-warning-proto !px-[9px] !py-1 !text-[11px]" onClick={doUnfreeze}>
                🔓 Unfreeze
              </button>
            ) : (
              <button className="btn-proto bg-success text-white hover:opacity-90 !px-[9px] !py-1 !text-[11px]" onClick={doFreeze}>
                ❄ Freeze Employee List
              </button>
            )}
          </div>
        )}
      </div>

      {/* filter bar */}
      <div className="flex gap-2.5 items-center flex-wrap bg-white rounded-md px-4 py-[11px] mb-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Department:</label>
          <select
            className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] text-slate-700 outline-none focus:border-primary"
            value={filters.dept}
            onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
          >
            <option value="all">All Departments</option>
            {deptCodes.map((dc) => (
              <option key={dc} value={dc}>
                {dc} — {deptName(dc)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Allocation Type:</label>
          <select
            className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] text-slate-700 outline-none focus:border-primary"
            value={filters.alloc}
            onChange={(e) => setFilters({ ...filters, alloc: e.target.value })}
          >
            <option value="all">All</option>
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Search:</label>
          <input
            type="text"
            placeholder="Name or Emp Code..."
            className="border border-slate-300 rounded-md px-[9px] py-[5px] text-[12px] text-slate-700 outline-none w-[180px] focus:border-primary"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <span className="text-[11px] text-slate-400 ml-1">
          Showing {emps.length} of {baseEmps.length} employees
        </span>
      </div>

      {/* ตารางพนักงาน */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="p-[18px] overflow-x-auto">
          <table className="tbl w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Position</th>
                <th>Dept</th>
                <th>Department</th>
                <th>Location</th>
                <th>Emp Type</th>
                <th>Alloc Type</th>
                <th>Start Date</th>
                <th>Resign Date</th>
                <th>Remark</th>
                <th className="!text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {emps.length === 0 && (
                <tr>
                  <td colSpan={12} className="!text-center !text-slate-400 !py-6">
                    No employees. Use &quot;Load Oracle Employee Data&quot; or &quot;Add Employee&quot;.
                  </td>
                </tr>
              )}
              {emps.map((e) => {
                const stClr = ST_COLOR[e.status] || '#94a3b8'
                return (
                  <tr key={e.empCode}>
                    <td>
                      <strong>{e.empCode}</strong>
                    </td>
                    <td>{e.name}</td>
                    <td className="!text-[11px] !text-slate-500">{e.position}</td>
                    <td>
                      <span className="inline-block bg-primary-light text-primary rounded-[3px] px-1.5 py-px text-[10px] font-bold">
                        {e.deptCode}
                      </span>
                    </td>
                    <td className="!text-[11px]">{deptName(e.deptCode)}</td>
                    <td>{e.location}</td>
                    <td>
                      <span
                        className="text-[10px] font-bold px-2 py-[2px] rounded"
                        style={{ background: `${stClr}18`, color: stClr, border: `1px solid ${stClr}44` }}
                      >
                        {e.status || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-[.4px] border ${
                          e.allocType === 'Direct'
                            ? 'bg-success-bg text-success border-green-200'
                            : 'bg-warning-bg text-[#b45309] border-amber-200'
                        }`}
                      >
                        {e.allocType}
                      </span>
                    </td>
                    <td className="!text-[11px]">{fmtDate(e.startDate)}</td>
                    <td className={`!text-[11px] ${e.resignDate ? '!text-red-600' : '!text-slate-400'}`}>{fmtDate(e.resignDate)}</td>
                    <td className="!text-[11px] !text-slate-500 max-w-[160px] overflow-hidden text-ellipsis" title={e.remark || ''}>
                      {e.remark || ''}
                    </td>
                    <td className="!text-center whitespace-nowrap">
                      {!isFrozen && !isViewer ? (
                        <>
                          <button className="btn-ghost !px-[7px] !py-[3px] !text-[10px] mr-1" onClick={() => openEdit(e)}>
                            Edit
                          </button>
                          <button className="btn-danger-proto !px-[7px] !py-[3px] !text-[10px]" onClick={() => doDelete(e)}>
                            Del
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-300 text-[11px]">{isFrozen ? 'Frozen' : 'View Only'}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="text-[10px] text-slate-400 px-0.5 py-1.5">
            ⚠ <strong>Resign Date</strong> is <em>not</em> loaded from Oracle — enter manually in the Edit modal if
            applicable.
          </div>
        </div>
      </div>

      {/* Add/Edit Employee modal */}
      <Modal
        open={modal?.type === 'add' || modal?.type === 'edit'}
        title={modal?.type === 'add' ? 'Add Employee' : `Edit Employee — ${form.empCode}`}
        onClose={() => setModal(null)}
        actions={[
          modal?.type === 'add'
            ? { label: 'Add Employee', cls: 'btn-prototype-primary', onClick: confirmAdd }
            : { label: 'Save', cls: 'btn-prototype-primary', onClick: confirmEdit },
        ]}
      >
        <div className="grid grid-cols-2 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">Emp Code</label>
            <input
              className={`form-control ${modal?.type === 'edit' ? '!bg-slate-100 !text-slate-500' : ''}`}
              placeholder="e.g. U1234"
              value={form.empCode}
              readOnly={modal?.type === 'edit'}
              onChange={(ev) => setForm({ ...form, empCode: ev.target.value })}
            />
          </div>
          <div>
            <label className="form-label">
              Department <span className="text-danger">*</span>
            </label>
            <select className="form-control" value={form.deptCode} onChange={(ev) => setForm({ ...form, deptCode: ev.target.value })}>
              {departments.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} — {getDeptName(d, currentYear)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input className="form-control" value={form.name} onChange={(ev) => setForm({ ...form, name: ev.target.value })} />
          </div>
          <div>
            <label className="form-label">
              Position <span className="text-danger">*</span>
            </label>
            <select className="form-control" value={form.position} onChange={(ev) => setForm({ ...form, position: ev.target.value })}>
              {form.position && !empState.positionList.includes(form.position) && <option value={form.position}>{form.position}</option>}
              {empState.positionList.map((pp) => (
                <option key={pp} value={pp}>
                  {pp}
                </option>
              ))}
              <option value="">-- Other --</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">
              Location <span className="text-danger">*</span>
            </label>
            <select className="form-control" value={form.location} onChange={(ev) => setForm({ ...form, location: ev.target.value })}>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Employee Type <span className="text-danger">*</span>
            </label>
            <select className="form-control" value={form.status} onChange={(ev) => setForm({ ...form, status: ev.target.value })}>
              {EMP_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Allocation Type <span className="text-danger">*</span>
            </label>
            <select className="form-control" value={form.allocType} onChange={(ev) => setForm({ ...form, allocType: ev.target.value })}>
              <option>Direct</option>
              <option>Indirect</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" value={form.startDate} onChange={(ev) => setForm({ ...form, startDate: ev.target.value })} />
          </div>
          <div>
            <label className="form-label">
              Resign Date <span className="normal-case text-[10px] text-warning">⚠ Enter manually — not loaded from Oracle</span>
            </label>
            <input type="date" className="form-control" value={form.resignDate} onChange={(ev) => setForm({ ...form, resignDate: ev.target.value })} />
          </div>
        </div>
        <div>
          <label className="form-label">
            Remark <span className="normal-case font-normal text-[10px] text-slate-400">(default hint shown in Manpower Input — requester may override)</span>
          </label>
          <input className="form-control" placeholder="Optional" value={form.remark} onChange={(ev) => setForm({ ...form, remark: ev.target.value })} />
        </div>
      </Modal>

      {/* Load Oracle confirm modal */}
      <Modal
        open={modal?.type === 'oracle'}
        title={`Load Oracle Employee Data — Budget Year ${currentYear}`}
        onClose={() => setModal(null)}
        actions={[{ label: '✓ Confirm Load', cls: 'btn-warning-proto', onClick: confirmOracle }]}
      >
        <div className="bg-warning-bg border border-amber-200 rounded-md px-4 py-3 text-[13px] text-amber-800 text-center">
          All current employee records for Year <strong>{currentYear}</strong> will be replaced. Proceed?
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[12px] px-4 py-2 rounded-md shadow-lg z-[300]">
          {toast}
        </div>
      )}
    </div>
  )
}
