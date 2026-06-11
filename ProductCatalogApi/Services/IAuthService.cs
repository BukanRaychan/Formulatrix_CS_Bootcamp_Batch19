using ProductCatalogAPI.DTOs.AuthDtos;

namespace ProductCatalogAPI.Services;

public interface IAuthService
{
    Task<AuthResultDto?> RegisterAsync(RegisterDto dto);
    Task<AuthResultDto?> LoginAsync(LoginDto dto);
    Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto dto);
}