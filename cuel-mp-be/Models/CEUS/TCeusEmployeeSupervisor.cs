using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class TCeusEmployeeSupervisor
{
    public decimal PersonId { get; set; }

    public string? Email { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? EmployeeNo { get; set; }

    public string? Title { get; set; }

    public string? Sex { get; set; }

    public string? FullNameTitle { get; set; }

    public string? FullName { get; set; }

    public decimal? EmployeePositionId { get; set; }

    public decimal? SupervisorId { get; set; }

    public string? SupervisorFirstName { get; set; }

    public string? SupervisorLastName { get; set; }

    public string? SupervisorTitle { get; set; }

    public string? SupervisorSex { get; set; }

    public string? SupervisorFullName { get; set; }

    public DateTime? EffeciveDate { get; set; }

    public string? PositionName { get; set; }

    public decimal? PositionId { get; set; }

    public string? SupervisorEmployeeNo { get; set; }

    public string? SupervisorEmail { get; set; }

    public string? SupervisorPositionName { get; set; }

    public string? PositionCode { get; set; }

    public string? SupervisorPositionCode { get; set; }

    public string? DepartmentName { get; set; }

    public string? DepartmentCode { get; set; }

    public string? SupervisorDepartmentName { get; set; }

    public string? SupervisorDepartmentCode { get; set; }

    public string? EmployeeName { get; set; }

    public int IsManager { get; set; }

    public string IsIc { get; set; } = null!;

    public string Location { get; set; } = null!;

    public decimal? JobId { get; set; }

    public string? JobName { get; set; }

    public int? ApproveLevel { get; set; }

    public string? JobCode { get; set; }
}
