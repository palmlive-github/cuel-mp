using cuel_mp_be.Services;

namespace cuel_mp_be.Extensions;

public static class ScopeService
{
    public static void Add(IServiceCollection service)
    {
        service.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        service.AddScoped<ICuelService, CuelService>();
        service.AddScoped<IUserService, UserService>();

        service.AddScoped<ILoginService, LoginService>();
    }
}