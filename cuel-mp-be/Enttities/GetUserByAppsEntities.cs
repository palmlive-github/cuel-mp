
namespace cuel_mp_be.Enttities;

public class GetUserByAppsRequest
{
    public string session { get; set; } = default!;
    public string applicationCode { get; set; } = default!;
}

public class UserDetail
{
    public int personId { get; set; }
    public string email { get; set; } = default!;
    public string firstName { get; set; } = default!;
    public string lastName { get; set; } = default!;
    public string employeeNo { get; set; } = default!;
    public string title { get; set; } = default!;
    public string sex { get; set; } = default!;
    public string fullName { get; set; } = default!;
    public int? employeePositionId { get; set; }
    public DateTime? effeciveDate { get; set; }
    public string positionName { get; set; } = default!;
    public string positionCode { get; set; } = default!;
    public string departmentName { get; set; } = default!;
    public string departmentCode { get; set; } = default!;
    public int isManager { get; set; }
}

public class GetUserByAppsResponse
{
    public int userId { get; set; }
    public string userName { get; set; } = default!;
    public int positionId { get; set; }
    public string contact { get; set; } = default!;
    public int userTypeId { get; set; }
    public bool isEnabled { get; set; }
    public bool isAd { get; set; }
    public bool isOracle { get; set; }
    public UserDetail userDetail { get; set; } = default!;
    public string[] permissionCodes { get; set; } = default!;
}