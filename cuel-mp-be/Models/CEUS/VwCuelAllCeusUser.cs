using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class VwCuelAllCeusUser
{
    public decimal? PersonId { get; set; }

    public int UserId { get; set; }

    public string? Email { get; set; }

    public string UserName { get; set; } = null!;

    public string? EmployeeNo { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int? Password { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public DateTime? ResignDate { get; set; }

    public int? PositionId { get; set; }

    public string? Contact { get; set; }

    public int? UserTypeId { get; set; }

    public bool? IsEnabled { get; set; }

    public bool? IsAd { get; set; }

    public bool? IsOracle { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EffectiveStartDate { get; set; }

    public DateTime? EffectiveEndDate { get; set; }

    public string EmployeeName { get; set; } = null!;

    public string? DepartmentName { get; set; }

    public string? PositionName { get; set; }

    public string? Title { get; set; }

    public string? Sex { get; set; }

    public string? FullName { get; set; }

    public decimal? EmployeePositionId { get; set; }

    public decimal? SupervisorId { get; set; }

    public string? SupervisorFirstName { get; set; }

    public string? SupervisorLastName { get; set; }

    public string? SupervisorTitle { get; set; }

    public string? SupervisorGender { get; set; }

    public string? SupervisorFullName { get; set; }

    public DateTime? EffeciveDate { get; set; }

    public string? Expr1 { get; set; }

    public string? SupervisorEmployeeNo { get; set; }

    public string? SupervisorEmail { get; set; }

    public string? SupervisorPositionName { get; set; }

    public string? PositionCode { get; set; }

    public string? SupervisorPositionCode { get; set; }

    public string? Expr2 { get; set; }

    public string? DepartmentCode { get; set; }

    public string? SupervisorDepartmentName { get; set; }

    public string? SupervisorDepartmentCode { get; set; }

    public int IsManager { get; set; }

    public string? EmployeeAddress { get; set; }

    public decimal? LocationId { get; set; }

    public string? LocationName { get; set; }

    public decimal? PersonTypeId { get; set; }

    public int IsResigned { get; set; }

    public string Resigned { get; set; } = null!;
}
