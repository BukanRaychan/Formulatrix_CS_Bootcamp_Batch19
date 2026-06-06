using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Data;

public class DataSeeder
{
    private readonly AppDbContext _context;

    public DataSeeder(AppDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        SeedProducts();
    }

    private void SeedProducts()
    {
        if (_context.Products.Any()) return;

        var products = new List<Product>
        {
            new Product
            {
                Name = "Laptop",
                Description = "High performance gaming laptop",
                Price = 15000000,
                Stock = 10,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Mouse",
                Description = "Wireless ergonomic mouse",
                Price = 250000,
                Stock = 50,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Keyboard",
                Description = "Mechanical RGB keyboard",
                Price = 800000,
                Stock = 30,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Monitor",
                Description = "4K IPS display 27 inch",
                Price = 5000000,
                Stock = 15,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Headset",
                Description = "Noise cancelling gaming headset",
                Price = 1200000,
                Stock = 25,
                CreatedAt = DateTime.UtcNow
            }
        };

        _context.Products.AddRange(products);
        _context.SaveChanges();
    }
}