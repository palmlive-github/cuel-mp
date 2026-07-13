import PageStub from '../../components/PageStub.jsx'

export default function Departments() {
  return (
    <PageStub
      title="Admin Setup — Departments"
      subtitle="จัดการแผนก กลุ่มแผนก และผู้รับผิดชอบ (HR แก้ไขหน้านี้ได้)"
      features={[
        'Copy from previous year / Import from Excel',
        'กำหนด Approver (บังคับ, ระดับผู้จัดการขึ้นไป), Requester และ Viewer (ไม่บังคับ)',
        'Validation: Approver ≠ Requester, ห้ามลบแผนกที่มีแผนกย่อย',
        'Department Groups (ใช้ในรายงาน YoY) — หนึ่งรหัสแผนกต่อหนึ่งกลุ่ม',
        'การกำหนดชื่อที่นี่ sync role เข้า Permission App อัตโนมัติ',
      ]}
    />
  )
}
