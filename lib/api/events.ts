import { authedFetch, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface CreateEventPayload {
  title: string
  genre: string          // enum MusicGenre: "ROCK", "INDIE", …
  price: number
  currency: string       // "EUR"
  totalCapacity: number
  eventDate: string      // ISO-8601 con timezone: "2026-05-29T22:00:00Z"
  revealAt?: string
  street: string
  city: string
  country: string
  place?: string         // nombre de la sala
  latitude: number
  longitude: number
  coverImageUrl?: string
  artistName?: string
  artistImageUrl?: string
  description?: string
}

export interface EventResponse {
  id: string
  title: string
  promoterId: string
  status: string
  genre: string
  description: string | null
  amount: number
  discountedAmount: number | null
  currency: string
  totalCapacity: number
  availableCapacity: number
  eventDate: string
  revealAt: string | null
  createdAt: string
  street: string | null
  city: string | null
  country: string | null
  place: string | null
  latitude: number | null
  longitude: number | null
  coverImageUrl: string | null
  artistName: string | null
  artistImageUrl: string | null
}

// ── Crear evento (DRAFT) ─────────────────────────────────────────────────────

export async function createEvent(payload: CreateEventPayload): Promise<EventResponse> {
  const res = await authedFetch("/api/v1/events", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al crear el evento")
  }
  return res.json()
}

// ── Publicar evento ──────────────────────────────────────────────────────────

export async function publishEvent(id: string): Promise<EventResponse> {
  const res = await authedFetch(`/api/v1/events/${id}/publish`, { method: "PUT" })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al publicar el evento")
  }
  return res.json()
}

// ── Obtener evento por ID ─────────────────────────────────────────────────────

export async function getEvent(id: string): Promise<EventResponse> {
  const res = await authedFetch(`/api/v1/events/${id}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Evento no encontrado")
  }
  return res.json()
}

// ── Eventos de última hora ───────────────────────────────────────────────────

export async function getLastMinuteEvents(): Promise<EventResponse[]> {
  const res = await authedFetch("/api/v1/events/last-minute")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar eventos de última hora")
  }
  return res.json()
}

// ── Listar todos los eventos ─────────────────────────────────────────────────

export async function getEvents(): Promise<EventResponse[]> {
  const res = await authedFetch("/api/v1/events")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar eventos")
  }
  return res.json()
}

// ── Ticket purchase ───────────────────────────────────────────────────────────

export interface TicketPurchaseResponse {
  id: string
  eventId: string
  status: string       // "PURCHASED"
  qrCode: string
  purchasedAt: string  // ISO-8601
}

export async function purchaseTicket(eventId: string): Promise<TicketPurchaseResponse> {
  const res = await authedFetch("/api/v1/tickets", {
    method: "POST",
    body: JSON.stringify({ eventId }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al comprar el ticket")
  }
  return res.json()
}
