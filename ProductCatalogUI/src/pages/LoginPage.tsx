import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/products"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const response = await login({ email, password })

    setLoading(false)

    if (!response.success || !response.data) {
      setError(response.message || "Unable to sign in")
      return
    }

    auth.signIn(response.data)
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel htmlFor="login-email">Email</FormLabel>
            <FormControl>
              <Input
                id="login-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="name@example.com"
                required
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="login-password">Password</FormLabel>
            <FormControl>
              <Input
                id="login-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="your password"
                required
              />
            </FormControl>
          </FormItem>

          {error ? <FormMessage>{error}</FormMessage> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          New to the app? <Link className="text-primary underline" to="/register">Create an account</Link>.
        </p>
      </Card>
    </div>
  )
}
