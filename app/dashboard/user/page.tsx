import { redirect } from "next/navigation"

/**
 * /dashboard/user
 * Punto de entrada para usuarios post-login.
 * Delega al feed de usuario existente.
 */
export default function DashboardUserPage() {
  redirect("/feed")
}
