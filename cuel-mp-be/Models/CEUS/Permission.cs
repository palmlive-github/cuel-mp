using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class Permission
{
    public string PermissionCode { get; set; } = null!;

    public string? PermissionName { get; set; }

    public string? PermissionDescription { get; set; }

    public bool? IsEnabled { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public virtual ICollection<ApplicationPermission> ApplicationPermissions { get; } = new List<ApplicationPermission>();
}
