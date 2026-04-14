import { redirect } from "next/navigation"

/**
 * /dashboard/promoter
 * Punto de entrada para promotoras post-login.
 * Delega al panel de promotora existente.
 */
export default function DashboardPromoterPage() {
  redirect("/promoter")
}
