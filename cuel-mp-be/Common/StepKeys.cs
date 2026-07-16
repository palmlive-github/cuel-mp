namespace cuel_mp_be.Common;

/// <summary>
/// 4-step approval flow (spec §6.1). Step 2 (leadDisc2) is optional and is
/// skipped automatically when no <see cref="cuel_sca_be.Models.ApprovalAssignment"/>
/// exists for it.
/// </summary>
public static class StepKeys
{
    public const string LeadDisc       = "leadDisc";
    public const string LeadDisc2      = "leadDisc2";
    public const string CostController = "costController";
    public const string ProjectManager = "projectManager";

    public static readonly string[] OrderedSteps =
    {
        LeadDisc, LeadDisc2, CostController, ProjectManager,
    };

    public static int OrderOf(string key) => Array.IndexOf(OrderedSteps, key);
    public static string? At(int index) =>
        index >= 0 && index < OrderedSteps.Length ? OrderedSteps[index] : null;
}

public static class MsrStatuses
{
    public const string Draft     = "draft";
    public const string Awaiting  = "awaiting";
    public const string Sourcing  = "sourcing";
    public const string Completed = "completed";
    public const string Rejected  = "rejected";
}

public static class EmailEvents
{
    public const string Submit       = "submit";
    public const string SubmitRev    = "submit_rev";
    public const string ApproveMid   = "approve_mid";
    public const string ApproveFinal = "approve_final";
    public const string Reject       = "reject";
    public const string SourcingDone = "sourcing_done";
}
