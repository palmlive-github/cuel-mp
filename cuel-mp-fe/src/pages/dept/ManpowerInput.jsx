import { useSearchParams } from 'react-router-dom'
import PageStub from '../../components/PageStub.jsx'

// แท็บ sync กับเมนูย่อยใน Sidebar ผ่าน ?tab= (input | details | summary) ตามต้นแบบ switchInputTab
const TABS = [
  { key: 'input', label: 'Input Plan' },
  { key: 'details', label: 'Review Details' },
  { key: 'summary', label: 'Review Summary' },
]

export default function ManpowerInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'input'

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSearchParams({ tab: t.key })}
            className={`px-4 py-2 text-[13px] font-medium rounded-t-md -mb-px border ${
              tab === t.key
                ? 'bg-white border-slate-200 border-b-white text-primary-mid'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'input' && (
        <PageStub
          title="Manpower Plan — Input Plan"
          subtitle="หน้ากรอกหลัก — พนักงานทุกคนของแผนก แบ่ง Direct / Indirect"
          features={[
            'โครงสร้าง 3 ระดับ: Department header (แถบน้ำเงินเข้ม) → Direct/Indirect section (พับได้) → Employee card',
            'ช่องกรอก 12 เดือนต่อโปรเจกต์ ค่า 0.00–1.00 (ทศนิยม 2 ตำแหน่ง) รวมต่อเดือน = 1.00',
            'ล็อกเดือนนอกช่วง scope / นอกช่วงวันที่ NR-TI-TO-Resign (กฎวันที่ 1 ของเดือน)',
            'ปุ่ม + New Request / + Transfer In (ซ่อนเมื่อส่งแผนแล้วหรือปีถูกล็อก)',
            'ตั้ง Transfer Out / Planned Resign บนการ์ดพนักงาน (ห้ามใส่พร้อมกัน, TO ต้องมี Remark)',
            'เครื่องมือ: Copy Row Above, Clear Row, Fill all months, Copy Allocations Wizard, Save All',
            'Badge ✓ Complete / ⚠ Incomplete + progress bar แบบเรียลไทม์',
            'ปุ่ม Submit พร้อม checklist และ Recall เพื่อดึงแผนกลับ',
          ]}
        />
      )}
      {tab === 'details' && (
        <PageStub
          title="Manpower Plan — Review Details"
          subtitle="มุมมองอ่านอย่างเดียวของแผนทั้งหมด — ตรงกับที่ Approver และ Corp Plan เห็น"
          features={['แสดงพนักงาน แถวโปรเจกต์ และค่ารายเดือนทั้งหมดต่อเนื่องในหน้าเดียว', 'ใช้ตรวจทานก่อน Submit', 'Export']}
        />
      )}
      {tab === 'summary' && (
        <PageStub
          title="Manpower Plan — Review Summary"
          subtitle="สรุปจำนวนพนักงานและความเคลื่อนไหวของแผนก"
          features={[
            'Stat cards: Direct / Indirect headcount',
            'ตารางความเคลื่อนไหว: NR / TI / TO / Resign',
            'Year-End HC = Current + New/TI − TOut/Resign',
          ]}
        />
      )}
    </div>
  )
}
