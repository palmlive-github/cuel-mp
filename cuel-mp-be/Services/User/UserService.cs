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
                return await _context.TCeusAllUserEmpInfos.AsNoTracking().OrderBy(o => o.FirstName).Select(s => new Models.Customs.UserModel(s)).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }

        public async Task<Models.Customs.UserModel?> FindByUserIdAsync(int userId)
        {
            try
            {
                return await _context.TCeusAllUserEmpInfos.AsNoTracking().Where(w => w.UserId == userId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public Models.Customs.UserModel? FindByUserId(int userId)
        {
            try
            {
                return _context.TCeusAllUserEmpInfos.AsNoTracking().Where(w => w.UserId == userId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }
        public Models.Customs.UserModel? FindByPersonId(decimal personId)
        {
            try
            {
                return _context.TCeusAllUserEmpInfos.AsNoTracking().Where(w => w.PersonId == personId).OrderByDescending(o => o.UserId).Select(s => new Models.Customs.UserModel(s)).FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ServiceName}: {ex.Message}");
            }
        }

        public string GetEnployeeNameByUserId(int? userId)
        {
            var employee = FindByUserId(userId ?? 0);

            if (employee == null) return string.Empty;
            else return string.Format("{0} {1}", employee.FirstName, employee.LastName);
        }
        public string GetEnployeeNameByPersonId(decimal? personId)
        {
            var employee = FindByPersonId(personId ?? 0);

            if (employee == null) return string.Empty;
            else return string.Format("{0} {1}", employee.FirstName, employee.LastName);
        }

        internal async Task<IEnumerable<Models.Customs.UserModel>> CeusUsersAsync(Models.Customs.UserListQuery q)
        {
            IQueryable<Models.CEUS.TCeusAllUserEmpInfo> query = _context.TCeusAllUserEmpInfos.AsNoTracking().AsSplitQuery();

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
    }
}