import * as React from "react"
import type { AuthResponseDto } from "@/types/api"

const STORAGE_KEY = "product-catalog-auth"

type AuthContextType = {
  isAuthenticated: boolean
  user: AuthResponseDto | null
  signIn: (user: AuthResponseDto) => void
  signOut: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

function readStoredUser(): AuthResponseDto | null {
  if (typeof window === "undefined") {
    return null
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthResponseDto
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthResponseDto | null>(() => readStoredUser())

  const signIn = React.useCallback((nextUser: AuthResponseDto) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const signOut = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      signIn,
      signOut,
    }),
    [signIn, signOut, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
