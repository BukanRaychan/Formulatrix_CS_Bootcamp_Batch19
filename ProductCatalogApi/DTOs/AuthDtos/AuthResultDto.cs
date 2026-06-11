using System.Security.Claims;

namespace ProductCatalogAPI.DTOs.AuthDtos;

public class AuthResultDto
{
    public ClaimsPrincipal Principal { get; set; } = null!;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}