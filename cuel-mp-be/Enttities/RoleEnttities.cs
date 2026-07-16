using System.ComponentModel.DataAnnotations;

namespace cuel_mp_be.Enttities;

public partial class Roles
{
    public const string Developper = "Developper";  // Administrator
    public const string Admin = "Admin";            // Administrator
    public const string HR = "HR";                  // HR
    public const string User = "User";              // User

    public static readonly string[] All = { Admin, HR, User };

    public static readonly string[] Approvers = { User };

    public static bool IsValid(string s) => Array.IndexOf(All, s) >= 0;
}

public partial class PermissionsCode
{
    public const string Developper = "MP0000";   // Administrator
    public const string Admin = "MP0001";        // Administrator
    public const string HR = "MP0002";           // HR
    public const string User = "MP0003";         // User
}