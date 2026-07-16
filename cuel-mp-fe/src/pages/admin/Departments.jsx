import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal.jsx'
import {
  addDept,
  editDept,
  deleteDept,
  setManagerRole,
  copyFromPrevYear,
  addGroup,
  editGroup,
  deleteGroup,
  getDeptName,
} from '../../store/deptSlice.js'
import { ROLES } from '../../constants/index.js'

/**
 * Department Setup — ตามต้นแบบ sec-depts:
 * 3 แท็บ (Department List / Dept Groups / Dept Managers)
 * ปุ่มหัวหน้า: Copy from Previous Year / Export / Import / Add Department
 * หมายเหตุ: HR แก้ไขหน้านี้ได้ (ตามสิทธิ์ในสเปก) — ล็อกเฉพาะเมื่อปีปิด
 */

const TABS = [
  { key: 'list', label: 'Department List' },
  { key: 'groups', label: 'Dept Groups' },
  { key: 'managers', label: 'Dept Managers' },
]

export default function Departments() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { years, currentYear } = useSelector((s) => s.year)
  const { departments, managersByYear, groupDefs, managerPool } = useSelector((s) => s.dept)

  const locked = years.find((y) => y.year === currentYear)?.status === 'closed'
  const isViewer = user?.role === ROLES.VIEWER
  const assign = managersByYear[currentYear] || {}
  const pool = [...managerPool].sort((a, b) => a.localeCompare(b))

  const [tab, setTab] = useState('list')
  const [modal, setModal] = useState(null) // {type:'add'|'edit'|'addGroup'|'editGroup', ...}
  const [form, setForm] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = (msg, color) => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }

  // ---------- Department List ----------
  const openAddDept = () => {
    if (locked) {
      showToast(`Budget Year ${currentYear} is closed`)
      return
    }
    setForm({ code: '', name: '', allocType: 'Direct', requester: '', approver: '', reviewer: '' })
    setModal({ type: 'add' })
  }
  const openEditDept = (d) => {
    const roles = assign[d.code] || {}
    setForm({
      code: d.code,
      name: d.yearNames[currentYear] || '',
      allocType: d.allocType,
      requester: roles.requester || '',
      approver: roles.approver || '',
      reviewer: roles.reviewer || '',
    })
    setModal({ type: 'edit' })
  }
  const confirmAddDept = () => {
    const code = parseInt(form.code)
    if (!code || !form.name.trim()) {
      alert('Dept Code and Name are required.')
      return
    }
    if (departments.find((d) => d.code === code)) {
      alert('Dept Code already exists.')
      return
    }
    dispatch(addDept({ year: currentYear, ...form, code, name: form.name.trim() }))
    setModal(null)
    showToast(`Department ${code} added`)
  }
  const confirmEditDept = () => {
    if (!form.name.trim()) {
      alert('Department name is required.')
      return
    }
    if (!form.approver) {
      alert('Approver is required.')
      return
    }
    dispatch(editDept({ year: currentYear, ...form, name: form.name.trim() }))
    setModal(null)
    showToast(`Department ${form.code} updated`)
  }
  const doDeleteDept = (d) => {
    const subs = departments.filter((x) => x.parentCode === d.code)
    if (subs.length > 0) {
      alert(`Cannot delete Dept ${d.code}: it has ${subs.length} sub-department(s) assigned. Remove their parent assignment first.`)
      return
    }
    if (window.confirm(`Delete department ${d.code}?`)) {
      dispatch(deleteDept({ code: d.code }))
      showToast(`Department ${d.code} deleted`)
    }
  }
  const doCopyPrev = () => {
    const prev = currentYear - 1
    if (!years.find((y) => y.year === prev)) {
      alert(`Budget Year ${prev} does not exist.`)
      return
    }
    if (window.confirm(`Copy department names and manager assignments from Year ${prev} to Year ${currentYear}?`)) {
      dispatch(copyFromPrevYear({ year: currentYear }))
      showToast(`Copied from Year ${prev}`)
    }
  }
  const doExport = () => {
    const rows = [
      ['Dept Code', 'Department Name', 'Allocation Type'],
      ...departments.map((d) => [d.code, getDeptName(d, currentYear), d.allocType]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = `departments_${currentYear}.csv`
    a.click()
  }
  const doImport = (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      alert('รองรับ .csv ก่อนในเวอร์ชันนี้ — .xlsx จะเพิ่มเมื่อต่อ backend (ต้นแบบใช้ SheetJS)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean)
      let added = 0
      lines.slice(1).forEach((line) => {
        const [codeS, name, type] = line.split(',').map((s) => s.replace(/^"|"$/g, '').trim())
        const code = parseInt(codeS)
        if (code && name && !departments.find((d) => d.code === code)) {
          dispatch(
            addDept({ year: currentYear, code, name, allocType: type === 'Indirect' ? 'Indirect' : 'Direct', requester: '', approver: '', reviewer: '' }),
          )
          added++
        }
      })
      showToast(`Imported ${added} department(s)`)
    }
    reader.readAsText(file)
  }

  // ---------- Dept Managers ----------
  const setRole = (code, role, value) => {
    const cur = assign[code] || { requester: '', approver: '', reviewer: '' }
    if (value && role === 'requester' && cur.approver && value === cur.approver) {
      showToast('⚠ Requester cannot be the same person as Approver — not saved', '#b91c1c')
      return
    }
    if (value && role === 'approver' && cur.requester && value === cur.requester) {
      showToast('⚠ Approver cannot be the same person as Requester — not saved', '#b91c1c')
      return
    }
    dispatch(setManagerRole({ year: currentYear, code, role, value }))
    showToast('✓ Saved')
  }
  const noApprover = departments.filter((d) => !(assign[d.code] || {}).approver)

  // ---------- Dept Groups ----------
  const openAddGroup = () => {
    setForm({ name: '', depts: [] })
    setModal({ type: 'addGroup' })
  }
  const openEditGroup = (gi) => {
    const g = groupDefs[gi]
    setForm({ name: g.name, depts: [...g.depts] })
    setModal({ type: 'editGroup', gi })
  }
  const toggleGroupDept = (code) => {
    setForm((f) => ({ ...f, depts: f.depts.includes(code) ? f.depts.filter((c) => c !== code) : [...f.depts, code] }))
  }
  const confirmGroup = () => {
    if (!form.name.trim()) {
      alert('Please enter a group name.')
      return
    }
    const excludeGi = modal.type === 'editGroup' ? modal.gi : -1
    const conflicts = []
    groupDefs.forEach((g, gi) => {
      if (gi === excludeGi) return
      const overlap = form.depts.filter((c) => g.depts.includes(c))
      if (overlap.length) conflicts.push({ group: g.name, codes: overlap })
    })
    if (conflicts.length) {
      alert(
        'Cannot save: the following dept codes are already in other groups:\n' +
          conflicts.map((c) => `• ${c.group}: ${c.codes.join(', ')}`).join('\n') +
          '\n\nPlease deselect them before saving.',
      )
      return
    }
    if (modal.type === 'addGroup') dispatch(addGroup({ name: form.name.trim(), depts: form.depts }))
    else dispatch(editGroup({ index: modal.gi, name: form.name.trim(), depts: form.depts }))
    setModal(null)
    showToast(modal.type === 'addGroup' ? 'Group added' : 'Group updated')
  }

  const takenMap = {}
  groupDefs.forEach((g, gi) => {
    if (modal?.type === 'editGroup' && gi === modal.gi) return
    g.depts.forEach((c) => {
      takenMap[c] = g.name
    })
  })
  const assignedCodes = new Set(groupDefs.flatMap((g) => g.depts))
  const unassignedDepts = departments.filter((d) => !assignedCodes.has(d.code))

  const roleSelect = (code, role, value, options) =>
    locked ? (
      <div className="text-[12px] text-slate-600 px-2 py-[5px] bg-slate-100 border border-slate-200 rounded min-w-[180px]">
        {value || <span className="text-slate-300">—</span>}
      </div>
    ) : (
      <select
        className="border border-slate-300 rounded px-2 py-1 text-[12px] w-full outline-none focus:border-primary disabled:bg-slate-50"
        value={value || ''}
        disabled={isViewer}
        onChange={(e) => setRole(code, role, e.target.value)}
      >
        <option value="">— Not assigned —</option>
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    )

  return (
    <div>
      {/* page-header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[18px] font-bold text-primary-dark">
            Department Setup
            {locked && (
              <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-xl bg-slate-100 text-slate-500 border border-slate-200 ml-2.5 align-middle">
                🔒 Year Closed
              </span>
            )}
          </div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            Define department codes, names, allocation types, and hierarchy. Use the Dept Managers tab to assign who can
            submit manpower plans.
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-proto bg-white text-primary border border-primary hover:bg-primary-light" onClick={doCopyPrev}>
            📋 Copy from Previous Year
          </button>
          <button className="btn-ghost" onClick={doExport}>
            ⬇ Export
          </button>
          <label className="btn-ghost cursor-pointer" title="Import Dept List (CSV — columns: Dept Code, Department Name, Allocation Type)">
            ⬆ Import
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => doImport(e.target.files[0])} />
          </label>
          <button className="btn-prototype-primary" onClick={openAddDept}>
            ＋ Add Department
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm mb-5">
        <div className="p-[18px]">
          {/* tabs ตามต้นแบบ */}
          <div className="flex border-b-2 border-slate-200 mb-[18px]">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-[9px] text-[13px] font-semibold -mb-0.5 border-b-[3px] transition-colors ${
                  tab === t.key ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ---- Tab: Department List ---- */}
          {tab === 'list' && (
            <div id="department-list-table" className="table-scroll">
              <table className="tbl w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Department Name</th>
                    <th>Allocation Type</th>
                    <th className="!text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.code}>
                      <td>
                        <strong>{d.code}</strong>
                      </td>
                      <td>
                        {d.yearNames[currentYear] || getDeptName(d, currentYear) || (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-[.4px] border ${
                            d.allocType === 'Direct'
                              ? 'bg-success-bg text-success border-green-200'
                              : 'bg-warning-bg text-[#b45309] border-amber-200'
                          }`}
                        >
                          {d.allocType}
                        </span>
                      </td>
                      <td className="!text-center whitespace-nowrap">
                        {!locked && (
                          <button className="btn-ghost !px-[7px] !py-[3px] !text-[10px] mr-1" onClick={() => openEditDept(d)}>
                            Edit
                          </button>
                        )}
                        <button
                          className="btn-danger-proto !px-[7px] !py-[3px] !text-[10px]"
                          disabled={locked}
                          onClick={() => doDeleteDept(d)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- Tab: Dept Groups ---- */}
          {tab === 'groups' && (
            <div id="dept-groups-panel" className="table-scroll pr-1" style={{ '--table-offset': '310px' }}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3.5">
                <div className="text-[12px] text-slate-500">
                  Define groups for use in the <strong>By Department (YoY)</strong> analytical report. Groups are global
                  and not year-specific.
                </div>
                <button className="btn-prototype-primary !px-[9px] !py-1 !text-[11px]" onClick={openAddGroup}>
                  ＋ Add Group
                </button>
              </div>
              {groupDefs.length === 0 && (
                <div className="text-center text-slate-400 py-8 italic">
                  No dept groups defined. Click &quot;+ Add Group&quot; to begin.
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {groupDefs.map((g, gi) => (
                  <div key={g.name + gi} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-[13px] text-primary-dark min-w-[120px]">{g.name}</span>
                      <div className="flex-1 flex flex-wrap gap-1">
                        {g.depts.length ? (
                          g.depts.map((code) => {
                            const d = departments.find((x) => x.code === code)
                            return (
                              <span
                                key={code}
                                className="inline-flex items-center gap-1 text-[11px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-700"
                              >
                                {code} <span className="text-slate-400 text-[10px]">{d ? getDeptName(d, currentYear) : `Dept ${code}`}</span>
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No depts assigned</span>
                        )}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button className="btn-ghost !px-[7px] !py-[3px] !text-[10px]" onClick={() => openEditGroup(gi)}>
                          Edit
                        </button>
                        <button
                          className="btn-danger-proto !px-[7px] !py-[3px] !text-[10px]"
                          onClick={() => window.confirm(`Delete group "${g.name}"?`) && dispatch(deleteGroup({ index: gi }))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {unassignedDepts.length > 0 && (
                <div className="mt-2.5 bg-[#fff8ed] border border-dashed border-amber-400 rounded-lg px-4 py-3">
                  <div className="text-[11px] font-bold text-amber-800 mb-2">
                    ⚠ Not assigned to any group ({unassignedDepts.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {unassignedDepts.map((d) => (
                      <span key={d.code} className="text-[11px] bg-amber-100 border border-amber-200 rounded px-2 py-0.5 text-amber-800">
                        {d.code} <span className="text-amber-700 text-[10px]">{getDeptName(d, currentYear)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---- Tab: Dept Managers ---- */}
          {tab === 'managers' && (
            <div>
              {noApprover.length > 0 && (
                <div className="text-[11px] text-danger mb-2 font-semibold">
                  ⚠ {noApprover.length} department(s) have no Approver:{' '}
                  <span className="font-normal">
                    {noApprover.map((d) => `[${d.code}] ${getDeptName(d, currentYear)}`).join(', ')}
                  </span>
                </div>
              )}
              {locked ? (
                <div className="text-[11px] text-slate-400 mb-2.5">Budget Year {currentYear} is closed — read only</div>
              ) : (
                <div className="text-[11px] text-slate-500 mb-2.5">
                  Changes are saved automatically. <strong>Approver</strong> is mandatory; Requester and Reviewer are
                  optional.
                  <br />
                  <span className="text-slate-400 text-[10px]">
                    Requester: input, submit to Approver &amp; recall · Approver: input, submit to Corp Plan &amp; recall ·
                    Reviewer: view only
                  </span>
                </div>
              )}
              <div id="dept-managers-table" className="table-scroll" style={{ '--table-offset': '330px' }}>
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      <th className="stick-l0 w-16 text-slate-400 text-[10px] font-semibold text-left px-2.5 py-1.5 bg-[#f1f5f9]">Code</th>
                      <th className="stick-l1 text-[10px] font-semibold text-left px-2.5 py-1.5 bg-[#f1f5f9]">Department</th>
                      <th className="text-[10px] font-semibold text-left px-2.5 py-1.5 bg-[#f1f5f9] text-slate-500 w-60">
                        Requester <span className="font-normal text-slate-400">(Optional)</span>
                      </th>
                      <th className="text-[10px] font-semibold text-left px-2.5 py-1.5 bg-[#f1f5f9] text-danger w-60">
                        Approver <span className="font-normal text-slate-400">(Mandatory)</span>
                      </th>
                      <th className="text-[10px] font-semibold text-left px-2.5 py-1.5 bg-[#f1f5f9] text-slate-500 w-60">
                        Viewer <span className="font-normal text-slate-400">(Optional)</span>
                      </th>
                      <th className="w-[50px] bg-[#f1f5f9]" />
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((d) => {
                      const roles = assign[d.code] || { requester: '', approver: '', reviewer: '' }
                      return (
                        <tr key={d.code}>
                          <td className="stick-l0 px-2.5 py-1.5 text-slate-500 text-[11px] border-b border-slate-100">{d.code}</td>
                          <td className="stick-l1 px-2.5 py-1.5 text-[12px] border-b border-slate-100 whitespace-nowrap">
                            {getDeptName(d, currentYear)}
                          </td>
                          <td className="px-2.5 py-1.5 border-b border-slate-100">{roleSelect(d.code, 'requester', roles.requester, pool)}</td>
                          <td className="px-2.5 py-1.5 border-b border-slate-100">{roleSelect(d.code, 'approver', roles.approver, pool)}</td>
                          <td className="px-2.5 py-1.5 border-b border-slate-100">{roleSelect(d.code, 'reviewer', roles.reviewer, pool)}</td>
                          <td className="px-2.5 py-1.5 text-center border-b border-slate-100">
                            {roles.approver ? (
                              <span className="text-[12px] text-success">✓</span>
                            ) : (
                              <span className="text-[10px] text-danger font-semibold">⚠</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Add/Edit Department modal ---- */}
      <Modal
        open={modal?.type === 'add' || modal?.type === 'edit'}
        title={modal?.type === 'add' ? 'Add Department' : `Edit Department — ${form.code}`}
        onClose={() => setModal(null)}
        actions={[
          modal?.type === 'add'
            ? { label: 'Add Department', cls: 'btn-prototype-primary', onClick: confirmAddDept }
            : { label: 'Save Changes', cls: 'btn-prototype-primary', onClick: confirmEditDept },
        ]}
      >
        <div className="grid grid-cols-2 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">Dept Code</label>
            <input
              type="number"
              className={`form-control ${modal?.type === 'edit' ? '!bg-slate-100 !text-slate-500' : ''}`}
              placeholder="e.g. 2750"
              value={form.code ?? ''}
              readOnly={modal?.type === 'edit'}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Allocation Type</label>
            <select className="form-control" value={form.allocType} onChange={(e) => setForm({ ...form, allocType: e.target.value })}>
              <option>Direct</option>
              <option>Indirect</option>
            </select>
          </div>
        </div>
        <div className="mb-[15px]">
          <label className="form-label">Department Name {modal?.type === 'edit' ? `(Year ${currentYear})` : ''}</label>
          <input
            className="form-control"
            placeholder="Full department name"
            value={form.name ?? ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="border-t border-slate-200 mt-3.5 pt-3.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[.7px] mb-2.5">Role Assignment</div>
          <div className="text-[10px] text-slate-400 mb-2.5">Approver is mandatory. Requester and Reviewer are optional.</div>
          <div className="grid grid-cols-3 gap-3.5">
            {[
              { key: 'requester', label: 'Requester', mark: '(Optional)', markCls: 'text-slate-400' },
              { key: 'approver', label: 'Approver', mark: '*', markCls: 'text-danger' },
              { key: 'reviewer', label: 'Viewer', mark: '(Optional)', markCls: 'text-slate-400' },
            ].map((r) => (
              <div key={r.key}>
                <label className="form-label">
                  {r.label} <span className={`font-normal ${r.markCls}`}>{r.mark}</span>
                </label>
                <select className="form-control" value={form[r.key] ?? ''} onChange={(e) => setForm({ ...form, [r.key]: e.target.value })}>
                  <option value="">— Not assigned —</option>
                  {pool.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ---- Add/Edit Group modal ---- */}
      <Modal
        open={modal?.type === 'addGroup' || modal?.type === 'editGroup'}
        title={modal?.type === 'addGroup' ? 'Add Dept Group' : 'Edit Dept Group'}
        onClose={() => setModal(null)}
        actions={[
          {
            label: modal?.type === 'addGroup' ? 'Add Group' : 'Save',
            cls: 'btn-prototype-primary',
            onClick: confirmGroup,
          },
        ]}
      >
        <div className="mb-[15px]">
          <label className="form-label">Group Name</label>
          <input
            className="form-control"
            placeholder="e.g. Construction"
            value={form.name ?? ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">
            Assign Dept Codes <span className="font-normal text-slate-400 normal-case">(select all that apply)</span>
          </label>
          <div className="text-[10px] text-orange-600 mb-1.5">⚠ Dept codes shown in orange are already assigned to another group.</div>
          <div className="max-h-[200px] overflow-y-auto border border-slate-200 rounded-md p-2 flex flex-wrap gap-1.5">
            {departments.map((d) => {
              const taken = takenMap[d.code]
              return (
                <label
                  key={d.code}
                  className={`flex items-center gap-1 text-[11px] cursor-pointer px-2 py-[3px] border rounded ${
                    taken ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50'
                  }`}
                  title={taken ? `Already in group: ${taken}` : ''}
                >
                  <input
                    type="checkbox"
                    checked={form.depts?.includes(d.code) || false}
                    onChange={() => toggleGroupDept(d.code)}
                    className="accent-primary-dark"
                  />
                  {d.code} <span className={taken ? 'text-orange-500' : 'text-slate-400'}>{getDeptName(d, currentYear)}</span>
                </label>
              )
            })}
          </div>
        </div>
      </Modal>

      {/* toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-[12px] px-4 py-2 rounded-md shadow-lg z-[300]"
          style={{ background: toast.color || '#1e293b' }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
