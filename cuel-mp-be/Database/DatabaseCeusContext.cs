using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using cuel_mp_be.Models.CEUS;

namespace cuel_mp_be.Database;

public partial class DatabaseCeusContext : DbContext
{
    public DatabaseCeusContext()
    {
    }

    public DatabaseCeusContext(DbContextOptions<DatabaseCeusContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ApplicationPermission> ApplicationPermissions { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<TCeusAllUserEmpInfo> TCeusAllUserEmpInfos { get; set; }

    public virtual DbSet<TCeusEmployeeSupervisor> TCeusEmployeeSupervisors { get; set; }

    public virtual DbSet<UserApplication> UserApplications { get; set; }

    public virtual DbSet<VwCeusAllDepartment> VwCeusAllDepartments { get; set; }

    public virtual DbSet<VwCeusAllLocation> VwCeusAllLocations { get; set; }

    public virtual DbSet<VwCeusAllPosition> VwCeusAllPositions { get; set; }

    public virtual DbSet<VwCeusUser> VwCeusUsers { get; set; }

    public virtual DbSet<VwCuelAllCeusUser> VwCuelAllCeusUsers { get; set; }

    public virtual DbSet<VwDepartment> VwDepartments { get; set; }

    public virtual DbSet<VwEmployeeAssignment> VwEmployeeAssignments { get; set; }

    public virtual DbSet<VwEmployeeLatestTAssignment> VwEmployeeLatestTAssignments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApplicationPermission>(entity =>
        {
            entity.ToTable("ApplicationPermission");

            entity.Property(e => e.ApplicationPermissionId).HasColumnName("ApplicationPermissionID");
            entity.Property(e => e.ApplicationCode).HasMaxLength(10);
            entity.Property(e => e.IsEnabled).HasDefaultValueSql("((1))");
            entity.Property(e => e.PermissionCode).HasMaxLength(10);

            entity.HasOne(d => d.PermissionCodeNavigation).WithMany(p => p.ApplicationPermissions)
                .HasForeignKey(d => d.PermissionCode)
                .HasConstraintName("FK_ApplicationPermission_Permission");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionCode);

            entity.ToTable("Permission");

            entity.Property(e => e.PermissionCode).HasMaxLength(10);
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsEnabled).HasDefaultValueSql("((1))");
            entity.Property(e => e.PermissionDescription).HasMaxLength(255);
            entity.Property(e => e.PermissionName).HasMaxLength(100);
            entity.Property(e => e.UpdatedBy).HasMaxLength(50);
            entity.Property(e => e.UpdatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<TCeusAllUserEmpInfo>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.ToTable("T_CEUS_AllUser_EmpInfo");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("UserID");
            entity.Property(e => e.Company)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Contact).HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EffeciveDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveEndDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveStartDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.EmpEmail)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("EMP_Email");
            entity.Property(e => e.EmpFirstName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("EMP_FirstName");
            entity.Property(e => e.EmpLastName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("EMP_LastName");
            entity.Property(e => e.EmployeeCurrentStatus)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(153)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.EmployeePositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("EmployeePositionID");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.IsAd).HasColumnName("IsAD");
            entity.Property(e => e.LastName).HasMaxLength(150);
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("LOCATION_Name");
            entity.Property(e => e.Password)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PasswordEncrypt)
                .HasMaxLength(8000)
                .HasColumnName("Password_Encrypt");
            entity.Property(e => e.PayrollId)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("Payroll_ID");
            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.PositionCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PositionId).HasColumnName("PositionID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.ResignDate).HasColumnType("datetime");
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("SEX");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.SupervisorEmail)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorEmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorFullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorPositionCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorPositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("TITLE");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.UserCode).HasMaxLength(50);
            entity.Property(e => e.UserName).HasMaxLength(50);
            entity.Property(e => e.UserTypeId).HasColumnName("UserTypeID");
        });

        modelBuilder.Entity<TCeusEmployeeSupervisor>(entity =>
        {
            entity.HasKey(e => e.PersonId).HasName("PK__T_CEUS_E__AA2FFB852B78D6A1");

            entity.ToTable("T_CEUS_EmployeeSupervisor");

            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.ApproveLevel).HasColumnName("Approve_Level");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EffeciveDate).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(153)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.EmployeePositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("EmployeePositionID");
            entity.Property(e => e.FirstName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.FullNameTitle)
                .HasMaxLength(332)
                .IsUnicode(false);
            entity.Property(e => e.IsIc)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("isIC");
            entity.Property(e => e.JobCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.JobId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("JOB_ID");
            entity.Property(e => e.JobName)
                .HasMaxLength(700)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Location)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PositionCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("POSITION_ID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("SEX");
            entity.Property(e => e.SupervisorDepartmentCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorDepartmentName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorEmail)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorEmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorFirstName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorFullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("SupervisorID");
            entity.Property(e => e.SupervisorLastName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorPositionCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorPositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorSex)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorTitle)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("TITLE");
        });

        modelBuilder.Entity<UserApplication>(entity =>
        {
            entity.ToTable("UserApplication");

            entity.HasIndex(e => new { e.ApplicationCode, e.UserId }, "IDX_UserApplication");

            entity.Property(e => e.UserApplicationId).HasColumnName("UserApplicationID");
            entity.Property(e => e.ApplicationCode).HasMaxLength(10);
            entity.Property(e => e.ApplicationPermissionId).HasColumnName("ApplicationPermissionID");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsEnabled).HasDefaultValueSql("((1))");
            entity.Property(e => e.ServerName).HasMaxLength(100);
            entity.Property(e => e.UpdatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.ApplicationPermission).WithMany(p => p.UserApplications)
                .HasForeignKey(d => d.ApplicationPermissionId)
                .HasConstraintName("FK_UserApplication_ApplicationPermission");
        });

        modelBuilder.Entity<VwCeusAllDepartment>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_CEUS_All_Departments");

            entity.Property(e => e.Code)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("CODE");
            entity.Property(e => e.Id)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LOCATION_NAME");
            entity.Property(e => e.Name)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("NAME");
        });

        modelBuilder.Entity<VwCeusAllLocation>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_CEUS_All_Locations");

            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LOCATION_NAME");
        });

        modelBuilder.Entity<VwCeusAllPosition>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_CEUS_All_Positions");

            entity.Property(e => e.Code)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("CODE");
            entity.Property(e => e.DepartmentId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("DEPARTMENT_ID");
            entity.Property(e => e.Id)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LOCATION_NAME");
            entity.Property(e => e.Name)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("NAME");
        });

        modelBuilder.Entity<VwCeusUser>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_CEUS_User");

            entity.Property(e => e.Company)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.Contact).HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(8000)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EffeciveDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.EmpEmail)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("EMP_Email");
            entity.Property(e => e.EmpFirstName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("EMP_FirstName");
            entity.Property(e => e.EmpLastName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("EMP_LastName");
            entity.Property(e => e.EmployeeAddress).UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(153)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeePositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("EmployeePositionID");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.IsAd).HasColumnName("IsAD");
            entity.Property(e => e.LastName).HasMaxLength(150);
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("LOCATION_Name");
            entity.Property(e => e.Password)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PasswordEncrypt)
                .HasMaxLength(8000)
                .HasColumnName("Password_Encrypt");
            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.PositionCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.PositionId).HasColumnName("PositionID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.ResignDate).HasColumnType("datetime");
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("SEX");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.SupervisorDepartmentCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorDepartmentName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorEmail)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorEmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorFirstName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorFullName)
                .HasMaxLength(301)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("SupervisorID");
            entity.Property(e => e.SupervisorLastName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorPositionCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorPositionName)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorSex)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorTitle)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("TITLE");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.UserCode).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.UserName).HasMaxLength(50);
            entity.Property(e => e.UserTypeId).HasColumnName("UserTypeID");
        });

        modelBuilder.Entity<VwCuelAllCeusUser>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_CUEL_All_CEUS_User");

            entity.Property(e => e.Contact).HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(8000)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EffeciveDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveEndDate)
                .HasColumnType("datetime")
                .HasColumnName("EFFECTIVE_END_DATE");
            entity.Property(e => e.EffectiveStartDate)
                .HasColumnType("datetime")
                .HasColumnName("EFFECTIVE_START_DATE");
            entity.Property(e => e.Email)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeeAddress).UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(153)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.EmployeePositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("EmployeePositionID");
            entity.Property(e => e.Expr1)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.Expr2)
                .HasMaxLength(8000)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.FirstName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.IsAd).HasColumnName("IsAD");
            entity.Property(e => e.LastName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LOCATION_ID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("LOCATION_Name");
            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.PersonTypeId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("PERSON_TYPE_ID");
            entity.Property(e => e.PositionCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.PositionId).HasColumnName("PositionID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.ResignDate).HasColumnType("datetime");
            entity.Property(e => e.Resigned)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("SEX");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.SupervisorDepartmentCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorDepartmentName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorEmail)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorEmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorFirstName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorFullName)
                .HasMaxLength(301)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorGender)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("SupervisorID");
            entity.Property(e => e.SupervisorLastName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorPositionCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorPositionName)
                .HasMaxLength(240)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.SupervisorTitle)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS");
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Thai_CI_AS")
                .HasColumnName("TITLE");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.UserName).HasMaxLength(50);
            entity.Property(e => e.UserTypeId).HasColumnName("UserTypeID");
        });

        modelBuilder.Entity<VwDepartment>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_Department");

            entity.Property(e => e.DepartmentId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("Department_ID");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("Department_Name");
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("Location_id");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
        });

        modelBuilder.Entity<VwEmployeeAssignment>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_Employee_Assignments");

            entity.Property(e => e.Company)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.DepartmentLongName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EffectiveEndDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveStartDate).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeCurrentStatus)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LocationID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.PersonTypeId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("PersonTypeID");
            entity.Property(e => e.PositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwEmployeeLatestTAssignment>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_Employee_Latest_tAssignments");

            entity.Property(e => e.Company)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.DepartmentLongName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EffectiveEndDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveStartDate).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeCurrentStatus)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeNo)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(301)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.LocationId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("LocationID");
            entity.Property(e => e.LocationName)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PersonId)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PersonID");
            entity.Property(e => e.PersonTypeId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("PersonTypeID");
            entity.Property(e => e.PositionId)
                .HasColumnType("numeric(15, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.PositionName)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.Sex)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
