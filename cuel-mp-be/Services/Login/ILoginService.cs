using System.IdentityModel.Tokens.Jwt;
using cuel_mp_be.Enttities;

namespace cuel_mp_be.Services
{
    public interface ILoginService
    {
        Task<SessionLoginResponse<UserInfo>?> Authenticate(string session);
        Task<string> Refresh(string refreshToken);
        JwtSecurityToken DecodeJwtToken(string jwtKey, string token);
    }
}