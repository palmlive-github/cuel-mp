import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

/**
 * สถานะการส่งแผนต่อแผนกต่อปี — โครงตามต้นแบบ S.data.submissions
 * status: pending (=Draft) | pending_approver | returned_by_approver | submitted | verified | rejected
 * แผนกที่ไม่มีระเบียน = pending (Draft)
 */
const initialState = {
  byYear: {
    2027: {
      2500: { status: 'submitted', submittedBy: 'Chi Yiu Wing', submittedDate: '2026-06-20' },
      2520: { status: 'submitted', submittedBy: 'Chi Yiu Wing', submittedDate: '2026-06-20' },
      2530: { status: 'verified', submittedBy: 'Chi Yiu Wing', submittedDate: '2026-06-18', verifiedBy: 'Juntra Laohakunakorn', verifiedDate: '2026-06-25' },
      2540: { status: 'submitted', submittedBy: 'Chi Yiu Wing', submittedDate: '2026-06-21' },
      2730: { status: 'verified', submittedBy: 'Phaisarn Rojthana', submittedDate: '2026-06-15', verifiedBy: 'Juntra Laohakunakorn', verifiedDate: '2026-06-22' },
      2740: { status: 'pending_approver', submittedBy: 'Nandaparth Suthanaudomrux', submittedDate: '2026-07-01' },
      2400: { status: 'rejected', submittedBy: 'Intira Sonmuang', submittedDate: '2026-06-10', rejectReason: 'FTE allocation for Q4 does not match project schedule — please review Oct–Dec.', rejectedBy: 'Juntra Laohakunakorn', rejectedDate: '2026-06-12' },
      2410: { status: 'returned_by_approver', submittedBy: 'Intira Sonmuang', submittedDate: '2026-06-11' },
    },
    2026: {},
    2025: {},
  },
}

const deptOf = (state, year, deptCode) => {
  if (!state.byYear[year]) state.byYear[year] = {}
  if (!state.byYear[year][deptCode]) state.byYear[year][deptCode] = {}
  return state.byYear[year][deptCode]
}
const today = () => dayjs().format('YYYY-MM-DD')

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    // ตาม verifyDept — ล้าง rejectReason
    verify(state, action) {
      const { year, deptCode, by } = action.payload
      const s = deptOf(state, year, deptCode)
      s.status = 'verified'
      s.verifiedBy = by
      s.verifiedDate = today()
      s.rejectReason = null
    },
    // ตาม confirmRejectDept — ล้างข้อมูล verify
    reject(state, action) {
      const { year, deptCode, by, reason } = action.payload
      const s = deptOf(state, year, deptCode)
      s.status = 'rejected'
      s.rejectReason = reason
      s.verifiedBy = null
      s.verifiedDate = null
      s.rejectedBy = by
      s.rejectedDate = today()
    },
    // ตาม unverifyDept — กลับเป็น submitted
    unverify(state, action) {
      const { year, deptCode } = action.payload
      const s = deptOf(state, year, deptCode)
      s.status = 'submitted'
      s.verifiedBy = null
      s.verifiedDate = null
    },
  },
})

export const { verify, reject, unverify } = submissionSlice.actions
export default submissionSlice.reducer

// label + สีป้ายสถานะ ตาม _subStatusLabel / _subStatusStyle
export const SUB_STATUS_LABEL = {
  pending: 'Draft',
  pending_approver: 'Pending Approver',
  returned_by_approver: 'Returned',
  submitted: 'Submitted',
  verified: 'Verified',
  rejected: 'Rejected',
}
export const SUB_STATUS_STYLE = {
  verified: { background: '#0a7a3a', color: '#fff' },
  submitted: { background: '#0055bb', color: '#fff' },
  rejected: { background: '#cc2200', color: '#fff' },
  pending_approver: { background: '#1a6b8a', color: '#fff' },
  returned_by_approver: { background: '#b45309', color: '#fff' },
  pending: { background: '#fff3e6', color: '#c2410c', border: '1px solid #fdba74' },
}
