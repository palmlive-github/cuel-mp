using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class ApplicationPermission
{
    public int ApplicationPermissionId { get; set; }

    public string? ApplicationCode { get; set; }

    public string? PermissionCode { get; set; }

    public bool? IsEnabled { get; set; }

    public virtual Permission? PermissionCodeNavigation { get; set; }

    public virtual ICollection<UserApplication> UserApplications { get; } = new List<UserApplication>();
}
