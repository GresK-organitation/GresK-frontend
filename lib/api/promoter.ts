import { authedFetch, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface PromoterDashboard {
  name:           string
  logoUrl:        string | null
  description:    string | null
  street:         string | null
  city:           string | null
  country:        string | null
  musicalGenres:  string[]
  // Stats
  totalRevenue:   number
  totalEvents:    number
  averageRating:  number
  totalAttendees: number
  sellThrough:    number
  activeEvents:   number
  pendingEvents:  number
  avgTicketPrice: number
}

export interface PromoterEvent {
  id:             string
  title:          string
  eventDate:      string   // ISO-8601
  venue:          string | null
  city:           string | null
  status:         string   // "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "LAST_MINUTE"
  totalCapacity:  number
  ticketsSold:    number
  revenue:        number
  price:          number
  genre:          string
  coverImageUrl:  string | null
  conversionRate: number | null
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function getPromoterDashboard(): Promise<PromoterDashboard> {
  const res = await authedFetch("/api/v1/promoters/me/dashboard")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar el dashboard")
  }
  return res.json()
}

export async function getPromoterEvents(): Promise<PromoterEvent[]> {
  const res = await authedFetch("/api/v1/promoters/me/events")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar los eventos")
  }
  return res.json()
}
