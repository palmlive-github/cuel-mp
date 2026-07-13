# cuel-mp-fe — CUEL Manpower Plan (Frontend)

Web frontend ของระบบ Manpower Plan (Corporate Planning) — React 18 + Vite 5 + Redux Toolkit + Tailwind CSS

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
  api/        axios client + endpoints ทั้งหมด
  constants/  roles, statuses, enums (SN/CN/SE/CE/SNW ฯลฯ), กฎ FTE
  store/      Redux Toolkit (auth, budget year)
  components/ Layout, Sidebar (เมนูตาม role), Header (year selector), StatusBadge, ProtectedRoute, PageStub
  pages/
    Login.jsx           mock auth — เลือก role ได้ระหว่างพัฒนา
    dept/               Project Assumption, Manpower Input (3 แท็บ)
    reports/            Analytical Report (6 แท็บ)
    admin/              Years, Projects, Departments, Employees, Graph Priority
    corpplan/           Dept Submissions, Consolidation
```

## สถานะปัจจุบัน

ทุกหน้าเป็น **stub** — มี layout, routing, สิทธิ์ตาม role และรายการขอบเขตงานของแต่ละหน้า (จาก Specification) พร้อมให้ทีมพัฒนาแทนที่ทีละหน้า

จุดที่ต้องทำต่อเมื่อ backend พร้อม:
1. `src/pages/Login.jsx` — เปลี่ยน mock auth เป็นเรียก `EP.auth.login`
2. `src/store/yearSlice.js` — โหลดปีจาก API แทน mock
3. implement หน้าตามลำดับ: Input Plan → Dept Submissions → Admin Setup → Reports

## เอกสารอ้างอิง

- Specification: `../Specification/` (อ่านอย่างเดียว)
- Database Schema: `../Manpower_Plan_Database_Design.docx`
- ER Diagram: `../Manpower_Plan_ERD.mermaid`
