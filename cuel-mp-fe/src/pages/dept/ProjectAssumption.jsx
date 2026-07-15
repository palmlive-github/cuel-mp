import { useSelector } from 'react-redux'
import { MONTHS } from '../../constants/index.js'
import { ganttCells, fmtDate } from '../../utils/gantt.jsx'

/**
 * Project Assumption — ตามต้นแบบ sec-projassumption + renderProjAssumption:
 * หน้าอ้างอิงแบบดูอย่างเดียว (ทุก role เห็น) แสดงกำหนดการทุกโปรเจกต์ของปี (ไม่รวม All Projects)
 * การ์ดต่อโปรเจกต์: ลำดับ, ชื่อ, chip Category, Units + ตาราง Scope/Start/Finish/Gantt 12 เดือน
 */
export default function ProjectAssumption() {
  const { currentYear } = useSelector((s) => s.year)
  const projects = (useSelector((s) => s.project.byYear[currentYear]) || []).filter((p) => p.name !== 'All Projects')

  return (
    <div>
      {/* page-header */}
      <div className="mb-5">
        <div className="text-[18px] font-bold text-primary-dark">Project Assumption</div>
        <div className="text-[12px] text-slate-400 mt-0.5">
          Reference view of project scope dates and schedule for Budget Year <span>{currentYear}</span>. Use this as a
          guide when entering manpower allocations — cells outside a project&apos;s date range will be locked in the
          input plan.
        </div>
      </div>

      {projects.length === 0 && (
        <div className="text-center text-slate-400 py-8">No projects defined for Budget Year {currentYear}.</div>
      )}

      {projects.map((p, pi) => (
        <div key={p.id} className="bg-white border border-slate-200 rounded-[10px] overflow-hidden mb-3">
          {/* card header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border-b border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 min-w-[22px]">{pi + 1}</span>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[13px] text-slate-900">{p.name}</span>
              {p.category && (
                <span
                  className={`text-[9px] font-semibold px-[7px] py-px rounded-[3px] ml-1.5 ${
                    p.category === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {p.category}
                </span>
              )}
              {p.units && <span className="text-[10px] text-slate-500 ml-2">{p.units}</span>}
            </div>
          </div>

          {/* scope table (read-only) */}
          {p.scopes.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-[11px]">
                <thead>
                  <tr className="bg-[#f1f5f9]">
                    <th className="text-left px-3 py-1.5 text-slate-600 text-[10px] font-bold w-40 border-r border-slate-200">
                      Scope
                    </th>
                    <th className="text-center px-2.5 py-1.5 text-slate-600 text-[10px] font-bold w-[105px] border-r border-slate-200">
                      Start
                    </th>
                    <th className="text-center px-2.5 py-1.5 text-slate-600 text-[10px] font-bold w-[105px] border-r border-slate-200">
                      Finish
                    </th>
                    {MONTHS.map((m) => (
                      <th
                        key={m}
                        className="text-center px-0.5 py-1 text-slate-600 text-[9px] font-bold w-9 border-r border-[#eef2f6]"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.scopes.map((sc, si) => (
                    <tr key={si} className={si % 2 ? 'bg-[#fafcff]' : 'bg-white'}>
                      <td className="px-3 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9] text-slate-700 font-medium">
                        {sc.scope || '—'}
                      </td>
                      <td className="px-2 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9] text-center text-slate-700">
                        {fmtDate(sc.start)}
                      </td>
                      <td className="px-2 py-[5px] border-r border-slate-200 border-b border-[#f1f5f9] text-center text-slate-700">
                        {fmtDate(sc.finish)}
                      </td>
                      {ganttCells(currentYear, sc.start, sc.finish)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 text-slate-400 text-[11px] italic">No scope rows defined for this project.</div>
          )}
        </div>
      ))}
    </div>
  )
}
