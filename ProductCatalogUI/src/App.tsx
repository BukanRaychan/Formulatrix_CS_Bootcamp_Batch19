import { Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "@/components/RequireAuth"
import { Shell } from "@/components/Shell"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ProductsPage } from "@/pages/ProductsPage"
import { UnitProductsPage } from "@/pages/UnitProductsPage"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="unit-products" element={<UnitProductsPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Route>
    </Routes>
  )
}

export default App
