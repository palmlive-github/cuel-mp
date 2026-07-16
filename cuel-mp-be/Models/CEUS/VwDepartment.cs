using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class VwDepartment
{
    public decimal? DepartmentId { get; set; }

    public string? DepartmentName { get; set; }

    public decimal? LocationId { get; set; }

    public string? LocationName { get; set; }
}
