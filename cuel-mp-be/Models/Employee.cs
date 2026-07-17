using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string EmpCode { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Position { get; set; }

    public int? DeptCode { get; set; }

    public string? Location { get; set; }

    public string? EmpType { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime LoadedAt { get; set; }
}
