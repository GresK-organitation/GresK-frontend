import { authedFetch, ApiException } from "./client"
import type { PromoterArtist } from "@/lib/mock-data"

// Respuesta → label display (para toPromoterArtist)
const ENUM_TO_GENRE: Record<string, string> = {
  ROCK: "Rock", POP: "Pop", INDIE: "Indie", ELECTRONIC: "Electrónica",
  TECHNO: "Techno", HOUSE: "House", JAZZ: "Jazz", HIP_HOP: "Hip-Hop",
  METAL: "Metal", FLAMENCO: "Flamenco", R_AND_B: "R&B", PUNK: "Punk",
  TRAP: "Trap", REGGAETON: "Reggaeton", LATIN_JAZZ: "Latin Jazz", CLASSICAL: "Clásica",
}

interface ArtistApiResponse {
  id: string
  promoterId: string
  name: string
  origin: string
  genres: string[]
  imageUrl: string | null
  bio: string | null
  status: string
  fee: string | null
  followers: string | null
  tags: string[]
  contact: string
  instagramUrl: string | null
  spotifyUrl: string | null
  eventsPlayed: number
  avgRating: number
  createdAt: string
}

function toPromoterArtist(r: ArtistApiResponse): PromoterArtist {
  return {
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl ?? "",
    genres: r.genres.map((g) => ENUM_TO_GENRE[g] ?? g),
    origin: r.origin,
    bio: r.bio ?? "",
    status: r.status.toLowerCase() as PromoterArtist["status"],
    fee: r.fee ?? "",
    eventsPlayed: r.eventsPlayed,
    avgRating: r.avgRating,
    followers: r.followers ?? "",
    contact: r.contact,
    socialSpotify: r.spotifyUrl ?? undefined,
    socialInstagram: r.instagramUrl ?? undefined,
    tags: r.tags,
    createdAt: r.createdAt,
  }
}

export interface ArtistDraftPayload {
  name: string
  origin: string
  genres: string[]       // enum values: "ROCK", "INDIE", …
  bio: string
  status: string
  fee: string
  contact: string
  socialSpotify: string
  socialInstagram: string
  followers: string
  imageFile: File | null
  tags: string[]
}

export async function createArtist(draft: ArtistDraftPayload): Promise<PromoterArtist> {
  const payload = {
    name: draft.name,
    origin: draft.origin,
    genres: draft.genres,          // ya son valores enum — no necesitan mapping
    bio: draft.bio,
    status: draft.status.toUpperCase(),
    fee: draft.fee || null,
    followers: draft.followers || null,
    tags: draft.tags,
    contact: draft.contact,
    instagramUrl: draft.socialInstagram || null,
    spotifyUrl: draft.socialSpotify || null,
  }

  const formData = new FormData()
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  )
  if (draft.imageFile) {
    formData.append("image", draft.imageFile)
  }

  const res = await authedFetch("/api/v1/artists", {
    method: "POST",
    body: formData,
    // Content-Type NO se establece — el browser añade el boundary correcto automáticamente
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new ApiException(res.status, err.error ?? "Error al crear el artista")
  }

  const data = await res.json() as ArtistApiResponse
  return toPromoterArtist(data)
}

export async function getMyArtists(): Promise<PromoterArtist[]> {
  const res = await authedFetch("/api/v1/artists/me")

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new ApiException(res.status, err.error ?? "Error al cargar artistas")
  }

  const data = await res.json() as ArtistApiResponse[]
  return data.map(toPromoterArtist)
}
