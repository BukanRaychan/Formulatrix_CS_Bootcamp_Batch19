using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductCatalogAPI.DTOs;
using ProductCatalogAPI.DTOs.AuthDtos;
using ProductCatalogAPI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace ProductCatalogAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;

    public AuthController(IAuthService authService, IMapper mapper)
    {
        _authService = authService;
        _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        if (result == null)
            return BadRequest(ApiResponseDto<UserInfoResponseDto>.ErrorResult(
                "Email already exists or registration failed",
                "Registration failed"));

        await SignInWithCookie(result.Principal);

        return Ok(ApiResponseDto<UserInfoResponseDto>.SuccessResult(_mapper.Map<UserInfoResponseDto>(result), "Registration successful"));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result == null)
            return Unauthorized(ApiResponseDto<UserInfoResponseDto>.ErrorResult(
                "Invalid email or password",
                "Login failed"));

        await SignInWithCookie(result.Principal);

        return Ok(ApiResponseDto<UserInfoResponseDto>.SuccessResult(_mapper.Map<UserInfoResponseDto>(result), "Login successful"));
    }

    [Authorize]
    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponseDto<UserInfoResponseDto>.ErrorResult(
                "Invalid Token",
                "Unauthorized"));

        var result = await _authService.UpdateProfileAsync(userId, dto);

        if (!result)
            return BadRequest(ApiResponseDto<UserInfoResponseDto>.ErrorResult(
                "Update failed — check your current password",
                "Update failed"));

        return Ok(ApiResponseDto<UserInfoResponseDto>.SuccessResult(null!, "Profile updated successfully"));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(ApiResponseDto<UserInfoResponseDto>.SuccessResult(null!, "Logged out"));
    }

    private async Task SignInWithCookie(ClaimsPrincipal principal)
    {
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            }
        );
    }
}