using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class BudgetYear
{
    public int Id { get; set; }

    public int Year { get; set; }

    public string? Description { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? ReminderDate { get; set; }

    public DateTime? CutoffDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string EmpListStatus { get; set; } = null!;

    public DateTime? FrozenAt { get; set; }

    public string? FrozenBy { get; set; }

    public virtual ICollection<DepartmentYear> DepartmentYears { get; } = new List<DepartmentYear>();

    public virtual ICollection<EmailLog> EmailLogs { get; } = new List<EmailLog>();

    public virtual ICollection<GraphPriority> GraphPriorities { get; } = new List<GraphPriority>();

    public virtual ICollection<HrLoadAudit> HrLoadAudits { get; } = new List<HrLoadAudit>();

    public virtual ICollection<MpEmployee> MpEmployees { get; } = new List<MpEmployee>();

    public virtual ICollection<Project> Projects { get; } = new List<Project>();
}
