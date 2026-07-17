using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class MpEmployee
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public int DeptId { get; set; }

    public string EmpCode { get; set; } = null!;

    public string RecordType { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Position { get; set; }

    public string? Location { get; set; }

    public string? EmpType { get; set; }

    public string AllocType { get; set; } = null!;

    public DateTime? StartDate { get; set; }

    public DateTime? NewRequestDate { get; set; }

    public DateTime? TransferInDate { get; set; }

    public DateTime? TransferOutDate { get; set; }

    public DateTime? PlannedResignDate { get; set; }

    public DateTime? ResignDate { get; set; }

    public string? RemarkDefault { get; set; }

    public string? RemarkOverride { get; set; }

    public virtual ICollection<Allocation> Allocations { get; } = new List<Allocation>();

    public virtual BudgetYear BudgetYear { get; set; } = null!;

    public virtual DepartmentYear DepartmentYear { get; set; } = null!;

    public virtual Department Dept { get; set; } = null!;
}
