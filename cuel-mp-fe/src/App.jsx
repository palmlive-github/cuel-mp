import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { ROLES } from './constants/index.js'

import Login from './pages/Login.jsx'
import ProjectAssumption from './pages/dept/ProjectAssumption.jsx'
import ManpowerInput from './pages/dept/ManpowerInput.jsx'
import AnalyticalReport from './pages/reports/AnalyticalReport.jsx'
import Years from './pages/admin/Years.jsx'
import Projects from './pages/admin/Projects.jsx'
import Departments from './pages/admin/Departments.jsx'
import Employees from './pages/admin/Employees.jsx'
import GraphPriority from './pages/admin/GraphPriority.jsx'
import DeptSubmissions from './pages/corpplan/DeptSubmissions.jsx'
import Consolidation from './pages/corpplan/Consolidation.jsx'
import NotFound from './pages/NotFound.jsx'

// หน้าแรกตาม role: Admin/HR → Dept Submissions, อื่น ๆ → Manpower Input
function HomeRedirect() {
  const { user } = useSelector((s) => s.auth)
  const isBackOffice = user?.role === ROLES.ADMIN || user?.role === ROLES.HR
  return <Navigate to={isBackOffice ? '/corp-plan/dept-submissions' : '/manpower-input'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />

          {/* ทุก role เห็นได้ */}
          <Route path="/project-assumption" element={<ProjectAssumption />} />
          <Route path="/manpower-input" element={<ManpowerInput />} />
          <Route path="/analytical-report" element={<AnalyticalReport />} />

          {/* Admin + HR (HR อ่านทุกหน้า แก้ได้เฉพาะ Departments/Employees — บังคับใน page logic) */}
          <Route element={<ProtectedRoute allow={[ROLES.ADMIN, ROLES.HR]} />}>
            <Route path="/admin/years" element={<Years />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/graph-priority" element={<GraphPriority />} />
            <Route path="/corp-plan/dept-submissions" element={<DeptSubmissions />} />
            <Route path="/corp-plan/consolidation" element={<Consolidation />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
