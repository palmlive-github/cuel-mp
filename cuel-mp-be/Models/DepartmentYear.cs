using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class DepartmentYear
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public int DeptId { get; set; }

    public string DeptName { get; set; } = null!;

    public string AllocType { get; set; } = null!;

    public string? ApproverEmpNo { get; set; }

    public string? RequesterEmpNo { get; set; }

    public string? ViewerEmpNo { get; set; }

    public virtual BudgetYear BudgetYear { get; set; } = null!;

    public virtual Department Dept { get; set; } = null!;

    public virtual DeptSubmission? DeptSubmission { get; set; }

    public virtual ICollection<MpEmployee> MpEmployees { get; } = new List<MpEmployee>();
}
