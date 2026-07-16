namespace cuel_mp_be.Common;

/// <summary>
/// 4-step approval flow (spec §6.1). Step 2 (leadDisc2) is optional and is
/// skipped automatically when no <see cref="cuel_sca_be.Models.ApprovalAssignment"/>
/// exists for it.
/// </summary>
public static class FileType
{
    public const string PDF = ".pdf"; // application/pdf
    public const string DOC = ".doc"; // application/msword
    public const string DOCX = ".docx"; // application/vnd.openxmlformats-officedocument.wordprocessingml.document

    public static readonly string[] FileTypes =
    {
        PDF, DOC, DOCX,
    };
}

public static class ContentType
{
    public const string PDF = "application/pdf";
    public const string DOC = "application/msword";
    public const string DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    public static readonly string[] ContentTypes =
    {
        PDF, DOC, DOCX,
    };
}