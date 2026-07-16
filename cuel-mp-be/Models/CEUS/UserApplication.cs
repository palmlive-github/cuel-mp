using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models.CEUS;

public partial class UserApplication
{
    public int UserApplicationId { get; set; }

    public int UserId { get; set; }

    public string ApplicationCode { get; set; } = null!;

    public int? ApplicationPermissionId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsEnabled { get; set; }

    public string? ServerName { get; set; }

    public virtual ApplicationPermission? ApplicationPermission { get; set; }
}
