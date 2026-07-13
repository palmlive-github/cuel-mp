import { STATUS_META } from '../constants/index.js'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-500' }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  )
}
