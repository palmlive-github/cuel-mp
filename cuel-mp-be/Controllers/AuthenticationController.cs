using cuel_mp_be.Enttities;
using cuel_mp_be.Helpers;
using cuel_mp_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace cuel_mp_be.Controllers;

[ApiController]
[Route("api/authentications")]
public class AuthenticationController : ControllerBase
{
    private readonly ILoginService _loginService;

    public AuthenticationController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Token")]
    public async Task<ActionResult<SessionLoginResponse<UserInfo>>> Token(SessionLoginRequest model)
    {
        try
        {
            var response = await _loginService.Authenticate(model.Session);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("Refresh")]
    public async Task<ActionResult<RefreshResponse>> Refresh(RefreshRequest model)
    {
        try
        {
            var accessToken = await _loginService.Refresh(model.RefreshToken);

            RefreshResponse response = new RefreshResponse()
            {
                AccessToken = accessToken,
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("Me")]
    public ActionResult<UserInfo> Me()
    {
        ContextEnttities User = new ContextEnttities(HttpContext.Items);

        UserInfo result = new UserInfo
        {
            PersonID = User.PersonID,
            UserID = User.UserID,
            UserName = User.UserName,
            EmployeeNo = User.EmployeeNo,
            FirstName = User.FirstName,
            LastName = User.LastName,
            FullName = $"{User.FirstName} {User.LastName}",
            Email = User.Email,
            Position = User.Position,
            Department = User.Department,
            Roles = User.Roles,
        };

        return Ok(result);
    }

    // [Authorize]
    // [HttpPost("Logout")]
    // public async Task<IActionResult> Logout()
    // {
    //     try
    //     {
    //         ContextEnttities User = new ContextEnttities(HttpContext.Items);

    //         await _loginService.Logout(User.UserID);

    //         return Ok("Logged out");
    //     }
    //     catch (Exception ex)
    //     {
    //         return BadRequest(new { message = ex.Message });
    //     }
    // }
}