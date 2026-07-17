using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class Allocation
{
    public long Id { get; set; }

    public int MpEmpId { get; set; }

    public int ProjectId { get; set; }

    public byte MonthNo { get; set; }

    public decimal Fte { get; set; }

    public virtual MpEmployee MpEmp { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
