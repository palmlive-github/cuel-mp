import PageStub from '../../components/PageStub.jsx'

export default function Consolidation() {
  return (
    <PageStub
      title="Consolidation"
      subtitle="มุมมองรวมทั้งบริษัทของปีที่เลือก"
      features={[
        'แผนอัตรากำลังทุกแผนกในมุมมองเดียว',
        'ยอดรวม FTE ทุกแผนกและทุกโปรเจกต์',
        'สถานะการส่งของแต่ละแผนก + Remark (ค่า override จากผู้จัดการ)',
        'Export',
      ]}
    />
  )
}
