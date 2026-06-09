using ProductCatalogAPI.DTOs.ProductDtos;

namespace ProductCatalogAPI.Services;

public interface IProductService
{
    Task<IEnumerable<ProductResponseDto>> GetAll();
    Task<ProductResponseDto?> GetById(int id);
    Task<ProductResponseDto> Create(CreateProductDto dto);
    Task<ProductResponseDto?> Update(int id, UpdateProductDto dto);
    Task<bool> Delete(int id);
}