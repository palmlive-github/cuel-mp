using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class DeptSubmission
{
    public int Id { get; set; }

    public int BudgetYearId { get; set; }

    public int DeptId { get; set; }

    public string Status { get; set; } = null!;

    public string? SubmittedBy { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public string? VerifiedBy { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public string? RejectReason { get; set; }

    public string? ReturnComment { get; set; }

    public virtual DepartmentYear DepartmentYear { get; set; } = null!;

    public virtual ICollection<EmailLog> EmailLogs { get; } = new List<EmailLog>();

    public virtual ICollection<StatusHistory> StatusHistories { get; } = new List<StatusHistory>();
}
