using System.ComponentModel.DataAnnotations;

namespace cuel_mp_be.Enttities;

public class UserLogin
{
    public int UserID { get; set; }
    public int PersonID { get; set; }
    public string[] Roles { get; set; } = Array.Empty<string>();
}

public class UserInfo : UserLogin
{
    public string? UserName { get; set; }
    public string? EmployeeNo { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
}

public class SessionLoginRequest
{
    [Required(ErrorMessage = "session is required")]
    [MinLength(1)]
    public string Session { get; set; } = default!;
}

public class RefreshRequest
{
    [Required(ErrorMessage = "Refresh token is required")]
    [MinLength(1)]
    public string RefreshToken { get; set; } = default!;
}

public class SessionLoginResponse<T>
{
    public string AccessToken { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
    public T User { get; set; } = default!;
    
    public SessionLoginResponse(String accessToken, String refreshToken, T user)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        User = user;
    }
}

public class RefreshResponse
{
    public string AccessToken { get; set; } = default!;
}