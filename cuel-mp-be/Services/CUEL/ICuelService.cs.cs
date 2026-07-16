using cuel_mp_be.Models.CEUS;

namespace cuel_mp_be.Services
{
    public interface ICuelService
    {
        Task<ICollection<VwCeusAllPosition>> GetPositions();
        Task<ICollection<VwCeusAllDepartment>> GetDepartments();
        Task<List<string>> PermissionAllowList(string[] permissionCodes);
    }
}