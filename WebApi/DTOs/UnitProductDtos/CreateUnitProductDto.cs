namespace ProductCatalogAPI.DTOs.UnitProductDtos;

public class CreateUnitProductDto
{
    public string? SerialNumber { get; set; }
    public int ProductId { get; set; }
    public string UserId { get; set; } = string.Empty;
}