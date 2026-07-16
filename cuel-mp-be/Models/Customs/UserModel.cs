namespace cuel_mp_be.Models.Customs
{

    public class UserListQuery
    {
        public int? UserId { get; set; }
        public int? PersonId { get; set; }
        public string? UserCode { get; set; }
        public string? FullName { get; set; }
        public string? EmployeeCurrentStatus { get; set; }
        public int Limit { get; set; } = 10;
    }

    public class UserModel
    {
        public UserModel() { }
        public UserModel(Models.CEUS.TCeusAllUserEmpInfo item)
        {
            Id = Decimal.ToInt32(item.PersonId ?? 0);
            UserId = item.UserId;
            UserName = item.UserName;
            UserCode = item.EmployeeNo;
            Title = string.IsNullOrEmpty(item.Title) ? string.Empty : item.Title.ToUpper();
            FirstName = item.FirstName;
            LastName = item.LastName;
            FullName = string.Format("{0}{1} {2}", string.IsNullOrEmpty(item.Title) ? string.Empty : $"{item.Title.ToUpper()} ", item.FirstName, item.LastName);
            Email = item.Email;
            PositionId = Decimal.ToInt32(item.EmployeePositionId ?? 0);
            PositionName = item.PositionName;
            DepartmentId = Decimal.ToInt32(item.DepartmentId ?? 0);
            DepartmentCode = item.DepartmentCode;
            DepartmentName = item.DepartmentName;
            EmployeeCurrentStatus = item.EmployeeCurrentStatus;
            PayrollId = item.PayrollId;
            IsManager = item.IsManager;
        }

        public Int32 Id { get; set; }
        public Int32? UserId { get; set; }
        public String? UserName { get; set; }
        public String? Password { get; set; }
        public String? UserCode { get; set; }
        public String? Title { get; set; }
        public String? FirstName { get; set; }
        public String? LastName { get; set; }
        public String? FullName { get; set; }
        public String? Email { get; set; }
        public Int32 PositionId { get; set; }
        public String? PositionName { get; set; }
        public Int32 DepartmentId { get; set; }
        public String? DepartmentCode { get; set; }
        public String? DepartmentName { get; set; }
        public String? EmployeeCurrentStatus { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public Decimal? PayrollId { get; set; }
        public Int32 IsManager { get; set; }

    }

    public class UsersModel
    {
        public List<UserModel> Users { get; set; } = new List<UserModel>();
    }

    public class EmployeeDropdown
    {
        public Int32 Value { get; set; }
        public String Text { get; set; } = null!;
        public Boolean? Enable { get; set; }
    }

    public class EmployeePermission
    {
        public Int32 UserId { get; set; }
        public String ApplicationCode { get; set; } = string.Empty;
        public String[] PermissionCode { get; set; } = Array.Empty<string>();
        public Boolean? Enabled { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}