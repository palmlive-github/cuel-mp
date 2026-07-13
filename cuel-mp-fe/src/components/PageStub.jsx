/**
 * Placeholder ของหน้าที่ยังไม่ implement
 * ส่วนหัวใช้สไตล์ page-header ตามต้นแบบ: page-title 18px น้ำเงินเข้ม + page-sub 12px เทา
 */
export default function PageStub({ title, subtitle, features = [] }) {
  return (
    <div>
      <div className="mb-5">
        <div className="text-[18px] font-bold text-primary-dark">{title}</div>
        {subtitle && <div className="text-[12px] text-slate-400 mt-0.5">{subtitle}</div>}
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 text-amber-600 font-semibold mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          อยู่ระหว่างพัฒนา (stub)
        </div>
        {features.length > 0 && (
          <>
            <div className="label">ขอบเขตของหน้านี้ตาม Specification</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
