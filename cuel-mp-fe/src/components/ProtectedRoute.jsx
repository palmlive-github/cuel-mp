import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

/**
 * กันหน้า — ต้อง login และ (ถ้าระบุ) role ต้องอยู่ใน allow list
 * <Route element={<ProtectedRoute allow={['admin','hr']} />}> ... </Route>
 */
export default function ProtectedRoute({ allow }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allow && !allow.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
