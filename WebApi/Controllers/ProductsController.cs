using Microsoft.AspNetCore.Mvc;
using ProductCatalogAPI.DTOs;
using ProductCatalogAPI.DTOs.ProductDtos;
using ProductCatalogAPI.Services;

namespace ProductCatalogAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAll();
        return Ok(ApiResponseDto<List<ProductResponseDto>>.SuccessResult(products, "Products retrieved successfully"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    { 
        var product = await _productService.GetById(id);

        if (product == null)
            return NotFound($"Product with id {id} not found");

        return Ok(ApiResponseDto<ProductResponseDto>.SuccessResult(product, "Product retrieved successfully"));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var created = await _productService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            ApiResponseDto<ProductResponseDto>.SuccessResult(created, "Product created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var updated = await _productService.Update(id, dto);
        if (updated == null)
            return NotFound(ApiResponseDto<ProductResponseDto>.ErrorResult($"Product with id {id} not found", "Not found"));
        return Ok(ApiResponseDto<ProductResponseDto>.SuccessResult(updated, "Product updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.Delete(id);
        if (!deleted)   
            return NotFound(ApiResponseDto<ProductResponseDto>.ErrorResult($"Product with id {id} not found", "Not found"));
        return Ok(ApiResponseDto<ProductResponseDto>.SuccessResult(null, "Product deleted successfully"));
    }
}