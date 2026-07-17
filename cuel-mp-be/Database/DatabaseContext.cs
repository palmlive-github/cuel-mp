using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using cuel_mp_be.Models;

namespace cuel_mp_be.Database;

public partial class DatabaseContext : DbContext
{
    public DatabaseContext()
    {
    }

    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Allocation> Allocations { get; set; }

    public virtual DbSet<BudgetYear> BudgetYears { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<DepartmentYear> DepartmentYears { get; set; }

    public virtual DbSet<DeptGroup> DeptGroups { get; set; }

    public virtual DbSet<DeptGroupMember> DeptGroupMembers { get; set; }

    public virtual DbSet<DeptSubmission> DeptSubmissions { get; set; }

    public virtual DbSet<EmailLog> EmailLogs { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<GraphPriority> GraphPriorities { get; set; }

    public virtual DbSet<HrLoadAudit> HrLoadAudits { get; set; }

    public virtual DbSet<MpEmployee> MpEmployees { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ProjectScope> ProjectScopes { get; set; }

    public virtual DbSet<StatusHistory> StatusHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Thai_100_CI_AS");

        modelBuilder.Entity<Allocation>(entity =>
        {
            entity.HasIndex(e => e.ProjectId, "IX_ALLOC_project");

            entity.HasIndex(e => new { e.MpEmpId, e.ProjectId, e.MonthNo }, "UQ_Allocations").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Fte)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("fte");
            entity.Property(e => e.MonthNo).HasColumnName("month_no");
            entity.Property(e => e.MpEmpId).HasColumnName("mp_emp_id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");

            entity.HasOne(d => d.MpEmp).WithMany(p => p.Allocations)
                .HasForeignKey(d => d.MpEmpId)
                .HasConstraintName("FK_ALLOC_emp");

            entity.HasOne(d => d.Project).WithMany(p => p.Allocations)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ALLOC_project");
        });

        modelBuilder.Entity<BudgetYear>(entity =>
        {
            entity.HasIndex(e => e.Year, "UQ_BudgetYears_year").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CutoffDate)
                .HasColumnType("date")
                .HasColumnName("cutoff_date");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.EmpListStatus)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValueSql("('UNFROZEN')")
                .HasColumnName("emp_list_status");
            entity.Property(e => e.FrozenAt)
                .HasPrecision(0)
                .HasColumnName("frozen_at");
            entity.Property(e => e.FrozenBy)
                .HasMaxLength(100)
                .HasColumnName("frozen_by");
            entity.Property(e => e.ReminderDate)
                .HasColumnType("date")
                .HasColumnName("reminder_date");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValueSql("('OPEN')")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(100)
                .HasColumnName("updated_by");
            entity.Property(e => e.Year).HasColumnName("year");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasIndex(e => e.DeptCode, "UQ_Departments_code").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeptCode).HasColumnName("dept_code");
            entity.Property(e => e.IsParent).HasColumnName("is_parent");
            entity.Property(e => e.ParentDeptId).HasColumnName("parent_dept_id");

            entity.HasOne(d => d.ParentDept).WithMany(p => p.InverseParentDept)
                .HasForeignKey(d => d.ParentDeptId)
                .HasConstraintName("FK_DEPT_parent");
        });

        modelBuilder.Entity<DepartmentYear>(entity =>
        {
            entity.HasIndex(e => new { e.BudgetYearId, e.DeptId }, "UQ_DepartmentYears").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllocType)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("alloc_type");
            entity.Property(e => e.ApproverEmpNo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("approver_emp_no");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.DeptName)
                .HasMaxLength(200)
                .HasColumnName("dept_name");
            entity.Property(e => e.RequesterEmpNo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("requester_emp_no");
            entity.Property(e => e.ViewerEmpNo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("viewer_emp_no");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.DepartmentYears)
                .HasForeignKey(d => d.BudgetYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DY_budget_year");

            entity.HasOne(d => d.Dept).WithMany(p => p.DepartmentYears)
                .HasForeignKey(d => d.DeptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DY_dept");
        });

        modelBuilder.Entity<DeptGroup>(entity =>
        {
            entity.HasIndex(e => e.GroupName, "UQ_DeptGroups_name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GroupName)
                .HasMaxLength(100)
                .HasColumnName("group_name");
        });

        modelBuilder.Entity<DeptGroupMember>(entity =>
        {
            entity.HasIndex(e => e.DeptId, "UQ_DGM_dept").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.GroupId).HasColumnName("group_id");

            entity.HasOne(d => d.Dept).WithOne(p => p.DeptGroupMember)
                .HasForeignKey<DeptGroupMember>(d => d.DeptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DGM_dept");

            entity.HasOne(d => d.Group).WithMany(p => p.DeptGroupMembers)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK_DGM_group");
        });

        modelBuilder.Entity<DeptSubmission>(entity =>
        {
            entity.HasIndex(e => new { e.BudgetYearId, e.DeptId }, "UQ_DeptSubmissions").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.RejectReason)
                .HasMaxLength(500)
                .HasColumnName("reject_reason");
            entity.Property(e => e.ReturnComment)
                .HasMaxLength(500)
                .HasColumnName("return_comment");
            entity.Property(e => e.Status)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasDefaultValueSql("('DRAFT')")
                .HasColumnName("status");
            entity.Property(e => e.SubmittedAt)
                .HasPrecision(0)
                .HasColumnName("submitted_at");
            entity.Property(e => e.SubmittedBy)
                .HasMaxLength(100)
                .HasColumnName("submitted_by");
            entity.Property(e => e.VerifiedAt)
                .HasPrecision(0)
                .HasColumnName("verified_at");
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(100)
                .HasColumnName("verified_by");

            entity.HasOne(d => d.DepartmentYear).WithOne(p => p.DeptSubmission)
                .HasPrincipalKey<DepartmentYear>(p => new { p.BudgetYearId, p.DeptId })
                .HasForeignKey<DeptSubmission>(d => new { d.BudgetYearId, d.DeptId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SUB_dept_year");
        });

        modelBuilder.Entity<EmailLog>(entity =>
        {
            entity.HasIndex(e => e.BudgetYearId, "IX_EL_year");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.CcAddr)
                .HasMaxLength(500)
                .HasColumnName("cc_addr");
            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.SentAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("sent_at");
            entity.Property(e => e.Subject)
                .HasMaxLength(500)
                .HasColumnName("subject");
            entity.Property(e => e.SubmissionId).HasColumnName("submission_id");
            entity.Property(e => e.Template)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("template");
            entity.Property(e => e.ToAddr)
                .HasMaxLength(500)
                .HasColumnName("to_addr");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.EmailLogs)
                .HasForeignKey(d => d.BudgetYearId)
                .HasConstraintName("FK_EL_budget_year");

            entity.HasOne(d => d.Dept).WithMany(p => p.EmailLogs)
                .HasForeignKey(d => d.DeptId)
                .HasConstraintName("FK_EL_dept");

            entity.HasOne(d => d.Submission).WithMany(p => p.EmailLogs)
                .HasForeignKey(d => d.SubmissionId)
                .HasConstraintName("FK_EL_submission");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasIndex(e => e.EmpCode, "UQ_Employees_emp_code").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeptCode).HasColumnName("dept_code");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpType)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("emp_type");
            entity.Property(e => e.FullName)
                .HasMaxLength(200)
                .HasColumnName("full_name");
            entity.Property(e => e.LoadedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("loaded_at");
            entity.Property(e => e.Location)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.Position)
                .HasMaxLength(200)
                .HasColumnName("position");
            entity.Property(e => e.StartDate)
                .HasColumnType("date")
                .HasColumnName("start_date");
        });

        modelBuilder.Entity<GraphPriority>(entity =>
        {
            entity.HasIndex(e => new { e.BudgetYearId, e.Panel, e.ItemKey }, "UQ_GP_item").IsUnique();

            entity.HasIndex(e => new { e.BudgetYearId, e.Panel, e.Priority }, "UQ_GP_priority").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.ItemKey)
                .HasMaxLength(200)
                .HasColumnName("item_key");
            entity.Property(e => e.Panel)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("panel");
            entity.Property(e => e.Priority).HasColumnName("priority");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.GraphPriorities)
                .HasForeignKey(d => d.BudgetYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GP_budget_year");
        });

        modelBuilder.Entity<HrLoadAudit>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.ChangesJson).HasColumnName("changes_json");
            entity.Property(e => e.LoadedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("loaded_at");
            entity.Property(e => e.LoadedBy)
                .HasMaxLength(100)
                .HasColumnName("loaded_by");
            entity.Property(e => e.NewCount).HasColumnName("new_count");
            entity.Property(e => e.PrevCount).HasColumnName("prev_count");
            entity.Property(e => e.SnapshotJson).HasColumnName("snapshot_json");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.HrLoadAudits)
                .HasForeignKey(d => d.BudgetYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HLA_budget_year");
        });

        modelBuilder.Entity<MpEmployee>(entity =>
        {
            entity.HasIndex(e => new { e.BudgetYearId, e.DeptId }, "IX_MPE_year_dept");

            entity.HasIndex(e => new { e.BudgetYearId, e.EmpCode, e.RecordType }, "UQ_MpEmployees").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllocType)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("alloc_type");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpType)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("emp_type");
            entity.Property(e => e.FullName)
                .HasMaxLength(200)
                .HasColumnName("full_name");
            entity.Property(e => e.Location)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.NewRequestDate)
                .HasColumnType("date")
                .HasColumnName("new_request_date");
            entity.Property(e => e.PlannedResignDate)
                .HasColumnType("date")
                .HasColumnName("planned_resign_date");
            entity.Property(e => e.Position)
                .HasMaxLength(200)
                .HasColumnName("position");
            entity.Property(e => e.RecordType)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValueSql("('ORIGINAL')")
                .HasColumnName("record_type");
            entity.Property(e => e.RemarkDefault)
                .HasMaxLength(500)
                .HasColumnName("remark_default");
            entity.Property(e => e.RemarkOverride)
                .HasMaxLength(500)
                .HasColumnName("remark_override");
            entity.Property(e => e.ResignDate)
                .HasColumnType("date")
                .HasColumnName("resign_date");
            entity.Property(e => e.StartDate)
                .HasColumnType("date")
                .HasColumnName("start_date");
            entity.Property(e => e.TransferInDate)
                .HasColumnType("date")
                .HasColumnName("transfer_in_date");
            entity.Property(e => e.TransferOutDate)
                .HasColumnType("date")
                .HasColumnName("transfer_out_date");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.MpEmployees)
                .HasForeignKey(d => d.BudgetYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MPE_budget_year");

            entity.HasOne(d => d.Dept).WithMany(p => p.MpEmployees)
                .HasForeignKey(d => d.DeptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MPE_dept");

            entity.HasOne(d => d.DepartmentYear).WithMany(p => p.MpEmployees)
                .HasPrincipalKey(p => new { p.BudgetYearId, p.DeptId })
                .HasForeignKey(d => new { d.BudgetYearId, d.DeptId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MPE_dept_year");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasIndex(e => new { e.BudgetYearId, e.ProjectName }, "UQ_Projects_name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BudgetYearId).HasColumnName("budget_year_id");
            entity.Property(e => e.Category)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.IsSystem).HasColumnName("is_system");
            entity.Property(e => e.ProjectName)
                .HasMaxLength(200)
                .HasColumnName("project_name");
            entity.Property(e => e.Units)
                .HasMaxLength(100)
                .HasColumnName("units");

            entity.HasOne(d => d.BudgetYear).WithMany(p => p.Projects)
                .HasForeignKey(d => d.BudgetYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PROJ_budget_year");
        });

        modelBuilder.Entity<ProjectScope>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FinishDate)
                .HasColumnType("date")
                .HasColumnName("finish_date");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.ScopeName)
                .HasMaxLength(200)
                .HasColumnName("scope_name");
            entity.Property(e => e.StartDate)
                .HasColumnType("date")
                .HasColumnName("start_date");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectScopes)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("FK_SCOPE_project");
        });

        modelBuilder.Entity<StatusHistory>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("action");
            entity.Property(e => e.Actor)
                .HasMaxLength(100)
                .HasColumnName("actor");
            entity.Property(e => e.Comment)
                .HasMaxLength(500)
                .HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.FromStatus)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("from_status");
            entity.Property(e => e.SubmissionId).HasColumnName("submission_id");
            entity.Property(e => e.ToStatus)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("to_status");

            entity.HasOne(d => d.Submission).WithMany(p => p.StatusHistories)
                .HasForeignKey(d => d.SubmissionId)
                .HasConstraintName("FK_SH_submission");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
