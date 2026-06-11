import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { label: "Products", to: "/products" },
  { label: "Unit Products", to: "/unit-products" },
]

export function Shell() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Product Catalog Web</p>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    : "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                auth.signOut()
                navigate("/login")
              }}
            >
              Sign out
            </Button>
          </div>
        </header>

        <Card className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Welcome back, {auth.user?.firstName ?? "User"}</h2>
              <p className="text-sm text-muted-foreground">
                Browse registered APIs and manage products or unit products from the frontend.
              </p>
            </div>
          </div>

          <Outlet />
        </Card>
      </div>
    </div>
  )
}
