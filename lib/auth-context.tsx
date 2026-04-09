"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "promoter"

interface AuthContextType {
  isLoggedIn: boolean
  role: UserRole
  login: (role?: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: "user",
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<UserRole>("user")

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("gresk_auth") === "true")
    const storedRole = localStorage.getItem("gresk_role") as UserRole | null
    if (storedRole === "user" || storedRole === "promoter") setRole(storedRole)
  }, [])

  function login(nextRole: UserRole = "user") {
    localStorage.setItem("gresk_auth", "true")
    localStorage.setItem("gresk_role", nextRole)
    setIsLoggedIn(true)
    setRole(nextRole)
  }

  function logout() {
    localStorage.removeItem("gresk_auth")
    localStorage.removeItem("gresk_role")
    setIsLoggedIn(false)
    setRole("user")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
