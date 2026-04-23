import { authedFetch, ApiException } from "./client"

// ── Paginación ────────────────────────────────────────────────────────────────

interface PageResponse<T> {
  content: T[]
  total: number
  page: number
  size: number
}

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
  venue?: string         // nombre de la sala
  latitude: number
  longitude: number
  artistId?: string      // UUID del Artist del promotor (opcional)
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
  artistId: string | null
  artistName: string | null
  artistImageUrl: string | null
}

// ── Crear evento (DRAFT) ─────────────────────────────────────────────────────

export async function createEvent(payload: CreateEventPayload, coverImage?: File): Promise<EventResponse> {
  const formData = new FormData()
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  )
  if (coverImage) {
    formData.append("coverImage", coverImage)
  }

  const res = await authedFetch("/api/v1/events", {
    method: "POST",
    body: formData,
    // No establecer Content-Type manualmente — el browser lo pone con el boundary
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

export async function getEvents(params?: {
  genre?: string
  city?: string
  dateFrom?: string
  dateTo?: string
  minPrice?: number
  maxPrice?: number
  artistName?: string
  page?: number
  size?: number
}): Promise<EventResponse[]> {
  const qs = new URLSearchParams()
  if (params?.genre) qs.set("genre", params.genre)
  if (params?.city) qs.set("city", params.city)
  if (params?.dateFrom) qs.set("dateFrom", params.dateFrom)
  if (params?.dateTo) qs.set("dateTo", params.dateTo)
  if (params?.minPrice != null) qs.set("minPrice", String(params.minPrice))
  if (params?.maxPrice != null) qs.set("maxPrice", String(params.maxPrice))
  if (params?.artistName) qs.set("artistName", params.artistName)
  qs.set("page", String(params?.page ?? 0))
  qs.set("size", String(params?.size ?? 50))

  const res = await authedFetch(`/api/v1/events?${qs.toString()}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar eventos")
  }
  const page: PageResponse<EventResponse> = await res.json()
  return page.content
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
    if (res.status === 409) {
      throw new ApiException(409, "Ya has adquirido una entrada para este evento")
    }
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al comprar el ticket")
  }
  return res.json()
}
