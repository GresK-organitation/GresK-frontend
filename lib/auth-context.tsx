"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "promoter"

interface AuthContextType {
  isLoggedIn: boolean
  role: UserRole
  accountId: string | null
  token: string | null
  login: (role?: UserRole, accountId?: string, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: "user",
  accountId: null,
  token: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<UserRole>("user")
  const [accountId, setAccountId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("gresk_auth") === "true")
    const storedRole = localStorage.getItem("gresk_role") as UserRole | null
    if (storedRole === "user" || storedRole === "promoter") setRole(storedRole)
    const storedAccountId = localStorage.getItem("gresk_account_id")
    if (storedAccountId) setAccountId(storedAccountId)
    const storedToken = localStorage.getItem("gresk_token")
    if (storedToken) setToken(storedToken)
  }, [])

  function login(nextRole: UserRole = "user", nextAccountId?: string, nextToken?: string) {
    localStorage.setItem("gresk_auth", "true")
    localStorage.setItem("gresk_role", nextRole)
    if (nextAccountId) {
      localStorage.setItem("gresk_account_id", nextAccountId)
      setAccountId(nextAccountId)
    }
    if (nextToken) {
      localStorage.setItem("gresk_token", nextToken)
      setToken(nextToken)
    }
    setIsLoggedIn(true)
    setRole(nextRole)
  }

  function logout() {
    localStorage.removeItem("gresk_auth")
    localStorage.removeItem("gresk_role")
    localStorage.removeItem("gresk_account_id")
    localStorage.removeItem("gresk_token")
    setIsLoggedIn(false)
    setRole("user")
    setAccountId(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, accountId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
