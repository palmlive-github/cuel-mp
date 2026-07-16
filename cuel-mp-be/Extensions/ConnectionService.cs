using Microsoft.EntityFrameworkCore;

namespace cuel_mp_be.Extensions;

public static class ConnectionService
{
    public static void ConfigureDatabase(IServiceCollection service, IConfiguration config)
    {
        // dotnet ef dbcontext scaffold "" Microsoft.EntityFrameworkCore.SqlServer -o Models --context-dir Database -c DatabaseContext -f
        // service.AddDbContext<Database.DatabaseContext>(options => options.UseSqlServer(config.GetConnectionString("MP")));

        // dotnet ef dbcontext scaffold "" Microsoft.EntityFrameworkCore.SqlServer -o Models/CEUS --table VW_Employee_Assignments --table VW_CEUS_User --table VW_Department --table vw_CUEL_All_CEUS_User --table VW_Employee_Latest_tAssignments --table Permission --table UserApplication --table ApplicationPermission --table T_CEUS_AllUser_EmpInfo --table VW_CEUS_All_Departments --table VW_CEUS_All_Locations --table VW_CEUS_All_Positions --table T_CEUS_EmployeeSupervisor --context-dir Database -c DatabaseCeusContext -f
        service.AddDbContext<Database.DatabaseCeusContext>(options => options.UseSqlServer(config.GetConnectionString("CEUS")));

    }
}