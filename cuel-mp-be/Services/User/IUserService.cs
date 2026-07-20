
namespace cuel_mp_be.Services;

public interface IUserService
{
    Task<IEnumerable<Models.Customs.UserModel>> ToListAsync();
    Task<Models.Customs.UserModel?> FindByUserIdAsync(int userId);
    Models.Customs.UserModel? FindByUserId(int userId);
    Models.Customs.UserModel? FindByPersonId(decimal personId);
    string GetEnployeeNameByUserId(int? userId);
    // string GetEnployeeNameByPersonId(decimal? personId);
    Task<IEnumerable<Models.Customs.UserModel>> CeusUsersAll(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUsers(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUserActive(Models.Customs.UserListQuery q);
    // Task<IEnumerable<Models.Customs.UserModel>> CeusUserSupervisor();
    // Task<IEnumerable<Models.Customs.EmployeePermission>> EmployeePermissionLists();
}
