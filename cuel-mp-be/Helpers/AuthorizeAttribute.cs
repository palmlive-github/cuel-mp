using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace cuel_mp_be.Helpers;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public string? Roles { get; set; }
    
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        bool Unauthorized = false;
        bool MethodNotAllowed = false;
        bool AuthenticationTimeout = false;

        var _roles = ConvertValue<string[]>(context.HttpContext.Items["Roles"]);
        var _iat = ConvertValue<DateTime?>(context.HttpContext.Items["Issued"]);
        var _exp = ConvertValue<DateTime?>(context.HttpContext.Items["Expires"]);

        if (_roles == null || _iat == null || _exp == null) Unauthorized = true;
        else
        {
            if (Roles != null)
            {
                string[] roles = Roles.Split(",").Select(s => s.Trim().ToUpper()).ToArray();

                MethodNotAllowed = true;
                foreach (string role in _roles)
                {
                    if (roles.Any(a => a.Equals(role.ToUpper())))
                        MethodNotAllowed = false;
                }

                // if (roles.Any(a => a.Equals(_role.ToUpper())))
                //     MethodNotAllowed = false;
                // else
                //     MethodNotAllowed = true;

            }


            // if (_exp.Value < DateTime.Now) AuthenticationTimeout = true;
            // else if (_iat.Value > DateTime.Now || _exp.Value < DateTime.Now) AuthenticationTimeout = true;
        }

        if (Unauthorized)
        {
            context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            return;
        }

        if (MethodNotAllowed)
        {
            context.Result = new JsonResult(new { message = "MethodNotAllowed" }) { StatusCode = StatusCodes.Status405MethodNotAllowed };
            return;
        }

        if (AuthenticationTimeout)
        {
            context.Result = new JsonResult(new { message = "AuthenticationTimeout" }) { StatusCode = StatusCodes.Status419AuthenticationTimeout };
            return;
        }

    }

    private T? ConvertValue<T>(object? value)
    {
        if (value == null) return default(T);
        else return (T)value;
    }
}