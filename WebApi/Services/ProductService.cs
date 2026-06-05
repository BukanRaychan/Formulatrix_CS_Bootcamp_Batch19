using ProductCatalogAPI.DTOs.ProductDtos;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Services;

public class ProductService : IProductService
{
    private static List<Product> _products = new()
    {
        new Product { Id = 1, Name = "Laptop", Description = "Gaming laptop", Price = 15000000, Stock = 10 },
        new Product { Id = 2, Name = "Mouse", Description = "Wireless mouse", Price = 250000, Stock = 50 },
        new Product { Id = 3, Name = "Keyboard", Description = "Mechanical keyboard", Price = 800000, Stock = 30 },
    };

    private ProductResponseDto MapToResponse(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            CreatedAt = product.CreatedAt
        };
    }

    public List<ProductResponseDto> GetAll()
    {
        return _products.Select(MapToResponse).ToList();
    }

    public ProductResponseDto? GetById(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null) return null;
        return MapToResponse(product);
    }

    public ProductResponseDto Create(CreateProductDto dto)
    {
        var product = new Product
        {
            Id = _products.Max(p => p.Id) + 1,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price, 
            Stock = dto.Stock,
            CreatedAt = DateTime.UtcNow
        };

        _products.Add(product);
        return MapToResponse(product);
    }

    public ProductResponseDto? Update(int id, UpdateProductDto dto)
    {
        var existing = _products.FirstOrDefault(p => p.Id == id);
        if (existing == null) return null;

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.Price = dto.Price;
        existing.Stock = dto.Stock;

        return MapToResponse(existing);
    }

    public bool Delete(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null) return false;

        _products.Remove(product);
        return true;
    }
}