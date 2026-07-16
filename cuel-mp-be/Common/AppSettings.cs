namespace cuel_mp_be.Common;

public class PermissionModel
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
public class AppSettingsModel
{
    public string[] Developpers { get; set; } = Array.Empty<string>();
    public ICollection<PermissionModel> Permissions { get; set; } = new List<PermissionModel>();
}

public class SwaggerModel
{
    public string BasePath { get; set; } = "swagger";
    public string AppUrl { get; set; } = "http://localhost:5170";
    public string[] CorsOrigins { get; set; } = new string[1] { "http://localhost:5170" };
    public bool EnableSwagger { get; set; } = true;
}
public class JwtModel
{
    public string AccessSecret { get; set; } = "replace-with-strong-random-256bit-secret";
    public string RefreshSecret { get; set; } = "replace-with-different-strong-secret";
    public int AccessExpiresMinutes { get; set; } = 15;
    public int RefreshExpiresDays { get; set; } = 7;
    public string Issuer { get; set; } = "mp-api";
    public string Audience { get; set; } = "mp-app";
    public string CookieName { get; set; } = "mp_refresh";
    public bool CookieSecure { get; set; } = false;
    public string CookieDomain { get; set; } = string.Empty;
}
public class CeusModel
{
    public string AuthUrl { get; set; } = string.Empty;
    public string ApplicationCode { get; set; } = string.Empty;
    public int TimeoutMs { get; set; } = 10000;
    public bool Required { get; set; } = false;
}
public class SmtpModel
{
    public bool Active { get; set; } = true;
    public bool Testing { get; set; } = false;
    public string To { get; set; } = "DamrongK@cuel.co.th";
    public string Host { get; set; } = "smtp.office365.com";
    public int Port { get; set; } = 10000;
    public string Domain { get; set; } = "CUEL";
    public bool Secure { get; set; } = false;
    public string User { get; set; } = "noreply@company.com";
    public string Pass { get; set; } = "changeme";
    public string FromName { get; set; } = "MSR System";
    public string FromEmail { get; set; } = "noreply@company.com";
    public string[] Groups { get; set; } = new string[0];
}

public class UploadModel
{
    public string Dir { get; set; } = "uploads";
    public int MaxMb { get; set; } = 10;
}
