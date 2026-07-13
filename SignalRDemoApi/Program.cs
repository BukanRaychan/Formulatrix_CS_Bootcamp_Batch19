using Microsoft.AspNetCore.SignalR;
using SignalRDemoApi.Hubs;
using SignalRDemoApi.Services;

var builder = WebApplication.CreateBuilder(args);

const string ViteCorsPolicy = "ViteDevClient";

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, UsernameUserIdProvider>();
builder.Services.AddSingleton<UserTracker>();
builder.Services.AddHostedService<HeartbeatBackgroundService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(ViteCorsPolicy);

app.UseAuthorization();

app.MapControllers();
app.MapHub<DemoHub>("/hubs/demo");

app.Run();
