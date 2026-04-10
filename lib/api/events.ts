import { API_BASE_URL, ApiException } from "./client"

export interface CreateEventPayload {
  title: string
  genre: string       // uppercase enum: "ELECTRONIC" | "JAZZ" | "ROCK" | etc.
  price: number
  currency: string    // "EUR"
  totalCapacity: number
  city: string
  address: string
  venue?: string
  eventDate: string   // "2026-05-15T22:00:00" — sin Z (LocalDateTime)
}

export interface EventCreatedResult {
  id: string
  title: string
  promoterId: string
  status: string      // "DRAFT"
  genre: string
  amount: number
  currency: string
  totalCapacity: number
  availableCapacity: number
  eventDate: string
  city: string
  address: string
  venue: string | null
  revealAt: string | null
  createdAt: string
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<EventCreatedResult> {
  const token = localStorage.getItem("gresk_token")
  if (!token) throw new ApiException(401, "No autenticado")

  const res = await fetch(`${API_BASE_URL}/api/v1/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Error desconocido" }))
    throw new ApiException(res.status, body.message ?? "Error al crear el evento")
  }

  return res.json()
}
