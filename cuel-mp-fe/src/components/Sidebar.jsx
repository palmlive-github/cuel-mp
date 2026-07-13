import { useSelector } from 'react-redux'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { ROLES } from '../constants/index.js'

/**
 * Sidebar ตามต้นแบบ (buildSidebar ใน Manpower_Plan.html):
 * พื้นขาว กว้าง 230px, sb-title เทาตัวพิมพ์ใหญ่, nav-item active = ฟ้าอ่อน + เส้นซ้ายฟ้า
 * Dept role มีเมนูย่อยใต้ Manpower Plan: Input Plan / Review Details / Review Summary
 */

const ADMIN_MENU = [
  {
    section: 'Admin Setup',
    items: [
      { to: '/admin/years', icon: '📅', label: 'Budget Years', hrView: true },
      { to: '/admin/projects', icon: '📋', label: 'Projects', hrView: true },
      { to: '/admin/departments', icon: '🏢', label: 'Departments' },
      { to: '/admin/employees', icon: '👥', label: 'Employees' },
      { to: '/admin/graph-priority', icon: '📊', label: 'Graph Priority', hrView: true },
    ],
  },
  {
    section: 'Corp Plan',
    items: [
      { to: '/project-assumption', icon: '📐', label: 'Project Assumption', hrView: true },
      { to: '/corp-plan/dept-submissions', icon: '📩', label: 'Dept Submissions', hrView: true },
      { to: '/corp-plan/consolidation', icon: '📊', label: 'Consolidation', hrView: true },
      { to: '/analytical-report', icon: '📈', label: 'Analytical Report', hrView: true },
    ],
  },
]

const INPUT_SUBS = [
  { tab: 'input', label: 'Input Plan' },
  { tab: 'details', label: 'Review Details' },
  { tab: 'summary', label: 'Review Summary' },
]

const ROLE_TITLE = {
  [ROLES.REQUESTER]: 'Requester',
  [ROLES.APPROVER]: 'Approver',
  [ROLES.VIEWER]: 'Viewer',
}

function NavItem({ to, icon, label, viewTag }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-[9px] px-[17px] py-2 text-[13px] border-l-[3px] transition-colors ${
          isActive
            ? 'bg-primary-light text-primary border-primary font-semibold'
            : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-800'
        }`
      }
    >
      <span className="w-4 text-center text-[13px]">{icon}</span> {label}
      {viewTag && <span className="text-[9px] text-slate-400 ml-1">(View)</span>}
    </NavLink>
  )
}

export default function Sidebar({ collapsed }) {
  const { user } = useSelector((s) => s.auth)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const role = user?.role
  const isAdmin = role === ROLES.ADMIN
  const isHR = role === ROLES.HR

  const activeTab = location.pathname === '/manpower-input' ? searchParams.get('tab') || 'input' : null

  return (
    <aside
      className={`fixed top-[58px] left-0 bottom-0 bg-white border-r border-slate-200 overflow-y-auto overflow-x-hidden
        whitespace-nowrap z-[90] transition-[width] duration-200 ${collapsed ? 'w-0' : 'w-[230px]'}`}
    >
      {isAdmin || isHR ? (
        ADMIN_MENU.map((g) => (
          <div key={g.section} className="pt-3.5 pb-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] px-[17px] mb-[3px]">
              {isHR && g.section === 'Admin Setup' ? 'HR Setup' : g.section}
            </div>
            {g.items.map((it) => (
              <NavItem key={it.to} {...it} viewTag={isHR && it.hrView} />
            ))}
          </div>
        ))
      ) : (
        <div className="pt-3.5 pb-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] px-[17px] mb-[3px]">
            {ROLE_TITLE[role] || 'My Tasks'}
          </div>
          <NavItem to="/project-assumption" icon="📐" label="Project Assumption" />
          <NavItem to="/manpower-input" icon="📝" label="Manpower Plan" />
          {INPUT_SUBS.map((s) => (
            <NavLink
              key={s.tab}
              to={`/manpower-input?tab=${s.tab}`}
              className={`flex items-center pl-[38px] pr-[17px] py-[5px] text-[11.5px] border-l-[3px] transition-colors ${
                activeTab === s.tab
                  ? 'bg-primary-light text-primary border-primary font-semibold'
                  : 'text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              · {s.label}
            </NavLink>
          ))}
          <NavItem to="/analytical-report" icon="📊" label="Analytical Report" />
        </div>
      )}
    </aside>
  )
}
