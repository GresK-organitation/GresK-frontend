import { redirect } from "next/navigation"

/**
 * /dashboard/admin
 * Punto de entrada para admins post-login.
 */
export default function DashboardAdminPage() {
  redirect("/admin/dashboard")
}
