using ProductCatalogAPI.Repositories;
using ProductCatalogAPI.Services;   
using ProductCatalogAPI.Data;
using ProductCatalogAPI.Exceptions;
using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Dependency Injection - Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Dependency Injection - Services
builder.Services.AddScoped<IProductService, ProductService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Register seeder
builder.Services.AddScoped<DataSeeder>();

// Database (SQLite)
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=ProductCatalog.db"));

// Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build(); 

// Run migrations and seeder on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    // Only seeds if SeedDatabase is true in appsettings.json
    var shouldSeed = builder.Configuration.GetValue<bool>("SeedDatabase");
    if (shouldSeed)
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
        seeder.Seed();
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

