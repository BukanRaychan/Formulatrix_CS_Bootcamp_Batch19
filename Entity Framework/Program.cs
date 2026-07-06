using EntityFramework;
using EntityFramework.Controllers;
using EntityFramework.Data;
using EntityFramework.Services;
using Microsoft.EntityFrameworkCore;

using var db = new AppDbContext();

db.Database.Migrate();
DbSeeder.Seed(db);

var service = new MenuService(db);
var controller = new MenuController(service);

new App(controller).Run();
