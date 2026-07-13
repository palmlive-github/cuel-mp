import PageStub from '../../components/PageStub.jsx'

export default function ProjectAssumption() {
  return (
    <PageStub
      title="Project Assumption"
      subtitle="ตารางอ้างอิงกำหนดการโปรเจกต์ (อ่านอย่างเดียว) — กำหนดเดือนที่เปิดกรอกใน Input Plan"
      features={[
        'ตารางโปรเจกต์: Scope, Start/Finish Date, Gantt Bar (Jan–Dec)',
        'Active window ตามกฎ Min/Max: เดือนแรก = Start เร็วสุด, เดือนสุดท้าย = Finish ช้าสุด จากทุก scope row',
        'เดือนนอกช่วงแสดงเป็นสีเทา (ตรงกับที่ระบบล็อกใน Input Plan)',
        'กรองตามปีงบประมาณจาก year selector ด้านบน',
      ]}
    />
  )
}
