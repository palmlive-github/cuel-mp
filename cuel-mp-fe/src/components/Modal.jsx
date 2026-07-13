/**
 * Modal ตามต้นแบบ: overlay ดำโปร่ง, กล่องขาว 600px, header/body/footer มีเส้นคั่น
 * footer แสดงปุ่ม Cancel (ghost) + ปุ่ม action ที่ส่งเข้ามา
 */
export default function Modal({ open, title, onClose, children, actions = [] }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 z-[200] flex items-center justify-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-[0_16px_48px_rgba(0,0,0,.3)] w-[600px] max-w-[96vw] max-h-[88vh] flex flex-col">
        <div className="px-[22px] py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-[15px] font-bold text-slate-700">{title}</div>
          <button className="text-xl text-slate-400 hover:text-danger leading-none" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="px-[22px] py-[18px] overflow-y-auto flex-1">{children}</div>
        <div className="px-[22px] py-3 border-t border-slate-200 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          {actions.map((a) => (
            <button key={a.label} className={a.cls || 'btn-prototype-primary'} onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
