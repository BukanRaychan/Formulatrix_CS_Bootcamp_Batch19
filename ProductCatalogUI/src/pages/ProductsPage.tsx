import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/services/productService"
import type { ProductResponseDto } from "@/types/api"

export function ProductsPage() {
  const [products, setProducts] = useState<ProductResponseDto[]>([])
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponseDto | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const mode = useMemo(
    () => (selectedProduct ? "Edit" : "Create"),
    [selectedProduct]
  )

  useEffect(() => {
    void loadProducts()
  }, [])

  async function loadProducts() {
    const response = await getAllProducts()
    if (response.success && response.data) {
      setProducts(response.data)
      return
    }
    setError(response.message)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const dto = { name, description, price }

    const response = selectedProduct
      ? await updateProduct(selectedProduct.id, dto)
      : await createProduct(dto)

    setLoading(false)

    if (!response.success || !response.data) {
      setError(response.message)
      return
    }

    await loadProducts()
    resetForm()
  }

  async function handleDelete(id: number) {
    const response = await deleteProduct(id)
    if (!response.success) {
      setError(response.message)
      return
    }
    await loadProducts()
  }

  function resetForm() {
    setSelectedProduct(null)
    setName("")
    setDescription("")
    setPrice(0)
  }

  function startEdit(product: ProductResponseDto) {
    setSelectedProduct(product)
    setName(product.name)
    setDescription(product.description)
    setPrice(Number(product.price))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground">
              List, edit, and delete products.
            </p>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>Price: ${product.price.toFixed(2)}</span>
                    <span>Stock: {product.stock ?? "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{mode} Product</h2>
            <p className="text-sm text-muted-foreground">
              Use the form to create or update a product.
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormItem>
              <FormLabel htmlFor="product-name">Name</FormLabel>
              <FormControl>
                <Input
                  id="product-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="product-description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="product-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="product-price">Price</FormLabel>
              <FormControl>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  required
                />
              </FormControl>
            </FormItem>
            {error ? <FormMessage>{error}</FormMessage> : null}
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                className="min-w-[120px]"
                disabled={loading}
              >
                {loading ? `${mode}ing...` : mode}
              </Button>
              {selectedProduct ? (
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
