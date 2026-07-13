import PageStub from '../../components/PageStub.jsx'

export default function GraphPriority() {
  return (
    <PageStub
      title="Admin Setup — Graph Priority"
      subtitle="กำหนดลำดับชุดข้อมูลกราฟของรายงานวิเคราะห์"
      features={[
        '3 แผง: Project / Dept Group / Employee Type',
        'เลข 1 วาดก่อน (ล่างสุดของ stacked chart)',
        'พิมพ์เลขแล้วแถวอื่นเรียงใหม่อัตโนมัติ (ห้ามซ้ำในแผงเดียวกัน)',
      ]}
    />
  )
}
