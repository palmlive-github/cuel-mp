using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class DeptGroup
{
    public int Id { get; set; }

    public string GroupName { get; set; } = null!;

    public virtual ICollection<DeptGroupMember> DeptGroupMembers { get; } = new List<DeptGroupMember>();
}
