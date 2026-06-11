import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  createUnitProduct,
  deleteUnitProduct,
  getAllUnitProducts,
  getUnitProductsByProductId,
  updateUnitProduct,
} from "@/services/unitProductService"
import type { ProductResponseDto, UnitProductResponseDto } from "@/types/api"
import { getAllProducts } from "@/services/productService"

export function UnitProductsPage() {
  const [unitProducts, setUnitProducts] = useState<UnitProductResponseDto[]>([])
  const [products, setProducts] = useState<ProductResponseDto[]>([])
  const [selectedUnitProduct, setSelectedUnitProduct] = useState<UnitProductResponseDto | null>(null)
  const [serialNumber, setSerialNumber] = useState("")
  const [productId, setProductId] = useState<number>(0)
  const [userId, setUserId] = useState("")
  const [filterProductId, setFilterProductId] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const mode = useMemo(() => (selectedUnitProduct ? "Edit" : "Create"), [selectedUnitProduct])

  useEffect(() => {
    void loadAllData()
  }, [])

  async function loadAllData() {
    const [productsResponse, unitProductsResponse] = await Promise.all([
      getAllProducts(),
      getAllUnitProducts(),
    ])

    if (productsResponse.success && productsResponse.data) {
      setProducts(productsResponse.data)
    }

    if (unitProductsResponse.success && unitProductsResponse.data) {
      setUnitProducts(unitProductsResponse.data)
    }
  }

  async function loadFilteredUnits(productIdValue: number) {
    const response = await getUnitProductsByProductId(productIdValue)
    if (response.success && response.data) {
      setUnitProducts(response.data)
      return
    }
    setError(response.message)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const dto = {
      serialNumber: serialNumber || undefined,
      productId,
      userId,
    }

    const response = selectedUnitProduct
      ? await updateUnitProduct(selectedUnitProduct.id, dto)
      : await createUnitProduct(dto)

    setLoading(false)

    if (!response.success || !response.data) {
      setError(response.message)
      return
    }

    await loadAllData()
    resetForm()
  }

  async function handleDelete(id: number) {
    const response = await deleteUnitProduct(id)
    if (!response.success) {
      setError(response.message)
      return
    }
    await loadAllData()
  }

  function resetForm() {
    setSelectedUnitProduct(null)
    setSerialNumber("")
    setProductId(products[0]?.id ?? 0)
    setUserId("")
  }

  function startEdit(item: UnitProductResponseDto) {
    setSelectedUnitProduct(item)
    setSerialNumber(item.serialNumber ?? "")
    setProductId(item.product?.id ?? 0)
    setUserId(item.user?.id ?? "")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Unit Products</h2>
            <p className="text-sm text-muted-foreground">View and manage unit products.</p>
          </div>

          <div className="space-y-3">
            <FormItem className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FormLabel htmlFor="filter-product-id">Filter by product</FormLabel>
            <FormControl>
              <Select
                id="filter-product-id"
                value={filterProductId}
                onChange={(event) => {
                  const val = event.target.value
                  const id = val ? Number(val) : ""
                  setFilterProductId(id)
                  if (id !== "") {
                    void loadFilteredUnits(id)
                  } else {
                    void loadAllData()
                  }
                }}
              >
                <option value="">All products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </FormItem>
            {unitProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No unit products available.</p>
            ) : (
              <div className="space-y-3">
                {unitProducts.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.serialNumber ?? "Untitled"}</h3>
                        <p className="text-sm text-muted-foreground">
                          Product: {item.product?.name ?? "Unknown"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => void handleDelete(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>User: {item.user?.firstName ?? "Unknown"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{mode} Unit Product</h2>
            <p className="text-sm text-muted-foreground">Create or update unit product records.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormItem>
              <FormLabel htmlFor="serial-number">Serial number</FormLabel>
              <FormControl>
                <Input
                  id="serial-number"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="unit-product-product">Product</FormLabel>
              <FormControl>
                <Select
                  id="unit-product-product"
                  value={productId}
                  onChange={(event) => setProductId(Number(event.target.value))}
                  required
                >
                  <option value={0} disabled>
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="user-id">User ID</FormLabel>
              <FormControl>
                <Input
                  id="user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                />
              </FormControl>
            </FormItem>

            {error ? <FormMessage>{error}</FormMessage> : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="min-w-[120px]" disabled={loading}>
                {loading ? `${mode}ing...` : mode}
              </Button>
              {selectedUnitProduct ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}
