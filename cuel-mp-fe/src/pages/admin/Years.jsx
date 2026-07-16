import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal.jsx'
import { addYear, editYear, closeYear, reopenYear } from '../../store/yearSlice.js'
import { ROLES } from '../../constants/index.js'

// dd/mm/yyyy ตามต้นแบบ fmtDate
const fmtDate = (s) => {
  if (!s) return '—'
  const p = String(s).split('-')
  return p.length === 3 && p[0].length === 4 ? `${p[2]}/${p[1]}/${p[0]}` : s
}

/**
 * Budget Year Setup — ตามต้นแบบ sec-years + renderYears:
 * ตาราง striped 7 คอลัมน์, ปุ่ม Edit / Close Year / Re-open, modal Add / Edit / Close
 * HR = View Only (ซ่อนปุ่มทั้งหมด)
 */
export default function Years() {
  const dispatch = useDispatch()
  const { years } = useSelector((s) => s.year)
  const { user } = useSelector((s) => s.auth)
  const isHR = user?.role === ROLES.HR

  const [modal, setModal] = useState(null) // { type: 'add'|'edit'|'close', year? }
  const [form, setForm] = useState({})
  const sorted = [...years].sort((a, b) => b.year - a.year)

  // ---- open modals (ค่าเริ่มต้นตามต้นแบบ) ----
  const openAdd = () => {
    const next = Math.max(...years.map((b) => b.year), 2025) + 1
    setForm({ year: next, description: `FY${next}`, reminderDate: '' })
    setModal({ type: 'add' })
  }
  const openEdit = (by) => {
    setForm({ year: by.year, description: by.description || '', reminderDate: by.reminderDate || '' })
    setModal({ type: 'edit' })
  }
  const openClose = (by) => setModal({ type: 'close', year: by.year })

  // ---- actions ----
  const confirmAdd = () => {
    const yr = parseInt(form.year)
    if (!yr || yr < 2020 || yr > 2050) {
      alert('Budget Year must be between 2020 and 2050.')
      return
    }
    if (years.find((b) => b.year === yr)) {
      alert('Year already exists.')
      return
    }
    dispatch(addYear({ year: yr, description: form.description || `FY${yr}`, reminderDate: form.reminderDate }))
    setModal(null)
  }
  const confirmEdit = () => {
    dispatch(editYear({ year: form.year, description: form.description, reminderDate: form.reminderDate, updatedBy: user.name }))
    setModal(null)
  }
  const confirmClose = () => {
    dispatch(closeYear({ year: modal.year, updatedBy: user.name }))
    setModal(null)
  }
  const doReopen = (by) => {
    if (window.confirm(`Re-open Budget Year ${by.year}?`)) {
      dispatch(reopenYear({ year: by.year, updatedBy: user.name }))
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div>
      {/* page-header ตามต้นแบบ */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-[18px] font-bold text-primary-dark">Budget Year Setup</div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            Manage annual budget years — status, descriptions and update history
          </div>
        </div>
        {!isHR && (
          <button className="btn-prototype-primary" onClick={openAdd}>
            ＋ Add Budget Year
          </button>
        )}
      </div>

      {/* card + ตาราง striped — scroll ตามขนาดจอ */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="p-[18px]">
          <div id="budget-year-table" className="table-scroll" style={{ '--table-offset': '250px' }}>
          <table className="tbl tbl-striped w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className="w-20">Year</th>
                <th>Description</th>
                <th className="!text-center w-[120px]">Status</th>
                <th className="w-[130px]">Reminder Date</th>
                <th className="w-[120px]">Updated Date</th>
                <th className="w-[140px]">Updated By</th>
                <th className="!text-center w-[180px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="!text-center !text-slate-400 !py-6">
                    No budget years. Click &quot;+ Add Budget Year&quot; to begin.
                  </td>
                </tr>
              )}
              {sorted.map((by) => {
                const isOpen = by.status === 'open'
                return (
                  <tr key={by.year}>
                    <td className="!text-[18px] !font-extrabold !text-primary-dark">{by.year}</td>
                    <td>{by.description || '—'}</td>
                    <td className="!text-center">
                      <span
                        className={`inline-flex items-center gap-[5px] text-[12px] font-bold px-3 py-1 rounded-[20px] ${
                          isOpen ? 'bg-success-bg text-success' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isOpen ? '● Open' : '■ Closed'}
                      </span>
                    </td>
                    <td className={by.reminderDate ? '!text-slate-900' : '!text-slate-400'}>{fmtDate(by.reminderDate)}</td>
                    <td className="!text-slate-500">{fmtDate(by.cutoffDate)}</td>
                    <td className="!text-slate-500">{by.updatedBy || '—'}</td>
                    <td>
                      {isHR ? (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      ) : (
                        <div className="flex gap-1.5 justify-center">
                          <button className="btn-ghost btn-proto-sm" onClick={() => openEdit(by)}>
                            Edit
                          </button>
                          {isOpen ? (
                            <button className="btn-warning-proto btn-proto-sm" onClick={() => openClose(by)}>
                              Close Year
                            </button>
                          ) : (
                            <button className="btn-ghost btn-proto-sm" onClick={() => doReopen(by)}>
                              Re-open
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Add modal */}
      <Modal
        open={modal?.type === 'add'}
        title="Add Budget Year"
        onClose={() => setModal(null)}
        actions={[{ label: 'Create', cls: 'btn-prototype-primary', onClick: confirmAdd }]}
      >
        <div className="grid grid-cols-2 gap-3.5 mb-[15px]">
          <div>
            <label className="form-label">Budget Year</label>
            <input
              type="number"
              min="2020"
              max="2050"
              className="form-control"
              value={form.year ?? ''}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <input
              className="form-control"
              placeholder={`e.g. FY${form.year}`}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="form-label">
            Reminder Date{' '}
            <span className="normal-case font-normal text-slate-400 text-[11px] tracking-normal">
              (send reminder email on this date)
            </span>
          </label>
          <input
            type="date"
            className="form-control"
            value={form.reminderDate ?? ''}
            onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
          />
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={modal?.type === 'edit'}
        title={`Edit Budget Year ${form.year}`}
        onClose={() => setModal(null)}
        actions={[{ label: 'Save', cls: 'btn-prototype-primary', onClick: confirmEdit }]}
      >
        <div className="mb-[15px]">
          <label className="form-label">Description</label>
          <input
            className="form-control"
            value={form.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">
            Reminder Date{' '}
            <span className="normal-case font-normal text-slate-400 text-[11px] tracking-normal">
              (send reminder email on this date)
            </span>
          </label>
          <input
            type="date"
            className="form-control"
            value={form.reminderDate ?? ''}
            onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
          />
        </div>
      </Modal>

      {/* Close Year modal */}
      <Modal
        open={modal?.type === 'close'}
        title={`Close Budget Year ${modal?.year ?? ''}`}
        onClose={() => setModal(null)}
        actions={[{ label: 'Confirm Close', cls: 'btn-danger-proto', onClick: confirmClose }]}
      >
        <div className="alert-warning-proto mb-3.5">Closing prevents new submissions. You may re-open later.</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="form-label">Updated Date</label>
            <input className="form-control !bg-slate-100" value={todayStr} readOnly />
          </div>
          <div>
            <label className="form-label">Updated By</label>
            <input className="form-control !bg-slate-100" value={user?.name || ''} readOnly />
          </div>
        </div>
      </Modal>
    </div>
  )
}
