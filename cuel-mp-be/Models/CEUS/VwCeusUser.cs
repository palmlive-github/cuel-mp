using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class VwCeusUser
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string? UserCode { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsResigned { get; set; }

    public DateTime? ResignDate { get; set; }

    public int? PositionId { get; set; }

    public string? Contact { get; set; }

    public int? UserTypeId { get; set; }

    public bool? IsEnabled { get; set; }

    public bool? IsAd { get; set; }

    public bool? IsOracle { get; set; }

    public DateTime? StartDate { get; set; }

    public byte[]? PasswordEncrypt { get; set; }

    public decimal? PersonId { get; set; }

    public string? EmpEmail { get; set; }

    public string? EmpFirstName { get; set; }

    public string? EmpLastName { get; set; }

    public string? EmployeeNo { get; set; }

    public string? Title { get; set; }

    public string? Sex { get; set; }

    public string Company { get; set; } = null!;

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

    public string? EmployeeAddress { get; set; }

    public decimal? LocationId { get; set; }

    public string? LocationName { get; set; }
}
