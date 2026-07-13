// รวม endpoint ทั้งหมดของระบบ — แก้ path ที่เดียว
export const EP = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  years: '/years', // GET, POST | /:year PUT, open/close
  projects: '/projects', // ?year= | scope rows nested
  departments: '/departments', // ?year= | groups, managers
  deptGroups: '/dept-groups',
  employees: '/employees', // ?year= | load-oracle, freeze, unfreeze
  employeesLoadOracle: '/employees/load-oracle',
  employeesFreeze: '/employees/freeze',
  graphPriority: '/graph-priority',
  allocations: '/allocations', // ?year=&dept=
  submissions: '/submissions', // submit, approve, verify, reject, return, recall, unverify
  consolidation: '/consolidation',
  reports: {
    execSummary: '/reports/executive-summary',
    byProject: '/reports/by-project-period',
    byDeptYoY: '/reports/by-department-yoy',
    byEmpType: '/reports/by-emp-type-period',
    byAll: '/reports/by-all',
    byPeriodProject: '/reports/by-period-project',
  },
}
