using ProductCatalogAPI.Data.Seeders;

namespace ProductCatalogAPI.Data;

public class DataSeeder
{
    private readonly IEnumerable<ISeeder> _seeders;

    public DataSeeder(IEnumerable<ISeeder> seeders)
    {
        _seeders = seeders;
    }

    public async Task SeedAsync()
    {
        foreach (var seeder in _seeders)
        {
            await seeder.SeedAsync();
        }
    }
}