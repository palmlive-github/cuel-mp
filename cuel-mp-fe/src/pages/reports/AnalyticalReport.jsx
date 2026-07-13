import { useState } from 'react'
import PageStub from '../../components/PageStub.jsx'

const TABS = [
  { key: 'exec', label: 'Executive Summary' },
  { key: 'r1', label: 'By Project & Period' },
  { key: 'r2', label: 'By Department (YoY)' },
  { key: 'r3', label: 'By Emp Type & Period' },
  { key: 'r4', label: 'By All' },
  { key: 'r5', label: 'By Period × Project' },
]

const CONTENT = {
  exec: {
    subtitle: 'แดชบอร์ดหน้าเดียว — แท็บเริ่มต้นของ Analytics Report',
    features: [
      'Stat cards 5 ใบ: Current Staff · New Request · Transfer In · Resign/TO · Year-End HC',
      'Multi-Year Headcount Comparison (เทียบได้สูงสุด 3 ปี)',
      'กราฟ: By Employment Type · Direct vs Indirect (donut) · HC by Department (Top 5) · Project Allocation (Top 5)',
      'Dept Manager เห็นเฉพาะแผนกตนเอง / Corp Plan เห็นทั้งบริษัท',
    ],
  },
  r1: {
    subtitle: 'FTE ของแต่ละโปรเจกต์ตลอด 12 เดือน',
    features: ['Stacked area chart (ลำดับตาม Graph Priority)', 'Export CSV'],
  },
  r2: {
    subtitle: 'เปรียบเทียบจำนวนพนักงานปีงบประมาณกับปีก่อนหน้า ตาม Department Group',
    features: ['พับ/ขยายกลุ่มได้', 'กราฟรวมตามกลุ่ม + กราฟความเคลื่อนไหว', 'เส้นประเทา = แนวโน้มรวมทุกแผนก'],
  },
  r3: {
    subtitle: 'FTE แยกตามประเภทพนักงาน (SN · CN · SE · CE · SNW)',
    features: ['คอลัมน์ Baseline (ณ วัน freeze ล่าสุด) และ Max (เดือนสูงสุด)'],
  },
  r4: {
    subtitle: 'มุมมองละเอียดสุด: แผนก × โปรเจกต์ × ประเภทพนักงาน × ช่วงเวลา',
    features: ['ตารางลำดับชั้น ขยาย/พับรายแผนก + Expand/Collapse All', 'คอลัมน์ baseline สีเหลืองของปีก่อน', 'Export CSV (ขยายทุกแถว)'],
  },
  r5: {
    subtitle: 'FTE รายโปรเจกต์รวมทุกแผนก แยกช่วงเวลาและประเภทพนักงาน',
    features: ['แถว Grand Total', 'ตัวกรอง Department', 'ตารางเลื่อนแนวนอน 12 เดือน + Export CSV'],
  },
}

export default function AnalyticalReport() {
  const [tab, setTab] = useState('exec')
  const c = CONTENT[tab]

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-[12px] font-medium rounded-t-md -mb-px border ${
              tab === t.key
                ? 'bg-white border-slate-200 border-b-white text-primary-mid'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <PageStub title={TABS.find((t) => t.key === tab).label} subtitle={c.subtitle} features={c.features} />
    </div>
  )
}
