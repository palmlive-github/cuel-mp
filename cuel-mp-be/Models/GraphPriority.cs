using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class GraphPriority
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public string Panel { get; set; } = null!;

    public string ItemKey { get; set; } = null!;

    public int Priority { get; set; }

    public virtual BudgetYear BudgetYear { get; set; } = null!;
}
