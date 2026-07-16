import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal.jsx'
import { verify, reject, unverify, SUB_STATUS_LABEL, SUB_STATUS_STYLE } from '../../store/submissionSlice.js'
import { getDeptName } from '../../store/deptSlice.js'
import { fmtDate } from '../../utils/gantt.jsx'
import { ROLES } from '../../constants/index.js'

/**
 * Department Submissions — ตามต้นแบบ sec-submissions + renderSubmissions:
 * stat cards 6 ใบ → filter bar (Department / Manager / Status) → ตาราง striped 9 คอลัมน์
 * Action: 👁 View เสมอ · ✓ Verify + ✕ Reject เมื่อ submitted · Unverify เมื่อ verified · Verify ได้อีกเมื่อ rejected
 * HR = ดูอย่างเดียว (เห็นเฉพาะปุ่ม View)
 */
const EMPTY_ARR = []
const EMPTY_OBJ = {}

export default function DeptSubmissions() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { currentYear } = useSelector((s) => s.year)
  const { departments, managersByYear } = useSelector((s) => s.dept)
  const employees = useSelector((s) => s.employee.byYear[currentYear]) ?? EMPTY_ARR
  const subs = useSelector((s) => s.submission.byYear[currentYear]) ?? EMPTY_OBJ

  const isHR = user?.role === ROLES.HR
  const mgrMap = managersByYear[currentYear] ?? EMPTY_OBJ

  const [filters, setFilters] = useState({ dept: 'all', mgr: 'all', status: 'all' })
  const [modal, setModal] = useState(null) // {type:'reject'|'view', deptCode}
  const [reason, setReason] = useState('')
  const [reasonErr, setReasonErr] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const deptName = (code) => {
    const d = departments.find((x) => x.code === code)
    return d ? getDeptName(d, currentYear) : `Dept ${code}`
  }

  // สถิติหัวหน้า — แผนกไม่มีระเบียน = pending (Draft)
  const counts = useMemo(() => {
    const c = { pending: 0, pending_approver: 0, returned_by_approver: 0, submitted: 0, verified: 0, rejected: 0 }
    departments.forEach((d) => {
      const st = (subs[d.code] || {}).status || 'pending'
      if (c[st] !== undefined) c[st]++
      else c.pending++
    })
    return c
  }, [departments, subs])

  const approvers = useMemo(
    () => [...new Set(departments.map((d) => (mgrMap[d.code] || {}).approver).filter(Boolean))].sort(),
    [departments, mgrMap],
  )

  // แถวที่ผ่าน filter
  const rows = useMemo(
    () =>
      departments
        .map((d) => {
          const sub = subs[d.code] || {}
          const st = sub.status || 'pending'
          const roles = mgrMap[d.code] || {}
          const emps = employees.filter((e) => e.deptCode === d.code && !e.transferOutDate && !e.resignDate)
          return {
            d,
            sub,
            st,
            approver: roles.approver || '—',
            requester: roles.requester || '',
            hc: emps.length,
            direct: emps.filter((e) => e.allocType === 'Direct').length,
            indirect: emps.filter((e) => e.allocType === 'Indirect').length,
          }
        })
        .filter(
          (r) =>
            (filters.dept === 'all' || r.d.code === Number(filters.dept)) &&
            (filters.mgr === 'all' || r.approver === filters.mgr) &&
            (filters.status === 'all' || r.st === filters.status),
        ),
    [departments, subs, mgrMap, employees, filters],
  )

  // ---- actions (ข้อความ confirm ตามต้นแบบ) ----
  const doVerify = (code) => {
    if (window.confirm(`Verify submission for Dept ${code}?`)) {
      dispatch(verify({ year: currentYear, deptCode: code, by: user.name }))
      showToast(`Dept ${code} verified ✓`)
    }
  }
  const openReject = (code) => {
    setReason('')
    setReasonErr(false)
    setModal({ type: 'reject', deptCode: code })
  }
  const confirmReject = () => {
    if (!reason.trim()) {
      setReasonErr(true)
      return
    }
    dispatch(reject({ year: currentYear, deptCode: modal.deptCode, by: user.name, reason: reason.trim() }))
    setModal(null)
    showToast(`Dept ${modal.deptCode} rejected`)
  }
  const doUnverify = (code) => {
    if (window.confirm(`Unverify Dept ${code} (return to Submitted)?`)) {
      dispatch(unverify({ year: currentYear, deptCode: code }))
      showToast(`Dept ${code} unverified`)
    }
  }

  const viewRow = modal?.type === 'view' ? rows.find((r) => r.d.code === modal.deptCode) : null

  const statCard = (label, value, color) => (
    <div className="bg-white rounded-md px-3 py-2.5 shadow-sm border-l-4 border-slate-300 flex items-center justify-between">
      <div className="text-[11px] font-semibold text-slate-400 uppercase">{label}</div>
      <div className="text-[20px] font-extrabold" style={{ color: color || '#1f2937' }}>
        {value}
      </div>
    </div>
  )

  return (
    <div>
      {/* page-header */}
      <div className="mb-5">
        <div className="text-[18px] font-bold text-primary-dark">Department Submissions</div>
        <div className="text-[12px] text-slate-400 mt-0.5">
          Review, verify and reject manpower plan submissions from each department
        </div>
      </div>

      {/* stat cards 6 ใบ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3.5">
        {statCard('Total Depts', departments.length)}
        {statCard('Draft', counts.pending, '#c2410c')}
        {statCard('Pending Approver', counts.pending_approver, '#1a6b8a')}
        {statCard('Submitted', counts.submitted, '#0055bb')}
        {statCard('Verified', counts.verified, '#0a7a3a')}
        {statCard('Rejected', counts.rejected, '#cc2200')}
      </div>

      {/* filter bar */}
      <div className="flex gap-2.5 items-center flex-wrap bg-white rounded-md px-4 py-[11px] mb-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Department:</label>
          <select
            className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] outline-none focus:border-primary"
            value={filters.dept}
            onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} — {deptName(d.code)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Manager:</label>
          <select
            className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] outline-none focus:border-primary"
            value={filters.mgr}
            onChange={(e) => setFilters({ ...filters, mgr: e.target.value })}
          >
            <option value="all">All Managers</option>
            {approvers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase">Status:</label>
          <select
            className="border border-slate-300 rounded-md px-2 py-[5px] text-[12px] outline-none focus:border-primary"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="pending">Draft</option>
            <option value="pending_approver">Pending Approver</option>
            <option value="returned_by_approver">Returned by Approver</option>
            <option value="submitted">Submitted to Corp Plan</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* board */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="px-[18px] py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-700">Manpower Plan Details Report</span>
          <span className="text-[11px] text-slate-400">
            Showing {rows.length} of {departments.length} departments
          </span>
        </div>
        <div className="p-[18px]">
          <div id="submissions-table" className="table-scroll" style={{ '--table-offset': '420px', '--stick-l1': '70px' }}>
          <table className="tbl tbl-striped w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className="stick-l0 w-[70px]">Code</th>
                <th className="stick-l1">Department</th>
                <th className="w-40">Manager</th>
                <th className="!text-center w-[130px]">Status</th>
                <th className="w-[110px]">HC (D/I)</th>
                <th className="w-[110px]">Submitted</th>
                <th className="w-[130px]">By</th>
                <th className="w-[110px]">Verified</th>
                <th className="!text-center w-[210px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="!text-center !text-slate-400 !py-6">
                    No departments found.
                  </td>
                </tr>
              )}
              {rows.map(({ d, sub, st, approver, requester, hc, direct, indirect }) => (
                <tr key={d.code}>
                  <td className="stick-l0">
                    <strong>{d.code}</strong>
                  </td>
                  <td className="stick-l1">{deptName(d.code)}</td>
                  <td className="!text-[11px]">
                    {approver}
                    {requester && requester !== approver && (
                      <>
                        <br />
                        <span className="text-slate-400">Req: {requester}</span>
                      </>
                    )}
                  </td>
                  <td className="!text-center">
                    <span
                      className="text-[10px] font-bold px-2.5 py-[3px] rounded-xl inline-block"
                      style={SUB_STATUS_STYLE[st] || SUB_STATUS_STYLE.pending}
                    >
                      {SUB_STATUS_LABEL[st] || st}
                    </span>
                  </td>
                  <td className="!text-[11px] !text-slate-500">
                    {hc} (D:{direct} I:{indirect})
                  </td>
                  <td className="!text-[11px] !text-slate-500">{fmtDate(sub.submittedDate)}</td>
                  <td className="!text-[11px] !text-slate-500">{sub.submittedBy || '—'}</td>
                  <td className="!text-[11px] !text-slate-500">{fmtDate(sub.verifiedDate)}</td>
                  <td>
                    <div className="flex gap-1 whitespace-nowrap justify-center">
                      <button
                        className="btn-proto !px-[7px] !py-[3px] !text-[10px] bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        onClick={() => setModal({ type: 'view', deptCode: d.code })}
                      >
                        👁 View
                      </button>
                      {!isHR && (st === 'submitted' || st === 'rejected') && (
                        <button
                          className="btn-proto !px-[7px] !py-[3px] !text-[10px] bg-success text-white hover:opacity-90"
                          onClick={() => doVerify(d.code)}
                        >
                          ✓ Verify
                        </button>
                      )}
                      {!isHR && st === 'submitted' && (
                        <button className="btn-danger-proto !px-[7px] !py-[3px] !text-[10px]" onClick={() => openReject(d.code)}>
                          ✕ Reject
                        </button>
                      )}
                      {!isHR && st === 'verified' && (
                        <button className="btn-warning-proto !px-[7px] !py-[3px] !text-[10px]" onClick={() => doUnverify(d.code)}>
                          Unverify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      <Modal
        open={modal?.type === 'reject'}
        title={`Reject Submission — Dept ${modal?.deptCode ?? ''}`}
        onClose={() => setModal(null)}
        actions={[{ label: '✕ Confirm Reject', cls: 'btn-danger-proto', onClick: confirmReject }]}
      >
        <div className="text-[13px] text-gray-700 mb-3">
          Rejecting:{' '}
          <strong>
            {modal?.deptCode} — {modal?.deptCode ? deptName(modal.deptCode) : ''}
          </strong>
        </div>
        <div>
          <label className="form-label">
            Rejection Reason <span className="text-danger">*</span>
          </label>
          <textarea
            rows={4}
            className="form-control !resize-y"
            placeholder="Please describe what needs to be corrected..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setReasonErr(false)
            }}
          />
          {reasonErr && <div className="text-danger text-[11px] mt-1">⚠ Reason is required.</div>}
        </div>
      </Modal>

      {/* View summary modal (ฉบับย่อ — รายละเอียด FTE รายโปรเจกต์จะเพิ่มพร้อม Input Plan) */}
      <Modal
        open={modal?.type === 'view'}
        title={`Dept ${modal?.deptCode ?? ''} — ${modal?.deptCode ? deptName(modal.deptCode) : ''}`}
        onClose={() => setModal(null)}
        actions={[]}
      >
        {viewRow && (
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span
                className="text-[10px] font-bold px-2.5 py-[3px] rounded-xl inline-block"
                style={SUB_STATUS_STYLE[viewRow.st] || SUB_STATUS_STYLE.pending}
              >
                {SUB_STATUS_LABEL[viewRow.st]}
              </span>
              {viewRow.sub.submittedDate && (
                <span className="text-[11px] text-slate-400">
                  Submitted {fmtDate(viewRow.sub.submittedDate)} by {viewRow.sub.submittedBy}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Headcount</div>
                <div className="text-[22px] font-extrabold text-primary-dark">{viewRow.hc}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Direct</div>
                <div className="text-[22px] font-extrabold text-success">{viewRow.direct}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Indirect</div>
                <div className="text-[22px] font-extrabold text-[#b45309]">{viewRow.indirect}</div>
              </div>
            </div>
            {viewRow.sub.verifiedDate && (
              <div className="text-[12px] text-slate-500 mb-2">
                ✓ Verified {fmtDate(viewRow.sub.verifiedDate)} by {viewRow.sub.verifiedBy}
              </div>
            )}
            {viewRow.sub.rejectReason && (
              <div className="px-3.5 py-[11px] rounded-md text-[12px] border-l-4 bg-danger-bg border-danger text-danger">
                <strong>Rejection reason:</strong> {viewRow.sub.rejectReason}
              </div>
            )}
            <div className="text-[10px] text-slate-400 mt-3">
              รายละเอียด movements (NR/TI/TO/Resign) และ FTE by Project จะแสดงเมื่อหน้า Manpower Input พร้อม
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[12px] px-4 py-2 rounded-md shadow-lg z-[300]">
          {toast}
        </div>
      )}
    </div>
  )
}
