import { authedFetch, ApiException } from "./client"
import { type PromoterEvent, type PromoterEventStatus } from "@/lib/mock-data"

// ── Tipos de respuesta del backend ────────────────────────────────────────────

export interface PromoterDashboardData {
  name: string
  logoUrl: string
  description: string
  street: string
  city: string
  country: string
  musicalGenres: string[]
  // Stats
  totalRevenue: number
  totalEvents: number
  averageRating: number
  totalAttendees: number
  sellThrough: number
  activeEvents: number
  pendingEvents: number
  avgTicketPrice: number
}

export interface PromoterEventData {
  id: string
  title: string
  eventDate: string | null     // ISO-8601, ej: "2026-04-12T22:00:00Z"
  venue: string | null
  city: string | null
  status: string               // DRAFT | PUBLISHED | FINISHED | CANCELLED
  totalCapacity: number
  ticketsSold: number
  revenue: number
  price: number
  genre: string | null
  coverImageUrl: string | null
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function getPromoterDashboard(): Promise<PromoterDashboardData> {
  const res = await authedFetch("/api/v1/promoters/me/dashboard")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al obtener el dashboard")
  }
  return res.json()
}

export async function getPromoterEvents(): Promise<PromoterEventData[]> {
  const res = await authedFetch("/api/v1/promoters/me/events")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al obtener los eventos")
  }
  return res.json()
}

// ── Helpers de mapeo ──────────────────────────────────────────────────────────

const ES_MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

/**
 * Formatea una fecha ISO-8601 a "12 ABR 2026".
 */
function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getUTCDate()).padStart(2, "0")} ${ES_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/**
 * Extrae la parte de fecha de una fecha ISO-8601: "2026-04-12".
 */
function toDateIso(iso: string | null): string {
  if (!iso) return ""
  return iso.substring(0, 10)
}

/**
 * Mapea el status del backend (DRAFT/PUBLISHED/FINISHED/CANCELLED)
 * al tipo PromoterEventStatus del frontend.
 */
function mapStatus(backendStatus: string, eventDate: string | null): PromoterEventStatus {
  switch (backendStatus) {
    case "DRAFT":     return "draft"
    case "FINISHED":  return "completed"
    case "CANCELLED": return "cancelled"
    case "PUBLISHED": {
      if (eventDate) {
        const now = new Date()
        const date = new Date(eventDate)
        // Si la fecha de evento ya pasó pero sigue PUBLISHED → "live"
        if (date <= now) return "live"
      }
      return "published"
    }
    default: return "draft"
  }
}

/**
 * Convierte un UUID string a un número entero estable para usar como id numérico.
 * Toma los primeros 8 caracteres hex del UUID.
 */
function uuidToNumericId(uuid: string): number {
  return parseInt(uuid.replace(/-/g, "").substring(0, 8), 16)
}

/**
 * Transforma PromoterEventData (backend) → PromoterEvent (frontend).
 */
export function mapToPromoterEvent(e: PromoterEventData): PromoterEvent {
  return {
    id: uuidToNumericId(e.id),
    title: e.title,
    date: formatDate(e.eventDate),
    dateIso: toDateIso(e.eventDate),
    venue: e.venue ?? "—",
    imageUrl: e.coverImageUrl ?? "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    genre: e.genre ?? "—",
    status: mapStatus(e.status, e.eventDate),
    capacity: e.totalCapacity,
    ticketsSold: e.ticketsSold,
    revenue: e.revenue,
    avgRating: 0,
    reviewsCount: 0,
    ticketPrice: e.price,
    createdAt: toDateIso(e.eventDate),
  }
}
