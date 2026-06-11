import { apiFetch } from "./api"
import type {
  ApiResponse,
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from "@/types/api"

const productBasePath = "/api/products"

export async function getAllProducts(): Promise<ApiResponse<ProductResponseDto[]>> {
  return apiFetch<ProductResponseDto[]>(productBasePath)
}

export async function getProductById(id: number): Promise<ApiResponse<ProductResponseDto>> {
  return apiFetch<ProductResponseDto>(`${productBasePath}/${id}`)
}

export async function createProduct(
  dto: CreateProductDto,
): Promise<ApiResponse<ProductResponseDto>> {
  return apiFetch<ProductResponseDto>(productBasePath, {
    method: "POST",
    json: dto,
  })
}

export async function updateProduct(
  id: number,
  dto: UpdateProductDto,
): Promise<ApiResponse<ProductResponseDto>> {
  return apiFetch<ProductResponseDto>(`${productBasePath}/${id}`, {
    method: "PUT",
    json: dto,
  })
}

export async function deleteProduct(id: number): Promise<ApiResponse<ProductResponseDto>> {
  return apiFetch<ProductResponseDto>(`${productBasePath}/${id}`, {
    method: "DELETE",
  })
}
