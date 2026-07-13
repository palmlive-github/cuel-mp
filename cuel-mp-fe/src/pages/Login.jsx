import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../store/authSlice.js'
import { ROLES, ROLE_LABELS } from '../constants/index.js'

/**
 * หน้า Login ตามต้นแบบ page-login:
 * พื้น gradient navy → primary-mid, card 400px (header navy / body ฟอร์ม / footer เส้นคั่น)
 * ระหว่างพัฒนาใช้ mock auth (เลือก role) — ของจริงเรียก EP.auth.login (CEUS)
 */
export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', role: ROLES.REQUESTER })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('กรุณากรอก username และ password')
      return
    }
    // TODO: เปลี่ยนเป็นเรียก API จริงเมื่อ backend พร้อม
    dispatch(
      loginSuccess({
        username: form.username,
        name: form.username,
        role: form.role,
        depts: [],
        token: 'mock-token',
      }),
    )
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary-mid">
      <div className="w-[400px] bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,.25)] overflow-hidden">
        <div className="bg-primary-dark px-9 py-8 text-center">
          <div className="text-accent text-[12px] font-semibold tracking-[2px] uppercase mb-2">CUEL Limited</div>
          <h1 className="text-white text-[20px] font-bold leading-[1.3]">
            Manpower Plan
            <br />
            Management System
          </h1>
        </div>

        <form onSubmit={submit} className="px-9 pt-7 pb-2">
          <div className="mb-[18px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[.8px] mb-[5px]">
              Username
            </label>
            <input
              className="input !py-[9px] !px-[11px]"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoFocus
            />
          </div>
          <div className="mb-[18px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[.8px] mb-[5px]">
              Password
            </label>
            <input
              type="password"
              className="input !py-[9px] !px-[11px]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="mb-[18px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[.8px] mb-[5px]">
              Role (mock — สำหรับพัฒนา)
            </label>
            <select
              className="input !py-[9px] !px-[11px]"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="text-danger text-[12px] mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md py-[11px] text-[14px] font-semibold mt-1.5 hover:bg-primary-dark transition-colors"
          >
            Sign In
          </button>
          <div className="text-[11px] text-slate-400 text-center mt-3.5 mb-4">
            Role-based access: Requester (Dept Manager) · Admin (Corp Plan)
          </div>
        </form>

        <div className="px-9 py-3 border-t border-slate-200 text-[11px] text-slate-400 text-center">
          รองรับ Edge และ Chrome · CEUS Corporate Planning
        </div>
      </div>
    </div>
  )
}
