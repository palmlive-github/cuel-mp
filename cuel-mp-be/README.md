# cuel-mp-be — CUEL Manpower Plan (Backend)

ASP.NET Core 7 Web API สำหรับระบบ Manpower Plan — เชื่อมต่อ CEUS Database และทำ Authentication แล้ว

## Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | .NET 7 (ASP.NET Core Web API) |
| ORM | Entity Framework Core 7 (SQL Server) |
| Auth | JWT Bearer (Access 15 นาที + Refresh 7 วัน) ผ่าน CEUS Session SSO |
| อื่น ๆ | Swagger (Swashbuckle), Newtonsoft.Json, ClosedXML (Excel), ReportViewerCore, ImageSharp |

## Authentication Flow (ทำแล้ว)

```
CEUS Portal ──Session──▶ FE /login?Session=xxx
                              │
                              ▼
                POST /api/authentications/Token { session }
                              │
        BE ──▶ CEUS AuthUrl api/home/GetUserByApps (ApplicationCode: B0037)
                              │ userId + permissionCodes
                              ▼
        ตรวจ user ใน CEUS DB (UserService.FindAsync) + map permission → roles
                              │
                              ▼
        ตอบ { accessToken (15m), refreshToken (7d), userInfo }
```

- `POST /api/authentications/Token` — แลก CEUS Session เป็น JWT + UserInfo (ชื่อ, EmployeeNo, Position, Department, Roles)
- `POST /api/authentications/Refresh` — ต่ออายุ access token ด้วย refresh token
- `GET /api/authentications/Me` — ข้อมูลผู้ใช้จาก token (ต้อง Authorize)
- `JwtMiddleware` ถอด token ใส่ HttpContext.Items · `[Authorize]` attribute ตรวจ role
- Developer bypass: EmployeeNo ที่อยู่ใน `AppSettings.Developpers` ได้ทุก role

## Roles (map จาก CEUS Permission)

| Role | Permission Code | หมายเหตุ |
|---|---|---|
| Admin | MP0001 | Corp Plan |
| HR | MP0002 | อ่านทุกหน้า แก้ Departments + Employees |
| User | MP0003 | Dept Manager (Requester/Approver/Viewer — สิทธิ์จริงมาจาก Department Setup) |
| Developper | MP0000 | ทีม IT |

## Database

- **CEUS** (read-only, ApplicationIntent=ReadOnly) — scaffold แล้วที่ `Models/CEUS` + `Database/DatabaseCeusContext.cs`
  ครอบคลุม views/tables: VW_CEUS_User, VW_Department, VW_Employee_Assignments, VW_Employee_Latest_tAssignments,
  vw_CUEL_All_CEUS_User, VW_CEUS_All_Departments/Locations/Positions, Permission, UserApplication, ApplicationPermission,
  T_CEUS_AllUser_EmpInfo, T_CEUS_EmployeeSupervisor
- **MP** (ฐานข้อมูลของระบบเอง) — connection string เตรียมไว้แล้ว ยังไม่ได้ scaffold/สร้าง schema
  (ออกแบบไว้แล้วใน `../Manpower_Plan_Database_Design.docx` + `../Manpower_Plan_ERD.mermaid` — 15 ตาราง)
- คำสั่ง scaffold ตัวอย่างอยู่ใน `Extensions/ConnectionService.cs`

## โครงสร้าง

```
Program.cs                 config ตาม environment, CORS (AllowCredentials), Swagger + JWT, serve React static (Staging/Prod + SPA fallback)
Controllers/               AuthenticationController (+ WeatherForecastController template — รอลบ)
Services/
  Login/                   Authenticate (CEUS Session → JWT), Refresh, Encode/Decode JWT
  User/                    ค้น user จาก CEUS DB
  CUEL/                    PermissionAllowList — map permission codes → roles
Helpers/                   JwtMiddleware, AuthorizeAttribute
Enttities/                 Auth/Role/Context entities (Roles: Admin, HR, User + PermissionsCode MP0000–MP0003)
Models/CEUS/               EF entities จาก scaffold
Database/                  DatabaseCeusContext
Extensions/                ConnectionService (DbContext), ScopeService (DI), ConfigureService
appsettings*.json          AppSettings / Swagger / ConnectionStrings (MP, CEUS) / Jwt / Ceus / Smtp / Upload
```

## รัน (Development)

```bash
dotnet run   # http://localhost:5170 — Swagger ที่ root
```

Environment: Development ใช้ `appsettings.Development.json` (CEUS dev: devf-ceus / DEVF-SVRDB15) · Staging/Production ใช้ `appsettings.json` และ serve ตัว build ของ FE ด้วย (FE `dist/` วางใน wwwroot)

## สิ่งที่ยังต้องทำ

1. สร้าง/scaffold **MP database** ตาม Database Design (15 ตาราง) แล้วเปิดใช้ connection "MP"
2. Business API: Years, Projects, Departments, Employees (Load Oracle/Freeze), Allocations, Submissions (workflow), Reports
3. Email service (T1–T6 + Reminder 07:00 ตาม `../Specification/Manpower_Plan_Email_Notification_Design.html`) — มี Smtp config เตรียมไว้แล้ว
4. Job Scheduler: โหลดพนักงาน Oracle → staging ทุกวัน 22:00
5. เก็บกวาด: ลบ WeatherForecastController, ปรับค่า Jwt Issuer/Audience และ AppSettings.Permissions ที่ยังเป็นค่าจากโปรเจกต์ MSR
6. ฝั่ง FE: เปลี่ยน mock auth เป็น flow จริง (`/login?Session=` → Token → เก็บ access/refresh + interceptor refresh อัตโนมัติ)
