using cuel_mp_be.Common;
using cuel_mp_be.Extensions;
using cuel_mp_be.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
IConfigurationRoot config;
if (environment == "Development")
{
    config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile($"appsettings.{environment}.json")
            .Build();
}
else
{
    config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile($"appsettings.json")
            .Build();
}

// ==================== Configuration ====================
SwaggerModel SwaggerConfig = config.GetSection("Swagger").Get<SwaggerModel>() ?? new SwaggerModel();


var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Add services to the container.
services.AddRazorPages();

// Connection Database
ConnectionService.ConfigureDatabase(services, config);

ScopeService.Add(services);

ConfigureService.Configure(services, config);

builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opts.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;
    });
          
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API 1"
    });

    // Include 'SecurityScheme' to use JWT Authentication
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowCredentialsPolicy",
        policy =>
        {
            policy.WithOrigins(SwaggerConfig.CorsOrigins) // Specific origin required
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // This enables 'Access-Control-Allow-Credentials: true'
        });
});

var app = builder.Build();

// custom jwt auth middleware
app.UseMiddleware<JwtMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    if(SwaggerConfig.EnableSwagger)
    {
        app.UseSwagger();
        // app.UseSwaggerUI();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            options.RoutePrefix = string.Empty;
        });
    }
}
else if (app.Environment.IsStaging())
{
    if(SwaggerConfig.EnableSwagger)
    {
        app.UseSwagger();
        // app.UseSwaggerUI();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            options.RoutePrefix = SwaggerConfig.BasePath;
        });
    }

    // Server React statis files
    app.UseDefaultFiles();
    app.UseStaticFiles();

    // SPA fallback
    app.MapFallbackToFile("index.html");
}
else
{
    // Server React statis files
    app.UseDefaultFiles();
    app.UseStaticFiles();

    // SPA fallback
    app.MapFallbackToFile("index.html");
}

// global cors policy
// app.UseCors(x => x.WithOrigins(SwaggerConfig.CorsOrigins).AllowAnyMethod().AllowAnyHeader());
app.UseCors("MyAllowCredentialsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseRouting();

app.MapControllers();

app.Run();
// app.Run("http://0.0.0.0:5140");
