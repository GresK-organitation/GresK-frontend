import { authedFetch, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface ReviewResponse {
  reviewId:       string
  eventId:        string
  ticketId:       string
  artistRating:   number
  soundRating:    number
  ambienceRating: number
  venueRating:    number
  setlistRating:  number
  overallRating:  number
  comment:        string | null
  photoUrl:       string | null
  pointsAwarded:  number
  status:         string
  createdAt:      string
}

export interface AttendedEventResponse {
  ticketId:          string
  eventId:           string
  title:             string
  venue:             string | null
  coverImageUrl:     string | null
  genre:             string | null
  date:              string | null   // "2026-04-05" ISO local date
  pending:           boolean
  reviewId:          string | null
  overallRating:     number          // 0 when pending
  artistRating:      number
  soundRating:       number
  ambienceRating:    number
  venueRating:       number
  setlistRating:     number
  comment:           string | null
  photoUrl:          string | null
  pointsAwarded:     number
  communityAvgRating: number
}

export interface EventRatingStatsResponse {
  reviewCount:       number
  avgOverallRating:  number
  avgArtistRating:   number
  avgSoundRating:    number
  avgAmbienceRating: number
  avgVenueRating:    number
  avgSetlistRating:  number
}

export interface SubmitReviewPayload {
  ticketId:       string
  eventId:        string
  artistRating:   number
  soundRating:    number
  ambienceRating: number
  venueRating:    number
  setlistRating:  number
  comment?:       string
  photoUrl?:      string
}

export interface UpdateReviewPayload {
  artistRating:   number
  soundRating:    number
  ambienceRating: number
  venueRating:    number
  setlistRating:  number
  comment?:       string
  photoUrl?:      string
}

// ── Llamadas ─────────────────────────────────────────────────────────────────

export async function submitReview(payload: SubmitReviewPayload): Promise<ReviewResponse> {
  const res = await authedFetch("/api/v1/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al enviar la valoración")
  }
  return res.json()
}

export async function updateReview(
  id: string,
  payload: UpdateReviewPayload
): Promise<ReviewResponse> {
  const res = await authedFetch(`/api/v1/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al actualizar la valoración")
  }
  return res.json()
}

export async function getUserReviews(): Promise<ReviewResponse[]> {
  const res = await authedFetch("/api/v1/reviews/users/me")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar valoraciones")
  }
  return res.json()
}

export async function getEventReviews(eventId: string): Promise<ReviewResponse[]> {
  const res = await authedFetch(`/api/v1/reviews/events/${eventId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar valoraciones del evento")
  }
  return res.json()
}

export async function getEventStats(eventId: string): Promise<EventRatingStatsResponse> {
  const res = await authedFetch(`/api/v1/reviews/events/${eventId}/stats`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar estadísticas del evento")
  }
  return res.json()
}

export async function getUserAttendedEvents(): Promise<AttendedEventResponse[]> {
  const res = await authedFetch("/api/v1/users/me/events")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar historial de eventos")
  }
  return res.json()
}
