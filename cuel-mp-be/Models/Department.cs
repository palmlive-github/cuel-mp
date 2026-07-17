using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class Department
{
    public int Id { get; set; }

    public int DeptCode { get; set; }

    public int? ParentDeptId { get; set; }

    public bool IsParent { get; set; }

    public virtual ICollection<DepartmentYear> DepartmentYears { get; } = new List<DepartmentYear>();

    public virtual DeptGroupMember? DeptGroupMember { get; set; }

    public virtual ICollection<EmailLog> EmailLogs { get; } = new List<EmailLog>();

    public virtual ICollection<Department> InverseParentDept { get; } = new List<Department>();

    public virtual ICollection<MpEmployee> MpEmployees { get; } = new List<MpEmployee>();

    public virtual Department? ParentDept { get; set; }
}
