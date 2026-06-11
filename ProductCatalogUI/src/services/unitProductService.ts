import { apiFetch } from "./api"
import type {
  ApiResponse,
  CreateUnitProductDto,
  UnitProductResponseDto,
  UpdateUnitProductDto,
} from "@/types/api"

const unitProductBasePath = "/api/unitproducts"

export async function getAllUnitProducts(): Promise<ApiResponse<UnitProductResponseDto[]>> {
  return apiFetch<UnitProductResponseDto[]>(unitProductBasePath)
}

export async function getUnitProductById(id: number): Promise<ApiResponse<UnitProductResponseDto>> {
  return apiFetch<UnitProductResponseDto>(`${unitProductBasePath}/${id}`)
}

export async function getUnitProductsByProductId(
  productId: number,
): Promise<ApiResponse<UnitProductResponseDto[]>> {
  return apiFetch<UnitProductResponseDto[]>(`${unitProductBasePath}/by-product/${productId}`)
}

export async function createUnitProduct(
  dto: CreateUnitProductDto,
): Promise<ApiResponse<UnitProductResponseDto>> {
  return apiFetch<UnitProductResponseDto>(unitProductBasePath, {
    method: "POST",
    json: dto,
  })
}

export async function updateUnitProduct(
  id: number,
  dto: UpdateUnitProductDto,
): Promise<ApiResponse<UnitProductResponseDto>> {
  return apiFetch<UnitProductResponseDto>(`${unitProductBasePath}/${id}`, {
    method: "PUT",
    json: dto,
  })
}

export async function deleteUnitProduct(
  id: number,
): Promise<ApiResponse<UnitProductResponseDto>> {
  return apiFetch<UnitProductResponseDto>(`${unitProductBasePath}/${id}`, {
    method: "DELETE",
  })
}
