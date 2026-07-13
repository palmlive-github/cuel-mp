import StatusBadge from '../../components/StatusBadge.jsx'
import PageStub from '../../components/PageStub.jsx'
import { STATUS } from '../../constants/index.js'

export default function DeptSubmissions() {
  return (
    <div>
      <PageStub
        title="Dept Submissions"
        subtitle="บอร์ดตรวจสอบแผนของทุกแผนก (Corp Plan)"
        features={[
          'บอร์ดสถานะทุกแผนก กรองตามปี/สถานะ',
          'คลิกแถวเปิดรายละเอียด: headcount summary, movements (NR/TI/TO/Resign), FTE by project, Year-End HC',
          'Verify ✓ / Reject ✕ (เหตุผลบังคับ) — อีเมลส่งอัตโนมัติ',
          'Unverify: เปลี่ยน Verified → Submitted เมื่อต้องตรวจใหม่',
        ]}
      />
      <div className="card mt-4 p-4">
        <div className="label mb-2">สถานะทั้งหมดในระบบ</div>
        <div className="flex flex-wrap gap-2">
          {Object.values(STATUS).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
