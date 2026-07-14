using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProductCatalogAPI.Data;
using ProductCatalogAPI.Data.Seeders;
using ProductCatalogAPI.Exceptions;
using ProductCatalogAPI.Models;
using ProductCatalogAPI.Repositories;
using ProductCatalogAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Dependency Injection - Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUnitProductRepository, UnitProductRepository>();

// Dependency Injection - Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUnitProductService, UnitProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Dependency Injection - Seeders
builder.Services.AddScoped<ISeeder, ApplicationUserSeeder>(); 
builder.Services.AddScoped<ISeeder, ProductSeeder>();         
builder.Services.AddScoped<ISeeder, UnitProductSeeder>();

// Register orchestrator
builder.Services.AddScoped<DataSeeder>();

// Database — provider chosen by config (Sqlite for local dev, MySql for production)
var dbProvider = builder.Configuration["Database:Provider"] ?? "Sqlite";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    switch (dbProvider.ToLowerInvariant())
    {
        case "mysql":
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            break;
        default:
            options.UseSqlite(connectionString);
            break;
    }
});

// Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

//Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(
    options => {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
    }
)
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Cookie Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.Name = "AuthCookie";
    options.Cookie.HttpOnly = true;      
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax; 
    options.ExpireTimeSpan = TimeSpan.FromDays(7);  
    options.SlidingExpiration = true;               

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
    });
});

var app = builder.Build(); 

app.UseCors("AllowFrontend");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();

    if (builder.Configuration.GetValue<bool>("SeedDatabase"))
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
        await seeder.SeedAsync();
    }
}

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//* app.UseHttpsRedirection();
app.MapControllers();
app.Run();

