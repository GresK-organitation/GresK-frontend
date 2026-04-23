import { authedFetch, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface DashboardEvent {
  id:       string
  title:    string
  location: string   // nombre de la sala
  date:     string   // "2026-05-29" (ISO local date)
  time:     string   // "22:00"
  imageUrl: string
  category: string   // género (ej. "INDIE")
  price:    string   // "195.00"
}

export interface DashboardMusic {
  trackName:  string   // campo real del backend
  artistName: string   // campo real del backend
  spotifyUrl: string
  imageUrl:   string
  genre:      string
}

export interface UserDashboardResponse {
  userId:      string
  name:        string
  tier:        string          // "FREE" | "PREMIUM"
  points:      number
  avatarUrl:   string | null
  musicGenres: string[]
  events:      DashboardEvent[]
  music:       DashboardMusic[]
}

export interface UpdateUserProfilePayload {
  name:        string
  description: string
  city:        string
  musicGenres: string[]
}

// ── Llamadas ─────────────────────────────────────────────────────────────────

export async function getUserDashboard(): Promise<UserDashboardResponse> {
  const res = await authedFetch("/api/v1/users/me/dashboard")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar el dashboard")
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
