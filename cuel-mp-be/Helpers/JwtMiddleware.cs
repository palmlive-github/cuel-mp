using cuel_mp_be.Common;
using cuel_mp_be.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.RegularExpressions;

namespace cuel_mp_be.Helpers;

public class JwtMiddleware
{

    private readonly RequestDelegate _next;
    private readonly AppSettingsModel _appSettings;
    private readonly JwtModel _jwt;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettingsModel> appSettings, IOptions<JwtModel> jwt)
    {
        _next = next;
        _appSettings = appSettings.Value;
        _jwt = jwt.Value;
    }

    public async Task Invoke(HttpContext context, ILoginService loginServie)
    {
        var token = context.Request.Headers["authorization"].FirstOrDefault()?.Split(" ").Last();

        if (string.IsNullOrEmpty(token) == false)
            await attachUserToContext(context, loginServie, token);

        await _next(context);
    }

    private async Task attachUserToContext(HttpContext context, ILoginService loginServie, string token)
    {
        try
        {
            var jwtToken = loginServie.DecodeJwtToken(_jwt.AccessSecret, token);
            if (jwtToken != null)
            {

                Enttities.UserInfo userInfo = new Enttities.UserInfo();

                IHeaderDictionary headers = context.Request.Headers;

                var claims = jwtToken.Claims.ToDictionary(k => k.Type, v => v.Value);

                if (int.TryParse(claims["PersonID"], out int personId))
                    userInfo.PersonID = personId;
                else
                    userInfo.PersonID = 0;

                if (int.TryParse(claims["UserID"], out int userId))
                    userInfo.UserID = userId;
                else
                    userInfo.UserID = 0;

                userInfo.UserName = claims["UserName"];
                userInfo.EmployeeNo = claims["EmployeeNo"];
                userInfo.FirstName = claims["FirstName"];
                userInfo.LastName = claims["LastName"];
                userInfo.Email = claims["Email"];
                userInfo.Position = claims["Position"];
                userInfo.Department = claims["Department"];

                if (_appSettings.Developpers.Any(a => a == userInfo.EmployeeNo))
                    userInfo.Roles = Enttities.Roles.All.Select(s => s.ToLower()).ToArray();
                else
                    userInfo.Roles = claims["Roles"].Split(",").ToArray();

                // attach user to context on successful jwt validation
                context.Items["PersonID"] = userInfo.PersonID;
                context.Items["UserID"] = userInfo.UserID;
                context.Items["UserName"] = userInfo.UserName;
                context.Items["EmployeeNo"] = userInfo.EmployeeNo;
                context.Items["FirstName"] = userInfo.FirstName;
                context.Items["LastName"] = userInfo.LastName;
                context.Items["Email"] = userInfo.Email;
                context.Items["Position"] = userInfo.Position;
                context.Items["Department"] = userInfo.Department;
                context.Items["Roles"] = userInfo.Roles;
                context.Items["Token"] = token;
                context.Items["Issued"] = jwtToken.ValidFrom.ToLocalTime();
                context.Items["Expires"] = jwtToken.ValidTo.ToLocalTime();

                // context.Items["DeviceType"] = headers["X-Device-Type"].ToString();
                // context.Items["OS"] = headers["X-Device-OS"].ToString();
                // context.Items["Browser"] = headers["X-Device-Browser"].ToString();
                // context.Items["City"] = headers["X-Region-City"].ToString();
                // context.Items["Country"] = headers["X-Region-Country"].ToString();
            }
        }
        catch
        {

        }
    }

}