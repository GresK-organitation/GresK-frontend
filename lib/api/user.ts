import { authedFetch, ApiException } from "./client"

// ── Tipos de respuesta del backend ────────────────────────────────────────────

export interface UserDashboardEventItem {
  id: string
  title: string
  location: string
  date: string       // "2026-05-29"
  time: string       // "22:00"
  imageUrl: string
  category: string
}

export interface UserDashboardMusicItem {
  trackName: string
  artistName: string
  spotifyUrl: string
  imageUrl: string
  genre: string
}

export interface UserDashboard {
  userId: string
  name: string
  tier: string       // "FREE" | "PREMIUM"
  points: number
  musicGenres: string[]
  events: UserDashboardEventItem[]
  music: UserDashboardMusicItem[]
}

export interface UpdateUserProfilePayload {
  name: string
  description: string
  city: string
  musicGenres: string[]
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function getUserDashboard(): Promise<UserDashboard> {
  const res = await authedFetch("/api/v1/users/me/dashboard")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al obtener el dashboard")
  }
  return res.json()
}

export async function updateUserProfile(payload: UpdateUserProfilePayload): Promise<void> {
  const res = await authedFetch("/api/v1/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al actualizar el perfil")
  }
}

export async function updateUserAvatar(file: File): Promise<void> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await authedFetch("/api/v1/users/me/avatar", {
    method: "PATCH",
    body: formData,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al actualizar el avatar")
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Puntos necesarios para el siguiente nivel.
 * El backend no devuelve este dato, se calcula en frontend.
 */
export function getNextTierPoints(tier: string): number {
  return tier === "PREMIUM" ? 2000 : 1000
}
