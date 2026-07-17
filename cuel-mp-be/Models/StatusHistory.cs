using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class StatusHistory
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public string Action { get; set; } = null!;

    public string? FromStatus { get; set; }

    public string ToStatus { get; set; } = null!;

    public string Actor { get; set; } = null!;

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual DeptSubmission Submission { get; set; } = null!;
}
