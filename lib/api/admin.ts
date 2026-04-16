import { authedFetch, ApiException } from "@/lib/api/client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface AdminPromoter {
  id:        string
  email:     string
  name:      string
  city:      string
  country:   string
  street:    string
  phone:     string
  website:   string
  status:    string   // "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED"
  createdAt: string
}

export interface AdminUser {
  id:        string
  email:     string
  name:      string
  city:      string
  status:    string   // "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED"
  tier:      string
  createdAt: string
}

// ── Promoters ────────────────────────────────────────────────────────────────

export async function listPromoters(
  status?: string,
  city?: string
): Promise<AdminPromoter[]> {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (city)   params.set("city",   city)
  const query = params.toString() ? `?${params}` : ""

  const res = await authedFetch(`/api/v1/admin/promoters${query}`)
  if (!res.ok) throw new ApiException(res.status, await res.text())
  return res.json()
}

export async function approvePromoter(id: string): Promise<void> {
  const res = await authedFetch(`/api/v1/admin/account/${id}/approve`, {
    method: "PATCH",
  })
  if (!res.ok) throw new ApiException(res.status, await res.text())
}

// ── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(
  status?: string,
  city?: string
): Promise<AdminUser[]> {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (city)   params.set("city",   city)
  const query = params.toString() ? `?${params}` : ""

  const res = await authedFetch(`/api/v1/admin/users${query}`)
  if (!res.ok) throw new ApiException(res.status, await res.text())
  return res.json()
}

export async function suspendUser(id: string): Promise<void> {
  const res = await authedFetch(`/api/v1/admin/account/${id}/suspend`, {
    method: "PATCH",
  })
  if (!res.ok) throw new ApiException(res.status, await res.text())
}

export async function activateUser(id: string): Promise<void> {
  const res = await authedFetch(`/api/v1/admin/promoter/${id}/active`, {
    method: "PATCH",
  })
  if (!res.ok) throw new ApiException(res.status, await res.text())
}
