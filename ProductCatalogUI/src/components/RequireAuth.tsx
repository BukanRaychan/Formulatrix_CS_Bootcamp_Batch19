import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
