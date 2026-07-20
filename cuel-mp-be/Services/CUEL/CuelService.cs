using cuel_mp_be.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace cuel_mp_be.Services;

public class CuelService : ICuelService
{
    private readonly string ServiceName = "CUEL";
    private readonly CeusModel _ceus;
    private readonly Database.DatabaseCeusContext _context;
    private readonly IUserService _userService;
    public CuelService(IOptions<CeusModel> ceus, Database.DatabaseCeusContext context, IUserService userService)
    {
        _ceus = ceus.Value;
        _context = context;
        _userService = userService;
    }

    public async Task<ICollection<Models.CEUS.VwCeusAllPosition>> GetPositions()
    {
        return await _context.VwCeusAllPositions.AsNoTracking().ToListAsync();
    }
    public async Task<ICollection<Models.CEUS.VwCeusAllDepartment>> GetDepartments()
    {
        return await _context.VwCeusAllDepartments.AsNoTracking().ToListAsync();
    }

    internal string AnyPermission(string permissionCode)
    {
        if (permissionCode == Enttities.PermissionsCode.Admin)
            return Enttities.Roles.Admin.ToLower();
        else if (permissionCode == Enttities.PermissionsCode.HR)
            return Enttities.Roles.HR.ToLower();
        else if (permissionCode == Enttities.PermissionsCode.User)
            return Enttities.Roles.User.ToLower();
        else
            return string.Empty;
    }
    public async Task<List<string>> PermissionAllowList(string[] permissionCodes)
    {
        List<string> roles = new List<string>();
        List<string> permissions = await _context.ApplicationPermissions
        .AsNoTracking()
        .Where(w => w.ApplicationCode == _ceus.ApplicationCode)
        .Select(s => (s.PermissionCode ?? string.Empty))
        .ToListAsync();

        foreach (string permissionCode in permissionCodes)
        {
            if (permissions.Any(a => a == permissionCode))
            {
                string role = AnyPermission(permissionCode);
                if (string.IsNullOrEmpty(role) == false)
                    roles.Add(role);
            }
        }

        if (roles.Count() == 0)
            throw new Exception("Permission denied");

        return roles;
    }

    public async Task<Models.CEUS.UserApplication> AddApplicationPermission(int userId, string permissionCode)
    {
        try
        {
            var employee = await _userService.FindByUserIdAsync(userId);
            if (employee == null) throw new Exception($"UserId {userId} not found");

            var permissionAny = _context.ApplicationPermissions.Any(w => w.ApplicationCode == _ceus.ApplicationCode && w.PermissionCode == permissionCode && w.IsEnabled == true);
            if (permissionAny == false) throw new Exception("Permission not found");

            var pApplicationCode = new Microsoft.Data.SqlClient.SqlParameter
            {
                ParameterName = "@pApplicationCode",
                SqlDbType = System.Data.SqlDbType.VarChar,
                Size = 5,
                Value = _ceus.ApplicationCode
            };
            var pPermissionCode = new Microsoft.Data.SqlClient.SqlParameter
            {
                ParameterName = "@pPermissionCode",
                SqlDbType = System.Data.SqlDbType.VarChar,
                Size = 6,
                Value = permissionCode
            };
            var pUserID = new Microsoft.Data.SqlClient.SqlParameter
            {
                ParameterName = "@pUserID",
                SqlDbType = System.Data.SqlDbType.Int,
                Value = employee.UserId
            };

            var pError = new Microsoft.Data.SqlClient.SqlParameter
            {
                ParameterName = "@pError",
                SqlDbType = System.Data.SqlDbType.Bit,
                IsNullable = true,
                Value = 0,
                Direction = System.Data.ParameterDirection.Output
            };
            var pMessage = new Microsoft.Data.SqlClient.SqlParameter
            {
                ParameterName = "@pMessage",
                SqlDbType = System.Data.SqlDbType.VarChar,
                Size = 255,
                IsNullable = true,
                Value = string.Empty,
                Direction = System.Data.ParameterDirection.Output
            };

            var spUserApplications = await _context.UserApplications
                .FromSqlRaw("EXECUTE [dbo].[AddApplicationPermission] @pApplicationCode, @pPermissionCode, @pUserID, @pError OUTPUT, @pMessage OUTPUT", pApplicationCode, pPermissionCode, pUserID, pError, pMessage)
                .ToListAsync();

            bool error = Convert.IsDBNull(pError) ? false : (bool)pError.Value;
            string message = Convert.IsDBNull(pMessage) ? string.Empty : (string)pMessage.Value;

            if (error) throw new Exception(message);
            else return spUserApplications.First();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}