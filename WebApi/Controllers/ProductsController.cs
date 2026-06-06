using Microsoft.AspNetCore.Mvc;
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
        return Ok(await _productService.GetAll());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetById(id);

        if (product == null)
            return NotFound($"Product with id {id} not found");

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var created = await _productService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var updated = await _productService.Update(id, dto);

        if (updated == null)
            return NotFound($"Product with id {id} not found");

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.Delete(id);

        if (!deleted)
            return NotFound($"Product with id {id} not found");

        return NoContent();
    }
}