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
    public IActionResult GetAll()
    {
        return Ok(_productService.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var product = _productService.GetById(id);

        if (product == null)
            return NotFound($"Product with id {id} not found");

        return Ok(product);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateProductDto dto)
    {
        var created = _productService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UpdateProductDto dto)
    {
        var updated = _productService.Update(id, dto);

        if (updated == null)
            return NotFound($"Product with id {id} not found");

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _productService.Delete(id);

        if (!deleted)
            return NotFound($"Product with id {id} not found");

        return NoContent();
    }
}