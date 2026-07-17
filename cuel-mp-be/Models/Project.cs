using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class Project
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public string ProjectName { get; set; } = null!;

    public string? Units { get; set; }

    public string? Category { get; set; }

    public bool IsSystem { get; set; }

    public virtual ICollection<Allocation> Allocations { get; } = new List<Allocation>();

    public virtual BudgetYear BudgetYear { get; set; } = null!;

    public virtual ICollection<ProjectScope> ProjectScopes { get; } = new List<ProjectScope>();
}
