using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cuelmpbe.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BudgetYears",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    year = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    status = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValueSql: "('OPEN')"),
                    reminderdate = table.Column<DateTime>(name: "reminder_date", type: "date", nullable: true),
                    cutoffdate = table.Column<DateTime>(name: "cutoff_date", type: "date", nullable: true),
                    updatedby = table.Column<string>(name: "updated_by", type: "nvarchar(100)", maxLength: 100, nullable: true),
                    empliststatus = table.Column<string>(name: "emp_list_status", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValueSql: "('UNFROZEN')"),
                    frozenat = table.Column<DateTime>(name: "frozen_at", type: "datetime2(0)", precision: 0, nullable: true),
                    frozenby = table.Column<string>(name: "frozen_by", type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BudgetYears", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    deptcode = table.Column<int>(name: "dept_code", type: "int", nullable: false),
                    parentdeptid = table.Column<int>(name: "parent_dept_id", type: "int", nullable: true),
                    isparent = table.Column<bool>(name: "is_parent", type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.id);
                    table.ForeignKey(
                        name: "FK_DEPT_parent",
                        column: x => x.parentdeptid,
                        principalTable: "Departments",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "DeptGroups",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    groupname = table.Column<string>(name: "group_name", type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeptGroups", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    empcode = table.Column<string>(name: "emp_code", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    fullname = table.Column<string>(name: "full_name", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    position = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    deptcode = table.Column<int>(name: "dept_code", type: "int", nullable: true),
                    location = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    emptype = table.Column<string>(name: "emp_type", type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    startdate = table.Column<DateTime>(name: "start_date", type: "date", nullable: true),
                    loadedat = table.Column<DateTime>(name: "loaded_at", type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "GraphPriorities",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    panel = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    itemkey = table.Column<string>(name: "item_key", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GraphPriorities", x => x.id);
                    table.ForeignKey(
                        name: "FK_GP_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "HrLoadAudits",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    loadedat = table.Column<DateTime>(name: "loaded_at", type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(sysdatetime())"),
                    loadedby = table.Column<string>(name: "loaded_by", type: "nvarchar(100)", maxLength: 100, nullable: false),
                    prevcount = table.Column<int>(name: "prev_count", type: "int", nullable: false),
                    newcount = table.Column<int>(name: "new_count", type: "int", nullable: false),
                    changesjson = table.Column<string>(name: "changes_json", type: "nvarchar(max)", nullable: true),
                    snapshotjson = table.Column<string>(name: "snapshot_json", type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HrLoadAudits", x => x.id);
                    table.ForeignKey(
                        name: "FK_HLA_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    projectname = table.Column<string>(name: "project_name", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    units = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    category = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    issystem = table.Column<bool>(name: "is_system", type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.id);
                    table.ForeignKey(
                        name: "FK_PROJ_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "DepartmentYears",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    deptid = table.Column<int>(name: "dept_id", type: "int", nullable: false),
                    deptname = table.Column<string>(name: "dept_name", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    alloctype = table.Column<string>(name: "alloc_type", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    approverempno = table.Column<string>(name: "approver_emp_no", type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    requesterempno = table.Column<string>(name: "requester_emp_no", type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    viewerempno = table.Column<string>(name: "viewer_emp_no", type: "varchar(10)", unicode: false, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentYears", x => x.id);
                    table.UniqueConstraint("AK_DepartmentYears_budget_year_id_dept_id", x => new { x.budgetyearid, x.deptid });
                    table.ForeignKey(
                        name: "FK_DY_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_DY_dept",
                        column: x => x.deptid,
                        principalTable: "Departments",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "DeptGroupMembers",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    groupid = table.Column<int>(name: "group_id", type: "int", nullable: false),
                    deptid = table.Column<int>(name: "dept_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeptGroupMembers", x => x.id);
                    table.ForeignKey(
                        name: "FK_DGM_dept",
                        column: x => x.deptid,
                        principalTable: "Departments",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_DGM_group",
                        column: x => x.groupid,
                        principalTable: "DeptGroups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectScopes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    projectid = table.Column<int>(name: "project_id", type: "int", nullable: false),
                    scopename = table.Column<string>(name: "scope_name", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    startdate = table.Column<DateTime>(name: "start_date", type: "date", nullable: true),
                    finishdate = table.Column<DateTime>(name: "finish_date", type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectScopes", x => x.id);
                    table.ForeignKey(
                        name: "FK_SCOPE_project",
                        column: x => x.projectid,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeptSubmissions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    deptid = table.Column<int>(name: "dept_id", type: "int", nullable: false),
                    status = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false, defaultValueSql: "('DRAFT')"),
                    submittedby = table.Column<string>(name: "submitted_by", type: "nvarchar(100)", maxLength: 100, nullable: true),
                    submittedat = table.Column<DateTime>(name: "submitted_at", type: "datetime2(0)", precision: 0, nullable: true),
                    verifiedby = table.Column<string>(name: "verified_by", type: "nvarchar(100)", maxLength: 100, nullable: true),
                    verifiedat = table.Column<DateTime>(name: "verified_at", type: "datetime2(0)", precision: 0, nullable: true),
                    rejectreason = table.Column<string>(name: "reject_reason", type: "nvarchar(500)", maxLength: 500, nullable: true),
                    returncomment = table.Column<string>(name: "return_comment", type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeptSubmissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_SUB_dept_year",
                        columns: x => new { x.budgetyearid, x.deptid },
                        principalTable: "DepartmentYears",
                        principalColumns: new[] { "budget_year_id", "dept_id" });
                });

            migrationBuilder.CreateTable(
                name: "MpEmployees",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: false),
                    deptid = table.Column<int>(name: "dept_id", type: "int", nullable: false),
                    empcode = table.Column<string>(name: "emp_code", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    recordtype = table.Column<string>(name: "record_type", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValueSql: "('ORIGINAL')"),
                    fullname = table.Column<string>(name: "full_name", type: "nvarchar(200)", maxLength: 200, nullable: false),
                    position = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    location = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    emptype = table.Column<string>(name: "emp_type", type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    alloctype = table.Column<string>(name: "alloc_type", type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    startdate = table.Column<DateTime>(name: "start_date", type: "date", nullable: true),
                    newrequestdate = table.Column<DateTime>(name: "new_request_date", type: "date", nullable: true),
                    transferindate = table.Column<DateTime>(name: "transfer_in_date", type: "date", nullable: true),
                    transferoutdate = table.Column<DateTime>(name: "transfer_out_date", type: "date", nullable: true),
                    plannedresigndate = table.Column<DateTime>(name: "planned_resign_date", type: "date", nullable: true),
                    resigndate = table.Column<DateTime>(name: "resign_date", type: "date", nullable: true),
                    remarkdefault = table.Column<string>(name: "remark_default", type: "nvarchar(500)", maxLength: 500, nullable: true),
                    remarkoverride = table.Column<string>(name: "remark_override", type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MpEmployees", x => x.id);
                    table.ForeignKey(
                        name: "FK_MPE_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_MPE_dept",
                        column: x => x.deptid,
                        principalTable: "Departments",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_MPE_dept_year",
                        columns: x => new { x.budgetyearid, x.deptid },
                        principalTable: "DepartmentYears",
                        principalColumns: new[] { "budget_year_id", "dept_id" });
                });

            migrationBuilder.CreateTable(
                name: "EmailLogs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    submissionid = table.Column<int>(name: "submission_id", type: "int", nullable: true),
                    template = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    budgetyearid = table.Column<int>(name: "budget_year_id", type: "int", nullable: true),
                    deptid = table.Column<int>(name: "dept_id", type: "int", nullable: true),
                    toaddr = table.Column<string>(name: "to_addr", type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ccaddr = table.Column<string>(name: "cc_addr", type: "nvarchar(500)", maxLength: 500, nullable: true),
                    subject = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    sentat = table.Column<DateTime>(name: "sent_at", type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailLogs", x => x.id);
                    table.ForeignKey(
                        name: "FK_EL_budget_year",
                        column: x => x.budgetyearid,
                        principalTable: "BudgetYears",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_EL_dept",
                        column: x => x.deptid,
                        principalTable: "Departments",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_EL_submission",
                        column: x => x.submissionid,
                        principalTable: "DeptSubmissions",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "StatusHistories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    submissionid = table.Column<int>(name: "submission_id", type: "int", nullable: false),
                    action = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    fromstatus = table.Column<string>(name: "from_status", type: "varchar(25)", unicode: false, maxLength: 25, nullable: true),
                    tostatus = table.Column<string>(name: "to_status", type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    actor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    comment = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    createdat = table.Column<DateTime>(name: "created_at", type: "datetime2(0)", precision: 0, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusHistories", x => x.id);
                    table.ForeignKey(
                        name: "FK_SH_submission",
                        column: x => x.submissionid,
                        principalTable: "DeptSubmissions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Allocations",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    mpempid = table.Column<int>(name: "mp_emp_id", type: "int", nullable: false),
                    projectid = table.Column<int>(name: "project_id", type: "int", nullable: false),
                    monthno = table.Column<byte>(name: "month_no", type: "tinyint", nullable: false),
                    fte = table.Column<decimal>(type: "decimal(3,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allocations", x => x.id);
                    table.ForeignKey(
                        name: "FK_ALLOC_emp",
                        column: x => x.mpempid,
                        principalTable: "MpEmployees",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ALLOC_project",
                        column: x => x.projectid,
                        principalTable: "Projects",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ALLOC_project",
                table: "Allocations",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "UQ_Allocations",
                table: "Allocations",
                columns: new[] { "mp_emp_id", "project_id", "month_no" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_BudgetYears_year",
                table: "BudgetYears",
                column: "year",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_parent_dept_id",
                table: "Departments",
                column: "parent_dept_id");

            migrationBuilder.CreateIndex(
                name: "UQ_Departments_code",
                table: "Departments",
                column: "dept_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentYears_dept_id",
                table: "DepartmentYears",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "UQ_DepartmentYears",
                table: "DepartmentYears",
                columns: new[] { "budget_year_id", "dept_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeptGroupMembers_group_id",
                table: "DeptGroupMembers",
                column: "group_id");

            migrationBuilder.CreateIndex(
                name: "UQ_DGM_dept",
                table: "DeptGroupMembers",
                column: "dept_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_DeptGroups_name",
                table: "DeptGroups",
                column: "group_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_DeptSubmissions",
                table: "DeptSubmissions",
                columns: new[] { "budget_year_id", "dept_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EL_year",
                table: "EmailLogs",
                column: "budget_year_id");

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_dept_id",
                table: "EmailLogs",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_submission_id",
                table: "EmailLogs",
                column: "submission_id");

            migrationBuilder.CreateIndex(
                name: "UQ_Employees_emp_code",
                table: "Employees",
                column: "emp_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_GP_item",
                table: "GraphPriorities",
                columns: new[] { "budget_year_id", "panel", "item_key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_GP_priority",
                table: "GraphPriorities",
                columns: new[] { "budget_year_id", "panel", "priority" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HrLoadAudits_budget_year_id",
                table: "HrLoadAudits",
                column: "budget_year_id");

            migrationBuilder.CreateIndex(
                name: "IX_MPE_year_dept",
                table: "MpEmployees",
                columns: new[] { "budget_year_id", "dept_id" });

            migrationBuilder.CreateIndex(
                name: "IX_MpEmployees_dept_id",
                table: "MpEmployees",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "UQ_MpEmployees",
                table: "MpEmployees",
                columns: new[] { "budget_year_id", "emp_code", "record_type" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Projects_name",
                table: "Projects",
                columns: new[] { "budget_year_id", "project_name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectScopes_project_id",
                table: "ProjectScopes",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_StatusHistories_submission_id",
                table: "StatusHistories",
                column: "submission_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Allocations");

            migrationBuilder.DropTable(
                name: "DeptGroupMembers");

            migrationBuilder.DropTable(
                name: "EmailLogs");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "GraphPriorities");

            migrationBuilder.DropTable(
                name: "HrLoadAudits");

            migrationBuilder.DropTable(
                name: "ProjectScopes");

            migrationBuilder.DropTable(
                name: "StatusHistories");

            migrationBuilder.DropTable(
                name: "MpEmployees");

            migrationBuilder.DropTable(
                name: "DeptGroups");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "DeptSubmissions");

            migrationBuilder.DropTable(
                name: "DepartmentYears");

            migrationBuilder.DropTable(
                name: "BudgetYears");

            migrationBuilder.DropTable(
                name: "Departments");
        }
    }
}
