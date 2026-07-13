import PageStub from '../../components/PageStub.jsx'

export default function Projects() {
  return (
    <PageStub
      title="Admin Setup — Projects"
      subtitle="จัดการโปรเจกต์และ Scope Rows ของแต่ละปี"
      features={[
        'เพิ่ม/แก้ไข/ลบโปรเจกต์ — ชื่อห้ามซ้ำภายในปี, "All Projects" เป็นชื่อสงวน (ระบบจัดการเอง)',
        'Scope rows: ชื่อ + Start/Finish (default 1 Jan – 31 Dec) พร้อม Gantt bar',
        'เตือนเมื่อ Start > Finish และเมื่อลบโปรเจกต์ที่มีข้อมูล allocation อ้างอิง',
        'Scope dates เป็นตัวกำหนดเดือนที่เปิดกรอกใน Input Plan',
      ]}
    />
  )
}
