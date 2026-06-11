import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { register } from "@/services/authService"

export function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const response = await register({ firstName, lastName, email, password })

    setLoading(false)

    if (!response.success) {
      setError(response.message || "Unable to register")
      return
    }

    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Create a new account.</p>
          <h1 className="mt-2 text-3xl font-semibold">Register</h1>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel htmlFor="register-first-name">First name</FormLabel>
            <FormControl>
              <Input
                id="register-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Jane"
                required
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="register-last-name">Last name</FormLabel>
            <FormControl>
              <Input
                id="register-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Doe"
                required
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="register-email">Email</FormLabel>
            <FormControl>
              <Input
                id="register-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="name@example.com"
                required
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="register-password">Password</FormLabel>
            <FormControl>
              <Input
                id="register-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Choose a password"
                required
              />
            </FormControl>
          </FormItem>

          {error ? <FormMessage>{error}</FormMessage> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already registered? <Link className="text-primary underline" to="/login">Sign in</Link>.
        </p>
      </Card>
    </div>
  )
}
