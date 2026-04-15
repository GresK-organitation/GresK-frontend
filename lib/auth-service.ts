import { decodeJwtPayload } from "@/lib/api/client"
import type { UserRole } from "@/lib/auth-context"

// ── Rutas por rol ────────────────────────────────────────────────────────────

const ROLE_ROUTES: Record<UserRole, string> = {
  promoter: "/dashboard/promoter",
  user:     "/dashboard/user",
  admin:    "/admin/dashboard",
}

// ── Servicio ─────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Extrae el rol del payload JWT.
   * `roles` en el token llega como ["ROLE_PROMOTER"], ["ROLE_USER"] o ["ROLE_ADMIN"].
   */
  getRoleFromToken(token: string): UserRole {
    const payload = decodeJwtPayload(token)
    const roles = (payload?.roles as string[]) ?? []
    if (roles.includes("ROLE_ADMIN"))    return "admin"
    if (roles.includes("ROLE_PROMOTER")) return "promoter"
    return "user"
  },

  /**
   * Extrae el accountId (claim `sub`) del payload JWT.
   */
  getAccountIdFromToken(token: string): string {
    const payload = decodeJwtPayload(token)
    return (payload?.sub as string) ?? ""
  },

  /**
   * Devuelve la ruta de redirección post-login según el rol.
   *  - ADMIN    → /admin/dashboard
   *  - PROMOTER → /dashboard/promoter
   *  - USER     → /dashboard/user
   */
  getRedirectPath(role: UserRole): string {
    return ROLE_ROUTES[role]
  },

  /**
   * Lee el token guardado en localStorage y devuelve el rol.
   * Devuelve null si no hay sesión activa.
   */
  getStoredRole(): UserRole | null {
    if (typeof window === "undefined") return null
    const token = localStorage.getItem("gresk_token")
    if (!token) return null
    return this.getRoleFromToken(token)
  },

  /**
   * Comprueba si hay una sesión activa (token en localStorage).
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("gresk_token")
  },
}
