// ---- Roles (สิทธิ์ระดับแอป — Requester/Approver/Viewer มาจาก Department Setup) ----
export const ROLES = {
  ADMIN: 'admin', // Corp Plan
  HR: 'hr',
  REQUESTER: 'requester',
  APPROVER: 'approver',
  VIEWER: 'viewer',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Corp Plan (Admin)',
  [ROLES.HR]: 'HR',
  [ROLES.REQUESTER]: 'Dept Manager (Requester)',
  [ROLES.APPROVER]: 'Dept Manager (Approver)',
  [ROLES.VIEWER]: 'Viewer',
}

// ---- Submission workflow statuses ----
export const STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVER: 'pending_approver',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  RETURNED_BY_APPROVER: 'returned_by_approver',
}

export const STATUS_META = {
  [STATUS.DRAFT]: { label: 'DRAFT', bg: 'bg-slate-100', text: 'text-slate-600' },
  [STATUS.PENDING_APPROVER]: { label: 'PENDING APPROVER', bg: 'bg-warning-bg', text: 'text-warning' },
  [STATUS.SUBMITTED]: { label: 'SUBMITTED TO CORP PLAN', bg: 'bg-primary-light', text: 'text-primary-mid' },
  [STATUS.VERIFIED]: { label: 'VERIFIED', bg: 'bg-success-bg', text: 'text-success' },
  [STATUS.REJECTED]: { label: 'REJECTED', bg: 'bg-danger-bg', text: 'text-danger' },
  [STATUS.RETURNED_BY_APPROVER]: { label: 'RETURNED BY APPROVER', bg: 'bg-orange-100', text: 'text-orange-600' },
}

// ---- Master enums ----
export const EMP_TYPES = ['SN', 'CN', 'SE', 'CE', 'SNW']
export const ALLOC_TYPES = ['Direct', 'Indirect']
export const LOCATIONS = ['BKK', 'LCB']
export const RECORD_TYPES = { ORIGINAL: 'ORIGINAL', NR: 'NR', TI: 'TI' }

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ---- Allocation rules ----
export const FTE_MIN = 0
export const FTE_MAX = 1
export const FTE_DECIMALS = 2
export const MONTH_TOTAL = 1.0
