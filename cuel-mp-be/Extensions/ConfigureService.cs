
using cuel_mp_be.Common;

namespace cuel_mp_be.Extensions;

public static class ConfigureService
{
    public static void Configure(IServiceCollection service, IConfiguration config)
    {
        // configure strongly typed settings object
        service.Configure<AppSettingsModel>(config.GetSection("AppSettings"));
        service.Configure<SwaggerModel>(config.GetSection("Swagger"));
        service.Configure<JwtModel>(config.GetSection("Jwt"));
        service.Configure<CeusModel>(config.GetSection("Ceus"));
        service.Configure<SmtpModel>(config.GetSection("Smtp"));
        service.Configure<UploadModel>(config.GetSection("Upload"));
    }
}