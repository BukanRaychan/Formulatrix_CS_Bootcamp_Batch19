using ProductCatalogAPI.DTOs.ProductDtos;

namespace ProductCatalogAPI.Services;

public interface IProductService
{
    List<ProductResponseDto> GetAll();
    ProductResponseDto? GetById(int id);
    ProductResponseDto Create(CreateProductDto dto);
    ProductResponseDto? Update(int id, UpdateProductDto dto);
    bool Delete(int id);
}