using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class VwEmployeeLatestTAssignment
{
    public decimal? PersonId { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? EmployeeNo { get; set; }

    public string? Title { get; set; }

    public string? Sex { get; set; }

    public string Company { get; set; } = null!;

    public string? FullName { get; set; }

    public decimal? PersonTypeId { get; set; }

    public string EmployeeCurrentStatus { get; set; } = null!;

    public DateTime? EffectiveStartDate { get; set; }

    public DateTime? EffectiveEndDate { get; set; }

    public decimal? PositionId { get; set; }

    public string? PositionName { get; set; }

    public decimal? DepartmentId { get; set; }

    public string? DepartmentCode { get; set; }

    public string? DepartmentName { get; set; }

    public string? DepartmentLongName { get; set; }

    public decimal? LocationId { get; set; }

    public string? LocationName { get; set; }
}
