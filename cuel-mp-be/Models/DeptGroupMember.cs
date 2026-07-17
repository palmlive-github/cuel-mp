using System;
using System.Collections.Generic;

namespace cuel_mp_be.Models;

public partial class DeptGroupMember
{
    public int Id { get; set; }

    public int GroupId { get; set; }

    public int DeptId { get; set; }

    public virtual Department Dept { get; set; } = null!;

    public virtual DeptGroup Group { get; set; } = null!;
}
