using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class HrLoadAudit
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public DateTime LoadedAt { get; set; }

    public string LoadedBy { get; set; } = null!;

    public int PrevCount { get; set; }

    public int NewCount { get; set; }

    public string? ChangesJson { get; set; }

    public string? SnapshotJson { get; set; }

    public virtual BudgetYear BudgetYear { get; set; } = null!;
}
