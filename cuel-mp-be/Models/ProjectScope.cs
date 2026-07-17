using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class ProjectScope
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string ScopeName { get; set; } = null!;

    public DateTime? StartDate { get; set; }

    public DateTime? FinishDate { get; set; }

    public virtual Project Project { get; set; } = null!;
}
