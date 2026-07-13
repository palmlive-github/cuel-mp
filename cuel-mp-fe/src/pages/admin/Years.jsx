import PageStub from '../../components/PageStub.jsx'

export default function Years() {
  return (
    <PageStub
      title="Admin Setup — Budget Years"
      subtitle="สร้าง / เปิด / ปิดปีงบประมาณ และตั้ง Reminder Date"
      features={[
        'เพิ่มปี 4 หลัก (2020–2050) ห้ามซ้ำ — ระบบเสนอเลขถัดไป, description default "FY{year}"',
        'ตั้ง Reminder Date สำหรับอีเมลแจ้งเตือนอัตโนมัติ 07:00 น.',
        'Open / Close ปี (Closed = อ่านอย่างเดียวทั้งระบบ, เปิดใหม่ต้องยืนยัน)',
        'แสดงสถานะ Freeze รายชื่อพนักงานของแต่ละปี',
      ]}
    />
  )
}
