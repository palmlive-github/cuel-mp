import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal.jsx'
import {
  addProject,
  renameProject,
  deleteProject,
  setUnits,
  addScopeRow,
  deleteScopeRow,
  setScopeField,
} from '../../store/projectSlice.js'
import { MONTHS } from '../../constants/index.js'
import { ROLES } from '../../constants/index.js'
import { ganttCells } from '../../utils/gantt.jsx'

/**
 * Project Setup — ตามต้นแบบ sec-projects + renderProjects:
 * การ์ดต่อโปรเจกต์ (ลำดับ, ชื่อ + System badge, Units, ปุ่ม Rename / ＋ Add Scope / Delete)
 * ตาราง Scope: ชื่อ / Start / Finish / Gantt 12 เดือน (utils/gantt.jsx) / ปุ่มลบแถว
 * ล็อกทั้งหน้าเมื่อปีปิด (🔒 Year Closed) · HR = View Only
 */

export default function Projects() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { years, currentYear } = useSelector((s) => s.year)
  const projects = useSelector((s) => s.project.byYear[currentYear]) || []

  const isHR = user?.role === ROLES.HR
  const locked = years.find((y) => y.year === currentYear)?.status === 'closed'

  const [modal, setModal] = useState(null) // { type: 'add'|'edit', id? }
  const [name, setName] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ---- project actions (validation messages ตามต้นแบบ) ----
  const openAdd = () => {
    if (locked) {
      showToast(`Budget Year ${currentYear} is closed`)
      return
    }
    setName('')
    setModal({ type: 'add' })
  }
  const confirmAdd = () => {
    const n = name.trim()
    if (!n) {
      alert('Enter project name.')
      return
    }
    if (n === 'All Projects') {
      alert('"All Projects" is a reserved name.')
      return
    }
    if (projects.some((p) => p.name === n)) {
      alert('A project with that name already exists.')
      return
    }
    dispatch(addProject({ year: currentYear, name: n }))
    setModal(null)
  }
  const openEdit = (p) => {
    setName(p.name)
    setModal({ type: 'edit', id: p.id })
  }
  const confirmEdit = () => {
    const n = name.trim()
    if (!n) {
      alert('Project name is required.')
      return
    }
    if (n === 'All Projects') {
      alert('"All Projects" is a reserved name.')
      return
    }
    if (projects.some((p) => p.id !== modal.id && p.name === n)) {
      alert('A project with that name already exists.')
      return
    }
    dispatch(renameProject({ year: currentYear, id: modal.id, name: n }))
    setModal(null)
    showToast('Project renamed ✓')
  }
  const doDelete = (p) => {
    // TODO: เมื่อต่อ backend ให้เช็คจำนวนพนักงานที่มี allocation อ้างอิงและเตือนตามต้นแบบ
    if (window.confirm(`Delete project "${p.name}"?`)) {
      dispatch(deleteProject({ year: currentYear, id: p.id }))
    }
  }

  // ---- scope actions ----
  const onScopeBlur = (p, index, value) => {
    if (!value.trim()) {
      alert('Scope name cannot be empty.')
      return
    }
    dispatch(setScopeField({ year: currentYear, id: p.id, index, field: 'scope', value }))
  }
  const onDateChange = (p, index, field, value) => {
    const sc = p.scopes[index]
    const partner = field === 'start' ? sc.finish : sc.start
    if (value && partner) {
      if (field === 'start' && value > partner) showToast('⚠ Start date is after Finish date')
      else if (field === 'finish' && value < partner) showToast('⚠ Finish date is before Start date')
    }
    dispatch(setScopeField({ year: currentYear, id: p.id, index, field, value }))
  }

  return (
    <div>
      {/* page-header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[18px] font-bold text-primary-dark">
            Project Setup
            {locked && (
              <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-xl bg-slate-100 text-slate-500 border border-slate-200 ml-2.5 align-middle">
                🔒 Year Closed
              </span>
            )}
          </div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            Manage projects for each budget year.{' '}
            <strong className="text-warning">⚠ Do not create a project named &quot;All Projects&quot;</strong> — this
            name is reserved for Indirect employees&apos; manpower input.
          </div>
        </div>
        {!isHR && (
          <button className="btn-prototype-primary" onClick={openAdd}>
            ＋ Add Project
          </button>
        )}
      </div>

      {/* project cards — panel scroll ตามขนาดจอ */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm mb-5">
        <div className="p-[18px]">
          <div id="project-cards-panel" className="table-scroll pr-1" style={{ '--table-offset': '270px' }}>
          {projects.length === 0 && (
            <div className="text-center text-slate-400 py-5">No projects for this year</div>
          )}
          {projects.map((p, pi) => {
            const isSystem = p.id === 0 || p.name === 'All Projects'
            return (
              <div key={p.id} className="bg-white border border-slate-200 rounded-[10px] overflow-hidden mb-3">
                {/* card header */}
                <div
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-slate-200 ${
                    isSystem ? 'bg-info-bg' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-400 min-w-[22px]">{pi + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px] text-slate-900">
                      {p.name}
                      {isSystem && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 rounded px-1.5 py-px font-semibold ml-1.5">
                          System
                        </span>
                      )}
                    </div>
                    {p.category && (
                      <span
                        className={`text-[9px] font-semibold px-[7px] py-px rounded-[3px] ${
                          p.category === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {p.category}
                      </span>
                    )}
                  </div>
                  {!isSystem && (
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold">Units:</label>
                      <input
                        type="text"
                        defaultValue={p.units || ''}
                        placeholder="e.g. 4 Jackets"
                        disabled={locked || isHR}
                        onBlur={(e) => {
                          dispatch(setUnits({ year: currentYear, id: p.id, units: e.target.value }))
                          showToast('✓ Saved')
                        }}
                        className="border border-slate-200 rounded-[5px] px-2 py-[3px] text-[11px] w-[120px] outline-none text-slate-700 disabled:bg-slate-50"
                      />
                    </div>
                  )}
                  <div className="flex gap-1 shrink-0">
                    {!locked && !isSystem && !isHR && (
                      <button className="btn-ghost !px-[7px] !py-[3px] !text-[10px]" onClick={() => openEdit(p)}>
                        Rename
                      </button>
                    )}
                    {!locked && !isSystem && !isHR && (
                      <button
                        className="btn-prototype-primary !px-2 !py-[2px] !text-[10px]"
                        onClick={() => dispatch(addScopeRow({ year: currentYear, id: p.id }))}
                      >
                        ＋ Add Scope
                      </button>
                    )}
                    {!isSystem && !isHR ? (
                      <button
                        className="btn-danger-proto !px-[7px] !py-[3px] !text-[10px]"
                        disabled={locked}
                        onClick={() => doDelete(p)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">{isSystem ? 'Protected' : 'View Only'}</span>
                    )}
                  </div>
                </div>

                {/* scope table */}
                {!isSystem &&
                  (p.scopes.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-[#f1f5f9]">
                            <th className="text-left px-3 py-1.5 text-slate-600 text-[10px] font-bold w-40 border-r border-slate-200">
                              Scope
                            </th>
                            <th className="text-center px-2.5 py-1.5 text-slate-600 text-[10px] font-bold w-[105px] border-r border-slate-200">
                              Start
                            </th>
                            <th className="text-center px-2.5 py-1.5 text-slate-600 text-[10px] font-bold w-[105px] border-r border-slate-200">
                              Finish
                            </th>
                            {MONTHS.map((m) => (
                              <th
                                key={m}
                                className="text-center px-0.5 py-1 text-slate-600 text-[9px] font-bold w-9 border-r border-[#eef2f6]"
                              >
                                {m}
                              </th>
                            ))}
                            {!locked && <th className="w-[50px] border-l border-slate-200 p-1" />}
                          </tr>
                        </thead>
                        <tbody>
                          {p.scopes.map((sc, si) => (
                            <tr key={si} className={si % 2 ? 'bg-[#fafcff]' : 'bg-white'}>
                              <td className="px-3 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9]">
                                <input
                                  type="text"
                                  defaultValue={sc.scope || ''}
                                  placeholder="e.g. Engineering"
                                  disabled={locked || isHR}
                                  onBlur={(e) => onScopeBlur(p, si, e.target.value)}
                                  className="border border-slate-200 rounded px-1.5 py-[2px] text-[11px] w-full outline-none text-slate-700 disabled:bg-slate-50"
                                />
                              </td>
                              <td className="px-2 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9] text-center">
                                <input
                                  type="date"
                                  value={sc.start || ''}
                                  disabled={locked || isHR}
                                  onChange={(e) => onDateChange(p, si, 'start', e.target.value)}
                                  className="border border-slate-200 rounded px-[5px] py-[2px] text-[10px] outline-none text-slate-700 disabled:bg-slate-50"
                                />
                              </td>
                              <td className="px-2 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9] text-center">
                                <input
                                  type="date"
                                  value={sc.finish || ''}
                                  disabled={locked || isHR}
                                  onChange={(e) => onDateChange(p, si, 'finish', e.target.value)}
                                  className="border border-slate-200 rounded px-[5px] py-[2px] text-[10px] outline-none text-slate-700 disabled:bg-slate-50"
                                />
                              </td>
                              {ganttCells(currentYear, sc.start, sc.finish)}
                              {!locked && (
                                <td className="text-center border-l border-slate-200 border-b border-[#f1f5f9] p-0.5">
                                  {!isHR && (
                                    <button
                                      onClick={() => dispatch(deleteScopeRow({ year: currentYear, id: p.id, index: si }))}
                                      className="border border-red-300 text-red-600 rounded-[3px] text-[9px] px-[5px] py-px leading-[1.4] hover:bg-red-50"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-3.5 py-2.5 text-slate-400 text-[11px] italic">
                      No scope defined — click &quot;＋ Add Scope&quot; to add scope rows with start/finish dates.
                    </div>
                  ))}
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={!!modal}
        title={modal?.type === 'add' ? 'Add Project' : 'Edit Project'}
        onClose={() => setModal(null)}
        actions={[
          modal?.type === 'add'
            ? { label: 'Add', cls: 'btn-prototype-primary', onClick: confirmAdd }
            : { label: 'Save', cls: 'btn-prototype-primary', onClick: confirmEdit },
        ]}
      >
        <div>
          <label className="form-label">Project Name</label>
          <input
            className="form-control"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>

      {/* toast ตามต้นแบบ showToast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[12px] px-4 py-2 rounded-md shadow-lg z-[300]">
          {toast}
        </div>
      )}
    </div>
  )
}
