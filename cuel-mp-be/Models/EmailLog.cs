using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class EmailLog
{
    public int Id { get; set; }

    public int? SubmissionId { get; set; }

    public string Template { get; set; } = null!;

    public int? BudgetYearId { get; set; }

    public int? DeptId { get; set; }

    public string ToAddr { get; set; } = null!;

    public string? CcAddr { get; set; }

    public string Subject { get; set; } = null!;

    public DateTime SentAt { get; set; }

    public virtual BudgetYear? BudgetYear { get; set; }

    public virtual Department? Dept { get; set; }

    public virtual DeptSubmission? Submission { get; set; }
}
