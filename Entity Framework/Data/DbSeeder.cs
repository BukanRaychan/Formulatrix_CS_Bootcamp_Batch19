using EntityFramework.Models;

namespace EntityFramework.Data;

// Inserts sample data on first run so the lists and delete flow have
// something to show. Runs only when the database has no categories yet,
// so it never duplicates on later runs.
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.MenuCategories.Any()) return;

        var beverages = new MenuCategory
        {
            Name = "Beverages",
            MenuItems =
            {
                new MenuItem { Name = "Espresso", Price = 3.00m },
                new MenuItem { Name = "Iced Latte", Price = 4.50m },
            },
        };

        var mains = new MenuCategory
        {
            Name = "Main Course",
            MenuItems =
            {
                new MenuItem { Name = "Margherita Pizza", Price = 12.00m },
                new MenuItem { Name = "Beef Burger", Price = 10.50m },
            },
        };

        var desserts = new MenuCategory
        {
            Name = "Desserts",
            MenuItems =
            {
                new MenuItem { Name = "Tiramisu", Price = 6.00m },
            },
        };

        db.MenuCategories.AddRange(beverages, mains, desserts);
        db.SaveChanges();
    }
}
