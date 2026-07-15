import { MONTHS } from '../constants/index.js'

/**
 * เซลล์ Gantt 12 เดือน ตาม buildScopeGantt ของต้นแบบ:
 * มีทั้ง Start+Finish = แท่งน้ำเงินทึบ (clamp เข้าช่วงปีงบ, เทียบ string เลี่ยง timezone)
 * มีแต่ Start = แท่งฟ้าเส้นประที่เดือน Start · ไม่มีวันที่ = ว่าง
 */
export function ganttCells(year, start, finish) {
  const yrS = String(year)
  return MONTHS.map((m, mi) => {
    const mStr = String(mi + 1).padStart(2, '0')
    let cell = null
    if (start && !finish) {
      const active = (start.slice(0, 4) === yrS && start.slice(5, 7) === mStr) || (start.slice(0, 4) < yrS && mi === 0)
      cell = active ? (
        <div
          className="h-3.5 mx-0.5 rounded-[3px] bg-blue-300 border-[1.5px] border-dashed border-primary-mid"
          title={`Start: ${start} — Finish date not set`}
        />
      ) : (
        <div className="h-3.5 mx-0.5" />
      )
    } else if (start && finish) {
      const effStart = start < `${yrS}-01-01` ? `${yrS}-01-01` : start
      const effEnd = finish > `${yrS}-12-31` ? `${yrS}-12-31` : finish
      const mFirst = `${yrS}-${mStr}-01`
      const mLast = `${yrS}-${mStr}-${String(new Date(year, mi + 1, 0).getDate()).padStart(2, '0')}`
      const active = effStart <= mLast && effEnd >= mFirst
      cell = active ? (
        <div className="h-3.5 mx-0.5 rounded-[3px] bg-primary-mid" title={`${start} → ${finish}`} />
      ) : (
        <div className="h-3.5 mx-0.5" />
      )
    } else {
      cell = <div className="h-3.5 mx-0.5" />
    }
    return (
      <td key={m} className="px-0.5 py-[3px] border-r border-[#eef2f6] border-b border-[#f1f5f9] text-center">
        {cell}
      </td>
    )
  })
}

// dd/mm/yyyy ตาม fmtDate ของต้นแบบ
export const fmtDate = (s) => {
  if (!s) return '—'
  const p = String(s).split('-')
  return p.length === 3 && p[0].length === 4 ? `${p[2]}/${p[1]}/${p[0]}` : s
}
