using ProductCatalogAPI.Repositories;
using ProductCatalogAPI.Services;   
using ProductCatalogAPI.Data;
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

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=ProductCatalog.db"));

var app = builder.Build(); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//* app.UseHttpsRedirection();
app.MapControllers();
app.Run();

