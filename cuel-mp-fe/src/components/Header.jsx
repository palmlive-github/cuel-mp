import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice.js'
import { setCurrentYear } from '../store/yearSlice.js'

// app-header ตามต้นแบบ: fixed, navy, h 58px — ☰ | logo | Budget Year select | user badge + role tag + Sign Out
export default function Header({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { years, currentYear } = useSelector((s) => s.year)

  return (
    <header className="fixed top-0 left-0 right-0 h-[58px] bg-primary-dark flex items-center px-5 gap-3.5 z-[100] shadow-[0_2px_8px_rgba(0,0,0,.18)]">
      <button
        onClick={onToggleSidebar}
        title="Toggle sidebar"
        className="text-white/80 text-xl px-2 py-1 rounded hover:bg-white/10 leading-none"
      >
        &#9776;
      </button>
      <div className="flex-1 text-white text-[14px] font-bold tracking-[.3px]">
        CUEL <span className="text-accent">Manpower Plan</span> System
      </div>

      <div className="flex items-center gap-[7px] text-white/70 text-[12px]">
        <span>Budget Year:</span>
        <select
          className="bg-white/10 text-white border border-white/20 rounded px-2 py-[5px] text-[12px] font-semibold outline-none [&>option]:bg-primary-dark"
          value={currentYear}
          onChange={(e) => dispatch(setCurrentYear(Number(e.target.value)))}
        >
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year} {y.status === 'closed' ? '(Closed)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-[9px] text-white text-[12px]">
        <span className="bg-white/10 text-white/90 rounded-[20px] px-[11px] py-1">{user?.name}</span>
        <span className="bg-accent text-primary-dark rounded-[3px] px-[7px] py-[2px] text-[10px] font-bold uppercase">
          {user?.role}
        </span>
        <button
          className="border border-white/25 text-white/80 rounded px-2.5 py-[5px] text-[11px] hover:bg-white/10"
          onClick={() => {
            dispatch(logout())
            navigate('/login')
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
