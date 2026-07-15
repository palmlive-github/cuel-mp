# cuel-mp-fe — CUEL Manpower Plan (Frontend)

Web frontend ของระบบ Manpower Plan (Corporate Planning) — React 18 + Vite 5 + Redux Toolkit + Tailwind CSS
Layout และทุกหน้าอ้างอิงต้นแบบ `../Specification/Manpower_Plan.html` (อ่านอย่างเดียว)

## เริ่มต้น

```bash
npm install
cp .env.example .env   # แก้ค่า VITE_API_BASE_URL ตาม backend
npm run dev            # http://localhost:5173
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | dev server (proxy `/api` → `https://ceus`) |
| `npm run build` | production build → `dist/` |
| `npm run lint` | ESLint (max-warnings 0) |
| `npm run preview` | preview ตัว build |

## โครงสร้าง

```
src/
  api/        axios client (token interceptor + 401 handler) + endpoints ทั้งหมด
  constants/  roles, statuses, enums (SN/CN/SE/CE/SNW ฯลฯ), MONTHS, กฎ FTE
  store/      Redux Toolkit
    authSlice.js     mock auth (sessionStorage)
    yearSlice.js     Budget Years + currentYear (add/edit/close/reopen)
    projectSlice.js  Projects + scope rows ต่อปี
    deptSlice.js     Departments (ชื่อรายปี) + Dept Managers ต่อปี + Dept Groups + manager pool
    employeeSlice.js Employees ต่อปี + freeze setup + Oracle staging + position list
    gpSlice.js       Graph Priority 3 แผงต่อปี (clamp + compact อัตโนมัติ)
  utils/
    gantt.jsx        ganttCells 12 เดือน (logic ตาม buildScopeGantt) + fmtDate — ใช้ร่วม Projects / Project Assumption
  components/
    Layout.jsx       header fixed 58px + sidebar 230px (พับได้) + main
    Header.jsx       แถบ navy: ☰, logo, Budget Year selector, user badge + role tag, Sign Out
    Sidebar.jsx      พื้นขาว เมนูตาม role ตรงตาม buildSidebar ของต้นแบบ (+เมนูย่อย Manpower Plan)
    Modal.jsx        modal 600px header/body/footer ตามต้นแบบ
    StatusBadge.jsx  ป้ายสถานะ workflow
    ProtectedRoute.jsx  กัน route ตาม role
    PageStub.jsx     placeholder หน้าที่ยังไม่ implement
  pages/
    Login.jsx                  card 400px ตามต้นแบบ (mock auth เลือก role ได้)
    admin/Years.jsx            ✅ Budget Year Setup — ตาราง striped + Add/Edit/Close/Re-open
    admin/Projects.jsx         ✅ Project Setup — การ์ดโปรเจกต์ + scope rows + Gantt 12 เดือน
    admin/Departments.jsx      ✅ Department Setup — 3 แท็บ (List / Groups / Managers) + Copy/Export/Import
    admin/Employees.jsx        ✅ Employee Setup — Load Oracle / Freeze / filter / ตารางพนักงาน + Add/Edit/Delete
    admin/GraphPriority.jsx    ✅ Graph Priority Setup — 3 แผง auto-renumber
    dept/ProjectAssumption.jsx ✅ Project Assumption — ตารางอ้างอิง scope + Gantt (read-only)
    dept/ManpowerInput.jsx     ⏳ stub (3 แท็บ sync กับ sidebar ผ่าน ?tab=)
    reports/AnalyticalReport.jsx ⏳ stub (6 แท็บ)
    corpplan/DeptSubmissions.jsx ⏳ stub
    corpplan/Consolidation.jsx ⏳ stub
```

## สถานะปัจจุบัน

| หน้า | สถานะ | หมายเหตุ |
|---|---|---|
| Login | ✅ ตาม layout ต้นแบบ | mock auth — TODO ต่อ `EP.auth.login` |
| Budget Year Setup | ✅ ครบตามต้นแบบ | ข้อมูล mock ใน yearSlice |
| Project Setup | ✅ ครบตามต้นแบบ | TODO: คำเตือนจำนวนพนักงานที่มี allocation ตอนลบ (รอ backend) |
| Department Setup | ✅ ครบตามต้นแบบ | Requester pool ใช้ manager pool ชั่วคราว (รอหน้า Employees) · Import รองรับ .csv ก่อน |
| Employee Setup | ✅ ครบตามต้นแบบ | mock 22 คน · Audit trail ของ Load Oracle รอ backend |
| Graph Priority Setup | ✅ ครบตามต้นแบบ | Admin Setup ครบทั้ง 5 หน้าแล้ว |
| Project Assumption | ✅ ครบตามต้นแบบ | read-only ทุก role ใช้ข้อมูลจาก projectSlice |
| หน้าอื่นทั้งหมด | ⏳ stub | มีรายการขอบเขตงานจากสเปกกำกับในแต่ละหน้า |

กติกาการพัฒนา: ทุกหน้าต้องเทียบกับต้นแบบ `Manpower_Plan.html` (สี ระยะ ข้อความ validation ให้ตรง)
และทุกการเปลี่ยนแปลงต้องรัน `npm run lint` + `npm run build` ผ่าน แล้วอัพเดท README นี้ (รวม Changelog ด้านล่าง)

จุดที่ต้องทำต่อเมื่อ backend พร้อม:
1. `src/pages/Login.jsx` — เปลี่ยน mock auth เป็นเรียก `EP.auth.login`
2. `src/store/*.js` — เปลี่ยน mock data เป็นโหลดจาก API (จุด dispatch แยกไว้แล้ว)
3. implement หน้าตามลำดับแนะนำ: Input Plan → Dept Submissions → Reports

## เอกสารอ้างอิง

- Specification: `../Specification/` (อ่านอย่างเดียว — ห้ามแก้ไข)
- Database Schema: `../Manpower_Plan_Database_Design.docx`
- ER Diagram: `../Manpower_Plan_ERD.mermaid`
- User Guide ภาษาไทย: `../CUEL_ManpowerPlan_UserGuide_20260709_TH.pptx`

## บันทึกการเปลี่ยนแปลง (Changelog)

### 2026-07-14 (4)
- เพิ่มหน้า **Project Assumption** (`dept/ProjectAssumption.jsx`) ตามต้นแบบ — หน้าอ้างอิง read-only:
  การ์ดต่อโปรเจกต์ (ไม่รวม All Projects) แสดงลำดับ/ชื่อ/Category chip/Units + ตาราง Scope, Start, Finish (dd/mm/yyyy) และ Gantt 12 เดือน
- แยก `ganttCells` + `fmtDate` เป็น `src/utils/gantt.jsx` ใช้ร่วมกันระหว่าง Project Setup กับ Project Assumption (ลดโค้ดซ้ำ)

### 2026-07-14 (3)
- เพิ่มหน้า **Graph Priority Setup** (`admin/GraphPriority.jsx` + `gpSlice.js`) ตามต้นแบบ:
  - 3 แผง: By Project & Period (หัวน้ำเงิน) / By Dept Group (เขียว) / By Emp Type & Period (ม่วง) ตาราง Label + Order
  - พิมพ์เลขแล้ว clamp เข้าช่วง 1..N และเรียงเลขทั้งแผงใหม่อัตโนมัติไม่ให้มีช่องว่าง (เลขที่พิมพ์ชนะเมื่อชนกัน) ตาม logic ต้นแบบ
  - แถวเรียงตามลำดับ (ยังไม่ใส่ = ท้ายสุด), รายการดึงจาก projectSlice (รวม All Projects) และ deptSlice.groupDefs
  - HR = ดูอย่างเดียว (input disabled)
- Admin Setup ครบทั้ง 5 หน้า (Years / Projects / Departments / Employees / Graph Priority)

### 2026-07-14 (2)
- เพิ่มหน้า **Employee Setup** (`admin/Employees.jsx` + `employeeSlice.js`) ตามต้นแบบ:
  - Workflow guide 3 ขั้น (Load & Confirm Oracle → Freeze → Ready) + กล่องเตือนแดงเมื่อมี manpower input แล้ว
  - Freeze bar: badge Draft/Frozen + "Frozen on ... by ..." + ปุ่ม ❄ Freeze / 🔓 Unfreeze (confirm + กันปีปิด)
  - Load Oracle Employee Data: modal ยืนยัน (เตือนว่าจะแทนที่ทั้งหมด) + toast สรุป added/removed; ปุ่ม disabled เมื่อ frozen/มี input/ปีปิด
  - Filter bar (Department / Allocation Type / Search + ตัวนับ Showing N of M)
  - ตาราง 12 คอลัมน์ครบตามต้นแบบ (dept tag, Emp Type chip 5 สี, Alloc badge, Resign Date สีแดง, Remark ellipsis)
  - Add/Edit Employee modal ครบทุกช่อง + validation "Emp Code and Name are required." / "Emp Code already exists."
  - เมื่อ Frozen: ซ่อน Edit/Del + ปุ่ม Add disabled — ต้อง Unfreeze ก่อน
- Export Employee List เป็น CSV

### 2026-07-14
- เพิ่มหน้า **Department Setup** (`admin/Departments.jsx` + `deptSlice.js`) — 3 แท็บตามต้นแบบ:
  - Department List: ตาราง Code/Name/Alloc Type (badge Direct เขียว / Indirect เหลือง) + Edit/Delete (กันลบแผนกที่มีแผนกย่อย)
  - Dept Groups: การ์ดกลุ่ม + chip รายแผนก, กล่องเตือนแผนกที่ยังไม่มีกลุ่ม, modal เลือกแผนกแบบ checkbox (ส้ม = อยู่กลุ่มอื่นแล้ว) + validation ห้ามซ้ำข้ามกลุ่ม
  - Dept Managers: ตาราง Requester/Approver/Viewer auto-save + toast, validation Requester ≠ Approver, แถบเตือนแผนกไม่มี Approver, ✓/⚠ ต่อแถว
- ปุ่มหัวหน้า: Copy from Previous Year (พร้อม confirm), Export CSV, Import CSV, ＋ Add Department (modal พร้อม Role Assignment)
- mock data ตรงกับ INIT ของต้นแบบ: 40 แผนก, manager pool 53 ชื่อ, 10 กลุ่ม, ผู้จัดการปี 2027

### 2026-07-13
- เพิ่มหน้า **Project Setup** (`admin/Projects.jsx` + `projectSlice.js`) — การ์ดโปรเจกต์, Units, Rename/Delete, scope rows พร้อม Gantt 12 เดือน (logic ตาม `buildScopeGantt`), validation ครบตามต้นแบบ, ล็อกเมื่อปีปิด, HR = View Only
- เพิ่มหน้า **Budget Year Setup** (`admin/Years.jsx`) — ตาราง striped 7 คอลัมน์, modal Add/Edit/Close, Re-open พร้อม confirm, validation "Year already exists.", HR = View Only
- เพิ่ม component `Modal.jsx` และชุด CSS ตามต้นแบบ (`btn-proto*`, `form-label`, `form-control`, `tbl`, `alert-warning-proto`)
- ขยาย `yearSlice` (reminderDate, cutoffDate, updatedBy + reducers add/edit/close/reopen)
- ปรับ Layout ให้ตรงต้นแบบ: header navy fixed 58px (☰, year selector, role tag), sidebar ขาว 230px พับได้ + เมนูย่อย Manpower Plan, Login card ตามแบบ, พื้นหลัง `#f8fafc`

### 2026-07-13 (แรกตั้งโปรเจกต์)
- โครงโปรเจกต์ Vite + React 18 + Redux Toolkit + Tailwind ตาม dependencies ของ cuel-sca-fe
- Routing + ProtectedRoute ตาม role, axios client, endpoints, หน้า stub ครบทุกเมนู
