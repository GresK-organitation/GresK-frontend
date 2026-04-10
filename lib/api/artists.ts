import { authenticatedFetch, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface ArtistPayload {
  name: string
  origin: string
  genres: string[]
  imageUrl: string | null
  bio: string
  status: string        // lowercase del formulario ("available") → se convierte a uppercase antes de enviar
  fee: string
  followers: string
  contact: string
  socialSpotify: string
  socialInstagram: string
  tags: string[]
}

export interface ArtistDTO {
  id: string            // UUID
  promoterId: string
  name: string
  origin: string | null
  genres: string[]
  imageUrl: string | null
  bio: string
  status: string        // uppercase: "AVAILABLE" | "NEGOTIATING" | "CONFIRMED" | "INACTIVE"
  fee: string | null
  followers: string | null
  contact: string
  socialSpotify: string | null
  socialInstagram: string | null
  tags: string[]
  eventsPlayed: number
  createdAt: string
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchMyArtists(): Promise<ArtistDTO[]> {
  const res = await authenticatedFetch("/api/v1/artists/my")
  if (!res.ok) {
    throw new ApiException(res.status, "Error al obtener los artistas")
  }
  return res.json()
}

export async function createArtist(payload: ArtistPayload): Promise<ArtistDTO> {
  const body = { ...payload, status: payload.status.toUpperCase() }
  const res = await authenticatedFetch("/api/v1/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error desconocido" }))
    throw new ApiException(res.status, err.message ?? "Error al crear el artista")
  }
  return res.json()
}

export async function deleteArtist(id: string): Promise<void> {
  const res = await authenticatedFetch(`/api/v1/artists/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    throw new ApiException(res.status, "Error al eliminar el artista")
  }
}
