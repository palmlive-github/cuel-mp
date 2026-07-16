
namespace cuel_mp_be.Services;

public interface IUserService
{
    Task<IEnumerable<Models.Customs.UserModel>> ToListAsync();
    Task<Models.Customs.UserModel?> FindAsync(int userId);
    Models.Customs.UserModel? Find(int userId);
    // Models.Customs.UserModel? Find(decimal personId);
    string GetEnployeeName(int? userId);
    // string GetEnployeeName(decimal? personId);
    Task<IEnumerable<Models.Customs.UserModel>> CeusUsersAll(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUsers(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUserActive(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUserSupervisor();
    // Task<IEnumerable<Models.Customs.EmployeePermission>> EmployeePermissionLists();
}
