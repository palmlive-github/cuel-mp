import { useDispatch, useSelector } from 'react-redux'
import { setGpField } from '../../store/gpSlice.js'
import { ROLES } from '../../constants/index.js'

/**
 * Graph Priority Setup — ตามต้นแบบ renderGraphPriority:
 * 3 แผง (By Project & Period / By Dept Group / By Emp Type & Period) หัวไล่สีน้ำเงิน/เขียว/ม่วง
 * ใส่เลขแล้วแผงเรียงใหม่อัตโนมัติแบบไม่มีช่องว่าง (clamp + compact ใน gpSlice)
 * HR = ดูได้อย่างเดียว (input disabled)
 */

const EMP_TYPES = ['SN', 'CN', 'SE', 'CE', 'SNW']
const EMP_LABELS = {
  SN: 'SN — Staff National',
  CN: 'CN — Contract National',
  SE: 'SE — Staff Expat',
  CE: 'CE — Contract Expat',
  SNW: 'SNW — Staff National - Worker',
}

export default function GraphPriority() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { currentYear } = useSelector((s) => s.year)
  const projects = useSelector((s) => s.project.byYear[currentYear]) || []
  const groupDefs = useSelector((s) => s.dept.groupDefs)
  const gp = useSelector((s) => s.gp.byYear[currentYear]) || { empType: {}, project: {}, dept: {} }

  const isHR = user?.role === ROLES.HR

  const save = (type, key, value) => dispatch(setGpField({ year: currentYear, type, key, value }))

  // เรียงตามลำดับ (ยังไม่ใส่เลข = ท้ายสุด) ตาม _gpSort
  const sortBy = (arr, valFn) => [...arr].sort((a, b) => (valFn(a) ?? Infinity) - (valFn(b) ?? Infinity))
  const sortedProjs = sortBy(projects, (p) => gp.project[p.name])
  const sortedGroups = sortBy(groupDefs, (g) => gp.dept[g.name])
  const sortedTypes = sortBy(EMP_TYPES, (t) => gp.empType[t])

  const orderInput = (type, key, val) => (
    <input
      type="number"
      min="1"
      max="99"
      placeholder="—"
      disabled={isHR}
      value={val ?? ''}
      onChange={(e) => save(type, key, e.target.value)}
      className={`w-[60px] border border-slate-200 rounded-[5px] px-1.5 py-[3px] text-[12px] text-center outline-none focus:border-primary ${
        isHR ? 'bg-slate-50 cursor-not-allowed' : ''
      }`}
    />
  )

  const panel = (title, sub, gradient, colHeader, rows, emptyText) => (
    <div className="flex-1 min-w-[220px] rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,.08)]">
      <div className="px-4 py-3" style={{ background: gradient }}>
        <div className="text-[13px] font-bold text-white">{title}</div>
        <div className="text-[10px] text-white/70 mt-0.5">{sub}</div>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="px-2.5 py-[7px] text-[11px] text-gray-500 font-semibold text-left bg-slate-50 border-b-2 border-gray-200">
              {colHeader}
            </th>
            <th className="px-2.5 py-[7px] text-[11px] text-gray-500 font-semibold text-center bg-slate-50 border-b-2 border-gray-200">
              Order
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-5 text-center text-gray-400 text-[12px]">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  )

  const mkRow = (type, key, label, val) => (
    <tr key={key}>
      <td className="px-2.5 py-[7px] text-[12px] text-gray-700 border-b border-[#f1f5f9]">{label}</td>
      <td className="px-2.5 py-1 border-b border-[#f1f5f9] text-center">{orderInput(type, key, val)}</td>
    </tr>
  )

  return (
    <div>
      {/* page-header */}
      <div className="mb-5">
        <div className="text-[18px] font-bold text-primary-dark">Graph Priority Setup</div>
        <div className="text-[12px] text-slate-400 mt-0.5">
          Define the stacking order for analytical report charts. Priority 1 = bottom of the stacked area chart.
        </div>
      </div>

      <div className="flex gap-5 flex-wrap items-start">
        {panel(
          'By Project & Period',
          'Chart 1 — Project & Period priority order',
          'linear-gradient(135deg,#2563eb,#1d4ed8)',
          'Project',
          sortedProjs.map((p) => mkRow('project', p.name, p.name, gp.project[p.name])),
          'No projects',
        )}
        {panel(
          'By Dept Group',
          'Chart 2 — Dept group priority order',
          'linear-gradient(135deg,#16a34a,#15803d)',
          'Dept Group',
          sortedGroups.map((g) => mkRow('dept', g.name, g.name, gp.dept[g.name])),
          'No dept groups',
        )}
        {panel(
          'By Emp Type & Period',
          'Chart 3 — By Emp Type & Period priority',
          'linear-gradient(135deg,#7c3aed,#6d28d9)',
          'Emp Type',
          sortedTypes.map((t) => mkRow('empType', t, EMP_LABELS[t] || t, gp.empType[t])),
          '',
        )}
      </div>
    </div>
  )
}
