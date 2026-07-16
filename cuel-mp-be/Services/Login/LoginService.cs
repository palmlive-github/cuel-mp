using cuel_mp_be.Common;
using cuel_mp_be.Enttities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace cuel_mp_be.Services;

public class LoginService : ILoginService
{
    private readonly string ServiceName = "Login Service";
    private readonly AppSettingsModel _appSettings;
    private readonly CeusModel _ceus;
    private readonly JwtModel _jwt;
    private readonly ICuelService _cuelService;
    private readonly IUserService _userService;

    public LoginService(IOptions<AppSettingsModel> appSettings, IOptions<CeusModel> ceus, IOptions<JwtModel> jwt, ICuelService cuelService, IUserService userService)
    {
        _appSettings = appSettings.Value;
        _ceus = ceus.Value;
        _jwt = jwt.Value;
        _cuelService = cuelService;
        _userService = userService;
    }

    public async Task<SessionLoginResponse<UserInfo>?> Authenticate(string session)
    {
        HttpClientHandler handler = new HttpClientHandler();
        HttpClient client = new HttpClient(handler);

        handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) =>
        {
            return true;
        };

        client.BaseAddress = string.IsNullOrEmpty(_ceus.AuthUrl) ? null : new Uri(_ceus.AuthUrl);
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json")
        );

        SessionLoginResponse<UserInfo> result;

        GetUserByAppsRequest parameter = new GetUserByAppsRequest()
        {
            session = session,
            applicationCode = _ceus.ApplicationCode
        };

        var stringPayload = JsonConvert.SerializeObject(parameter);

        HttpResponseMessage response = await client.PostAsync(string.Format("api/home/GetUserByApps"), new StringContent(stringPayload, Encoding.UTF8, "application/json"));

        try
        {
            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();

                var userInfoCeus = Newtonsoft.Json.JsonConvert.DeserializeObject<GetUserByAppsResponse>(responseString);

                if (userInfoCeus != null)
                {
                    Models.Customs.UserModel? employee = await _userService.FindAsync(userInfoCeus.userId);
                    if (employee != null)
                    {
                        List<string> roles = await _cuelService.PermissionAllowList(userInfoCeus.permissionCodes);
                        if (_appSettings.Developpers.Any(a => a == userInfoCeus.userDetail.employeeNo))
                            roles = Enttities.Roles.All.Select(s => s.ToLower()).ToList();


                        UserLogin userLogin = new UserLogin
                        {
                            UserID = userInfoCeus.userId,
                            PersonID = userInfoCeus.userDetail.personId,
                            Roles = roles.ToArray(),
                        };

                        UserInfo userInfo = new UserInfo
                        {
                            UserID = userInfoCeus.userId,
                            PersonID = userInfoCeus.userDetail.personId,
                            UserName = userInfoCeus.userName,
                            EmployeeNo = userInfoCeus.userDetail.employeeNo,
                            FirstName = userInfoCeus.userDetail.firstName,
                            LastName = userInfoCeus.userDetail.lastName,
                            FullName = $"{userInfoCeus.userDetail.firstName} {userInfoCeus.userDetail.lastName}",
                            Email = userInfoCeus.userDetail.email,
                            Position = userInfoCeus.userDetail.positionName,
                            Department = userInfoCeus.userDetail.departmentName,
                            Roles = roles.ToArray(),
                        };

                        DateTime JwtExpire_AccessToken = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_jwt.AccessExpiresMinutes));
                        DateTime JwtExpire_RefreshToken = DateTime.UtcNow.AddDays(Convert.ToDouble(_jwt.RefreshExpiresDays));
                        var accessToken = EncodeJwtToken(userInfo, _jwt.AccessSecret, JwtExpire_AccessToken, _jwt.Issuer, false);
                        var refreshToken = EncodeJwtToken_Refresh(userLogin, _jwt.RefreshSecret, JwtExpire_RefreshToken, _jwt.Issuer, false);

                        // await _refreshTokenService.Add(userInfo.UserID, refreshToken, JwtExpire_RefreshToken);

                        result = new SessionLoginResponse<UserInfo>(accessToken, refreshToken, userInfo);
                    }
                    else
                        throw new Exception("Permission denied");
                }
                else
                    throw new Exception("Permission denied");
            }
            else
                throw new Exception("Permission denied");
        }
        catch (Exception ex)
        {
            response.Dispose();
            throw new Exception(ex.Message);
        }
        finally
        {
            response.Dispose();
            client.Dispose();
        }

        return result;
    }
    
    public async Task<string> Refresh(string refreshToken)
    {
        var jwtToken = DecodeJwtToken(_jwt.RefreshSecret, refreshToken);
        var claims = jwtToken.Claims.ToDictionary(k => k.Type, v => v.Value);

        UserInfo userInfo = new UserInfo();

        if (int.TryParse(claims["PersonID"], out int personId))
            userInfo.PersonID = personId;
        else
            userInfo.PersonID = 0;

        if (int.TryParse(claims["UserID"], out int userId))
            userInfo.UserID = userId;
        else
            userInfo.UserID = 0;

        var employee = await _userService.FindAsync(userInfo.UserID);
        if(employee == null) throw new Exception("Permission denied");

        userInfo.UserName = employee.UserName;
        userInfo.EmployeeNo = employee.UserCode;
        userInfo.FirstName = employee.FirstName;
        userInfo.LastName = employee.LastName;
        userInfo.Email = employee.Email;
        userInfo.Position = employee.PositionName;
        userInfo.Department = employee.DepartmentName;

        if (_appSettings.Developpers.Any(a => a == userInfo.EmployeeNo))
            userInfo.Roles = Enttities.Roles.All.Select(s => s.ToLower()).ToArray();
        else
            userInfo.Roles = claims["Roles"].Split(",").ToArray();

        DateTime JwtExpire = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_jwt.AccessExpiresMinutes));
        var accessToken = EncodeJwtToken(userInfo, _jwt.AccessSecret, JwtExpire, _jwt.Issuer, false);

        return accessToken;
    }

    internal string EncodeJwtToken(UserInfo userInfo, string jwtKey, DateTime jwtExpires, string Issuer, bool byPass)
    {
        // generate token that is valid for 1 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor();

        List<Claim> _subject = new List<Claim>();
        _subject.Add(new Claim("PersonID", userInfo.PersonID.ToString()));
        _subject.Add(new Claim("UserID", userInfo.UserID.ToString()));
        _subject.Add(new Claim("UserName", string.IsNullOrEmpty(userInfo.UserName) ? "" : userInfo.UserName));
        _subject.Add(new Claim("EmployeeNo", string.IsNullOrEmpty(userInfo.EmployeeNo) ? "" : userInfo.EmployeeNo));
        _subject.Add(new Claim("FirstName", string.IsNullOrEmpty(userInfo.FirstName) ? "" : userInfo.FirstName));
        _subject.Add(new Claim("LastName", string.IsNullOrEmpty(userInfo.LastName) ? "" : userInfo.LastName));
        _subject.Add(new Claim("Email", string.IsNullOrEmpty(userInfo.Email) ? "" : userInfo.Email));
        _subject.Add(new Claim("Position", string.IsNullOrEmpty(userInfo.Position) ? "" : userInfo.Position));
        _subject.Add(new Claim("Department", string.IsNullOrEmpty(userInfo.Department) ? "" : userInfo.Department));
        _subject.Add(new Claim("Roles", string.Join(",", userInfo.Roles)));

        tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(_subject),
            Expires = jwtExpires,
            IssuedAt = DateTime.UtcNow,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = Issuer
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    internal string EncodeJwtToken_Refresh(UserLogin userLogin, string jwtKey, DateTime jwtExpires, string Issuer, bool byPass)
    {
        // generate token that is valid for 1 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor();

        List<Claim> _subject = new List<Claim>();
        _subject.Add(new Claim("PersonID", userLogin.PersonID.ToString()));
        _subject.Add(new Claim("UserID", userLogin.UserID.ToString()));
        _subject.Add(new Claim("Roles", string.Join(",", userLogin.Roles)));

        tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(_subject),
            Expires = jwtExpires,
            IssuedAt = DateTime.UtcNow,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = Issuer
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    public JwtSecurityToken DecodeJwtToken(string jwtKey, string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtKey);
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuerSigningKey = true,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false,
            // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
            ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        return (JwtSecurityToken)validatedToken;
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token, string jwtKey)
    {
        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken securityToken;
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
}