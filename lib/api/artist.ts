import { authedFetch, ApiException } from "./client"
import type { PromoterArtist } from "@/lib/mock-data"

// Mapping: display name (frontend) → backend MusicGenre enum name
const GENRE_TO_ENUM: Record<string, string> = {
  "Rock": "ROCK",
  "Pop": "POP",
  "Indie": "INDIE",
  "Electrónica": "ELECTRONIC",
  "Techno": "TECHNO",
  "House": "HOUSE",
  "Jazz": "JAZZ",
  "Hip-Hop": "HIP_HOP",
  "Metal": "METAL",
  "Flamenco": "FLAMENCO",
  "R&B": "R_AND_B",
  "Punk": "PUNK",
  "Trap": "TRAP",
  "Reggaeton": "REGGAETON",
  "Latin Jazz": "LATIN_JAZZ",
  "Clásica": "CLASSICAL",
}

const ENUM_TO_GENRE: Record<string, string> = Object.fromEntries(
  Object.entries(GENRE_TO_ENUM).map(([k, v]) => [v, k])
)

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
  genres: string[]
  bio: string
  status: string
  fee: string
  contact: string
  socialSpotify: string
  socialInstagram: string
  followers: string
  imageUrl: string | null
  tags: string[]
}

export async function createArtist(draft: ArtistDraftPayload): Promise<PromoterArtist> {
  const body = {
    name: draft.name,
    origin: draft.origin,
    genres: draft.genres.map((g) => GENRE_TO_ENUM[g]).filter(Boolean),
    // Send empty string for base64 data URLs — backend ImageUrl VO accepts ""
    imageUrl: draft.imageUrl && !draft.imageUrl.startsWith("data:") ? draft.imageUrl : "",
    bio: draft.bio,
    status: draft.status.toUpperCase(),
    fee: draft.fee || null,
    followers: draft.followers || null,
    tags: draft.tags,
    contact: draft.contact,
    instagramUrl: draft.socialInstagram || null,
    spotifyUrl: draft.socialSpotify || null,
  }

  const res = await authedFetch("/api/v1/artists", {
    method: "POST",
    body: JSON.stringify(body),
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
