import { apiFetch } from "./api"
import type { ApiResponse, AuthResponseDto, LoginDto, RegisterDto, UpdateProfileDto } from "@/types/api"

const authBasePath = "/api/auth"

export async function login(dto: LoginDto): Promise<ApiResponse<AuthResponseDto>> {
  return apiFetch<AuthResponseDto>(`${authBasePath}/login`, {
    method: "POST",
    json: dto,
  })
}

export async function register(dto: RegisterDto): Promise<ApiResponse<AuthResponseDto>> {
  return apiFetch<AuthResponseDto>(`${authBasePath}/register`, {
    method: "POST",
    json: dto,
  })
}

export async function updateProfile(dto: UpdateProfileDto): Promise<ApiResponse<AuthResponseDto>> {
  return apiFetch<AuthResponseDto>(`${authBasePath}/update-profile`, {
    method: "POST",
    json: dto,
  })
}
