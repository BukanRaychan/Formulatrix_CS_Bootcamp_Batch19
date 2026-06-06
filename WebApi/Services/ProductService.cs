using AutoMapper;
using ProductCatalogAPI.DTOs.ProductDtos;
using ProductCatalogAPI.Models;
using ProductCatalogAPI.Repositories;

namespace ProductCatalogAPI.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<List<ProductResponseDto>> GetAll()
    {
        var products = await _productRepository.GetAllAsync();
        return _mapper.Map<List<ProductResponseDto>>(products);
    }

    public async Task<ProductResponseDto?> GetById(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return null;
        return _mapper.Map<ProductResponseDto>(product);
    }

    public async Task<ProductResponseDto> Create(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        product.CreatedAt = DateTime.UtcNow;

        var created = await _productRepository.CreateAsync(product);
        return _mapper.Map<ProductResponseDto>(created);
    }

    public async Task<ProductResponseDto?> Update(int id, UpdateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        var updated = await _productRepository.UpdateAsync(id, product);
        if (updated == null) return null;
        return _mapper.Map<ProductResponseDto>(updated);
    }

    public async Task<bool> Delete(int id)
    {
        return await _productRepository.DeleteAsync(id);
    }
}