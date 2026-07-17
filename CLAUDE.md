# CLAUDE.md — CUEL Manpower Plan

คำแนะนำสำหรับ Claude (และ AI assistant อื่น) เมื่อทำงานในโฟลเดอร์นี้

## ภาพรวมโปรเจกต์

ระบบ Manpower Plan ของ CUEL (Corporate Planning) — เว็บแอปแทนการวางแผนอัตรากำลังด้วย Excel
แต่ละแผนกกรอกสัดส่วน FTE รายเดือน (พนักงาน × โปรเจกต์) ของปีงบประมาณ แล้วส่งตามสาย
Requester → Approver → Corp Plan (Verify/Reject) พร้อมอีเมลแจ้งเตือนอัตโนมัติ

## โครงสร้างโฟลเดอร์

```
Specification/                       ⛔ READ-ONLY — ห้ามแก้ไข/ลบเด็ดขาด
  Manpower_Plan.html                 prototype ที่รันได้จริงทั้งระบบ = แหล่งอ้างอิงหลักของทุก UI/logic
  Manpower_Plan_Email_Notification_Design.html   อีเมล T1–T6 + Reminder
  CUEL_ManpowerPlan_UserGuide_20260709.pptx      user guide ต้นฉบับ
cuel-mp-fe/                          Frontend — React 18 + Vite 5 + Redux Toolkit + Tailwind 3
cuel-mp-be/                          Backend — ASP.NET Core 7 + EF Core 7 (SQL Server)
Manpower_Plan_Database_Design.docx   Database schema 15 ตาราง (ออกแบบแล้ว ยังไม่สร้างจริง)
Manpower_Plan_ERD.mermaid            ER diagram
CUEL_ManpowerPlan_UserGuide_20260709_TH.pptx     user guide แปลไทย
readme.txt                           โน้ตส่วนตัวของทีม (มี credentials ทดสอบ — ห้ามเผยแพร่/ห้าม commit)
```

## กติกาที่ต้องทำทุกครั้ง (สำคัญ)

1. **Specification เป็น read-only** — อ่านได้เท่านั้น deliverables ทั้งหมดวางนอกโฟลเดอร์นี้
2. **ทุก UI/logic ต้องเทียบกับ prototype** `Specification/Manpower_Plan.html` — ดึงค่าจริง (สี, ขนาด, ข้อความ
   validation, อัลกอริทึม) จากโค้ด prototype ห้ามกะเอา และจบงานด้วยรายงานผลเทียบเป็นตาราง
3. **แก้โค้ด fe แล้วต้องอัพเดท `cuel-mp-fe/README.md`** — ทั้งส่วนสถานะและ Changelog (`### YYYY-MM-DD`)
4. **ก่อนปิดงาน fe ต้องผ่าน** `npm run lint` (max-warnings 0) และ `npm run build`
5. **โฟลเดอร์นี้เป็น reference copy** — งานพัฒนาจริงอยู่ใน git repo (branch `dev`) ของทีม
   อ่านไฟล์ปัจจุบันก่อนแก้เสมอ อย่า assume ว่าตรงกับ working copy
6. ห้ามบันทึก/เผยแพร่ credentials จาก `readme.txt` หรือ `appsettings*.json`

## cuel-mp-fe (Frontend)

```bash
npm install && npm run dev    # localhost:5173 (proxy /api → https://ceus)
npm run lint && npm run build # ต้องผ่านก่อนส่งงาน
```

- **สถานะ**: Admin Setup ครบ 5 หน้า (Years/Projects/Departments/Employees/Graph Priority),
  Project Assumption, Dept Submissions, Consolidation เสร็จ — เหลือ **Manpower Input (Input Plan)** และ
  **Analytical Report** · ข้อมูลทั้งหมดยังเป็น mock ใน Redux slices
- **Auth ยังเป็น mock** — ของจริง: CEUS ส่ง `/login?Session=xxx` → `POST /api/authentications/Token`
- **แบบแผนโค้ด**: หน้าอยู่ `src/pages/<role>/`, mock data + reducers อยู่ `src/store/<x>Slice.js`,
  กฎธุรกิจกลางอยู่ `src/utils/manpower.js` (getValidMonthRange = กฎวันที่ 1, getProjMonthRange = Min/Max scope),
  Gantt กลางอยู่ `src/utils/gantt.jsx`, CSS ชุดต้นแบบอยู่ `src/index.css` (`btn-proto*`, `form-control`, `tbl` ฯลฯ),
  ตารางใหญ่ครอบ `.table-scroll` จาก `src/styles/table.css` (sticky header + sticky คอลัมน์ซ้าย, offset ผ่าน `--table-offset`)
- สี theme ตาม prototype: primary `#3b82f6`, primary-dark `#1e3a8a`, ฟอนต์ Inter 13px

## cuel-mp-be (Backend)

```bash
dotnet run   # localhost:5170 — Swagger ที่ root (Development)
```

- **เสร็จแล้ว**: Auth ครบ — CEUS Session SSO (ApplicationCode B0037) → JWT access 15 นาที + refresh 7 วัน,
  endpoints `/api/authentications/Token|Refresh|Me`, JwtMiddleware, roles: Admin MP0001 / HR MP0002 / User MP0003
  (+ Developper MP0000 bypass ผ่าน `AppSettings.Developpers`)
- **CEUS DB**: scaffold read-only แล้ว (`Models/CEUS`, `DatabaseCeusContext`) — ห้ามเขียนลง CEUS
- **MP database สร้าง + scaffold แล้ว** (2026-07-17, จาก `Manpower_Plan_Database_Create.sql` rev.6 —
  ตาราง PascalCase, PK = id IDENTITY, SQL Server 2012) — entities 15 ตัวอยู่ที่ `Models/` (root),
  context ชื่อ `DatabaseContext` ใน `Database/`, มี Migrations baseline `InitialCreate` แล้ว
  (ระวัง: `DatabaseCeusContext` เป็น read-only ห้ามทำ migration)
- **ยังไม่มี**: business APIs ทุกตัว, email service (T1–T6/Reminder — Smtp config มีแล้ว), Oracle job 22:00
- ของค้างจากโปรเจกต์ MSR ที่รอเก็บกวาด: WeatherForecastController, Jwt issuer `msr-api`, permissions MSR001-5
- Environment: Development ใช้ `appsettings.Development.json` (devf-ceus / DEVF-SVRDB15) ·
  Staging/Prod serve React build ในตัว (SPA fallback)

## กฎธุรกิจหลักที่ต้องไม่พลาด (จาก Specification)

- FTE ต่อเซลล์ 0.00–1.00 ทศนิยม 2 ตำแหน่ง · **ผลรวมทุกโปรเจกต์ของแต่ละเดือนที่เปิดกรอก = 1.00 พอดี**
- เดือนที่เปิดกรอก = ช่วง scope โปรเจกต์ (Min Start–Max Finish, clamp เข้าปีงบ) ∩ ช่วงตามวันที่ movement
- **กฎวันที่ 1**: TO/Resign ลงวันที่ 1 → เดือนก่อนหน้าคือเดือนสุดท้ายที่ต้องกรอก
- TO กับ Planned Resign ใส่พร้อมกันไม่ได้ (ใส่อันหนึ่งล้างอีกอัน) · TO ต้องมี Remark ไม่งั้น Submit ไม่ได้
- Indirect ใช้แถว "All Projects" แถวเดียว auto-fill 1.0 · "All Projects" เป็นชื่อสงวน ระบบสร้างเองทุกปี
- Workflow: Draft → Pending Approver → Submitted → Verified (+ Rejected ต้องมีเหตุผล, Returned ต้องมี comment,
  Recall, Unverify) — ถ้าแผนกไม่มี Requester ให้ Approver ส่งตรง Corp Plan
- Load Oracle ถูกบล็อกเมื่อมีแผนกกรอกข้อมูลแล้ว · ต้อง Freeze รายชื่อก่อนเปิดให้กรอก · ปี Closed = ล็อกทุกอย่าง
- Approver ≠ Requester · Approver ต้องเป็นระดับผู้จัดการขึ้นไปที่ active
- Resign Date และ Remark ไม่ได้มาจาก Oracle — HR กรอกเอง

## งานถัดไปตามลำดับที่วางไว้

1. เชื่อม FE auth เข้า BE จริง (Session flow + refresh interceptor)
2. สร้าง MP database ตาม `Manpower_Plan_Database_Design.docx` + scaffold เข้า BE
3. Business APIs (เริ่ม Years/Departments) แล้วถอด mock ใน FE slices ทีละตัว
4. หน้า Manpower Input (Input Plan) — ชิ้นใหญ่สุด ใช้ helpers ใน `src/utils/manpower.js` ที่ port ไว้แล้ว
5. Analytical Report 6 แท็บ + email service + Oracle job
