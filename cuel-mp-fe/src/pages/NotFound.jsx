import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl font-black text-slate-200">404</div>
      <p className="text-slate-500 mt-2">ไม่พบหน้าที่ต้องการ</p>
      <Link to="/" className="btn-primary mt-4">
        กลับหน้าหลัก
      </Link>
    </div>
  )
}
