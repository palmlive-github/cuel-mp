using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class VwCeusAllPosition
{
    public decimal? Id { get; set; }

    public string? Code { get; set; }

    public string? Name { get; set; }

    public decimal? DepartmentId { get; set; }

    public decimal? LocationId { get; set; }

    public string? LocationName { get; set; }
}
