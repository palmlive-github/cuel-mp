using cuel_mp_be.Common;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text;

namespace cuel_mp_be.Services
{
    public class UserService : IUserService
    {
        private readonly string ServiceName = "User Service";
        private readonly CeusModel _ceus;
        private readonly Database.DatabaseCeusContext _context;

        public UserService(IOptions<CeusModel> ceus, Database.DatabaseCeusContext context)
        {
            _context = context;
            _ceus = ceus.Value;
        }

        public async Task<IEnumerable<Models.Customs.UserModel>> ToListAsync()
        {
            try
            {
                return await _context.TCeusAllUserEmpInfos.OrderBy(o => o.FirstName).Select(s => new Models.Customs.UserModel(s)).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }

        public async Task<Models.Customs.UserModel?> FindAsync(int userId)
        {
            try
            {
                return await _context.TCeusAllUserEmpInfos.Where(w => w.UserId == userId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public Models.Customs.UserModel? Find(int userId)
        {
            try
            {
                return _context.TCeusAllUserEmpInfos.Where(w => w.UserId == userId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public Models.Customs.UserModel? Find(decimal personId)
        {
            try
            {
                return _context.TCeusAllUserEmpInfos.Where(w => w.PersonId == personId).OrderByDescending(o => o.UserId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }

        public string GetEnployeeName(int? userId)
        {
            var employee = Find(userId ?? 0);

            if (employee == null) return string.Empty;
            else return string.Format("{0} {1}", employee.FirstName, employee.LastName);
        }
        public string GetEnployeeName(decimal? personId)
        {
            var employee = Find(personId ?? 0);

            if (employee == null) return string.Empty;
            else return string.Format("{0} {1}", employee.FirstName, employee.LastName);
        }

        internal async Task<IEnumerable<Models.Customs.UserModel>> CeusUsersAsync(Models.Customs.UserListQuery q)
        {
            // string query_select = "[PersonID], [UserID], [UserName], [UserCode], [TITLE], [FirstName], [LastName], [Email], [PositionID], [PositionName], [DepartmentID], [DepartmentCode], [DepartmentName], [EmployeeCurrentStatus], [Payroll_ID], [IsManager]";
            // string emp_group = "SELECT MAX(UserID) AS [UserID] FROM [CEUS].[dbo].[T_CEUS_AllUser_EmpInfo] GROUP BY [PersonID]";
            // string query = $"SELECT {query_select} FROM [CEUS].[dbo].[T_CEUS_AllUser_EmpInfo] WHERE [UserID] IN ({emp_group})";

            // return await _context.TCeusAllUserEmpInfos.FromSqlRaw(query).Select(s => new Models.Customs.UserModel(s)).ToListAsync();

            IQueryable<Models.CEUS.TCeusAllUserEmpInfo> query = _context.TCeusAllUserEmpInfos;

            if (q.UserId.HasValue) query = query.Where(m => m.UserId == q.UserId);
            if (q.PersonId.HasValue) query = query.Where(m => m.PersonId == q.PersonId);
            if (!string.IsNullOrWhiteSpace(q.UserCode)) query = query.Where(m => m.UserCode == q.UserCode);
            if (!string.IsNullOrWhiteSpace(q.EmployeeCurrentStatus)) query = query.Where(m => m.EmployeeCurrentStatus == q.EmployeeCurrentStatus);

            if (!string.IsNullOrWhiteSpace(q.FullName))
            {
                string like = $"%{q.FullName}%";
                query = query.Where(m =>
                    EF.Functions.Like((m.FullName ?? string.Empty), like)
                );
            }

            int total = await query.CountAsync();
            if (q.Limit == -1)
                q.Limit = total;

            List<Models.Customs.UserModel> rows = await query.Take(q.Limit).Select(s => new Models.Customs.UserModel(s)).ToListAsync();

            return rows;
        }
        public async Task<IEnumerable<Models.Customs.UserModel>> CeusUsersAll(Models.Customs.UserListQuery q)
        {
            try
            {
                var result = await CeusUsersAsync(q);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public async Task<IEnumerable<Models.Customs.UserModel>> CeusUsers(Models.Customs.UserListQuery q)
        {
            try
            {
                var result = await CeusUsersAsync(q);
                return result.Where(w => w.PayrollId != null).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public async Task<IEnumerable<Models.Customs.UserModel>> CeusUserActive(Models.Customs.UserListQuery q)
        {
            try
            {
                var result = await CeusUsersAsync(q);
                return result.Where(w => w.PayrollId != null && w.EmployeeCurrentStatus == "Active").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }

        // public async Task<IEnumerable<Models.Customs.UserModel>> CeusUserSupervisor()
        // {
        //     try
        //     {
        //         List<Models.Customs.UserModel> results = new List<Models.Customs.UserModel>();

        //         var users = await CeusUsers();
        //         var SupervisorIds = await _context.TCeusEmployeeSupervisors.Select(s => s.PersonId).ToListAsync();

        //         foreach (decimal? SupervisorId in SupervisorIds)
        //         {
        //             if (SupervisorId == null) continue;

        //             var user = users.Where(w => w.Id == SupervisorId).FirstOrDefault();
        //             if (user != null)
        //                 results.Add(user);
        //         }

        //         return results.OrderBy(o => o.FirstName).ToList();

        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception($"{ServiceName}: {ex.Message}");
        //     }
        // }

        // public async Task<IEnumerable<Models.Customs.EmployeePermission>> EmployeePermissionLists()
        // {
        //     List<Models.Customs.EmployeePermission> results = new List<Models.Customs.EmployeePermission>();

        //     List<Models.CEUS.UserApplication> userApplications = await _context.UserApplications.Where(w => w.ApplicationCode == _ceus.ApplicationCode && w.IsEnabled == true).ToListAsync();
        //     List<Models.CEUS.ApplicationPermission> applicationPermissions = await _context.ApplicationPermissions.Where(w => w.ApplicationCode == _ceus.ApplicationCode).ToListAsync();

        //     foreach (int userId in userApplications.GroupBy(g => g.UserId).Select(s => s.Key))
        //     {
        //         List<Models.CEUS.UserApplication> userApplication = userApplications.Where(w => w.UserId == userId).ToList();
        //         List<Models.CEUS.ApplicationPermission> applicationPermission = applicationPermissions.Where(w => userApplication.Any(a => a.ApplicationPermissionId == w.ApplicationPermissionId)).ToList();

        //         results.Add(new Models.Customs.EmployeePermission
        //         {
        //             UserId = userId,
        //             ApplicationCode = userApplication.Select(s => s.ApplicationCode).First(),
        //             PermissionCode = applicationPermission.Select(s => s.PermissionCode ?? string.Empty).ToArray(),
        //             Enabled = userApplication.Any(a => a.IsEnabled == true),
        //             CreatedDate = userApplication.Where(a => a.IsEnabled == true).Select(s => s.CreatedDate).FirstOrDefault(),
        //         });
        //     }

        //     return results;
        // }


        // public async Task<IEnumerable<SelectListItem>> GetLists_ToSelectListAsync(int? selected)
        // {
        //     var result = new List<SelectListItem>();
        //     var items = await CeusUserActive();

        //     foreach (var item in items.Where(w => w.Id == (selected ?? w.Id)).OrderBy(o => o.FirstName))
        //     {
        //         result.Add(new SelectListItem
        //         {
        //             Value = item.Id.ToString(),
        //             Text = item.FullName,
        //             Disabled = (item.EmployeeCurrentStatus == null ? false : item.EmployeeCurrentStatus.ToLower() == "resigned"),
        //             Selected = (item.Id == selected)
        //         });
        //     }

        //     return result;
        // }
    }
}