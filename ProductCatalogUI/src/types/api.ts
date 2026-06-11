export type ApiResponse<T> = {
  data: T | null
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type UpdateProfileDto = {
  firstName: string
  lastName: string
  currentPassword?: string
  newPassword?: string
}

export type AuthResponseDto = {
  token: string
  email: string
  firstName: string
  lastName: string
  expiresAt: string
}

export type ProductResponseDto = {
  id: number
  name: string
  description: string
  price: number
  stock?: number | null
  createdAt: string
}

export type CreateProductDto = {
  name: string
  description: string
  price: number
}

export type UpdateProductDto = {
  name?: string
  description?: string
  price?: number | null
}

export type UnitProductResponseDto = {
  id: number
  serialNumber?: string | null
  createdAt: string
  product?: ProductResponseDto | null
  user?: UserInfoResponseDto | null
}

export type CreateUnitProductDto = {
  serialNumber?: string
  productId: number
  userId: string
}

export type UpdateUnitProductDto = {
  serialNumber?: string
  productId?: number
  userId?: string
}

export type UserInfoResponseDto = {
  id: string
  email: string
  firstName: string
  lastName: string
}
