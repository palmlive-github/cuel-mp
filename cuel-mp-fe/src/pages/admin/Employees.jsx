import PageStub from '../../components/PageStub.jsx'

export default function Employees() {
  return (
    <PageStub
      title="Admin Setup — Employees"
      subtitle="Load Oracle → Freeze → แผนกเริ่มกรอก (HR แก้ไขหน้านี้ได้)"
      features={[
        'Load Oracle Employee Data (จากตาราง staging ที่ job โหลดทุกวัน 22:00 น.)',
        'บล็อกการโหลดซ้ำเมื่อมีแผนกกรอกข้อมูลแล้ว',
        'Freeze / Unfreeze รายชื่อ (ต้อง Freeze ก่อนเริ่มกรอก)',
        'เพิ่ม/แก้ไข/ลบพนักงาน — Emp Code ไม่ซ้ำภายในปี, ลบแล้วข้อมูล allocation ของปีนั้นหายด้วย (ต้องยืนยัน)',
        'Resign Date และ Remark ไม่ได้มาจาก Oracle — HR กรอกเอง',
        'จัดประเภท: Employee Type SN/CN/SE/CE/SNW · Allocation Type Direct/Indirect · Location BKK/LCB',
      ]}
    />
  )
}
