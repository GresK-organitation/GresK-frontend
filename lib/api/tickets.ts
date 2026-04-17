import { authedFetch, ApiException } from "./client"

export interface TicketResponse {
  id: string
  eventId: string
  status: string       // "PURCHASED"
  qrCode: string
  purchasedAt: string  // ISO-8601
}

/** Lista todas las entradas del usuario autenticado. */
export async function getUserTickets(): Promise<TicketResponse[]> {
  const res = await authedFetch("/api/v1/users/me/tickets")
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error al cargar las entradas")
  }
  return res.json()
}

/**
 * Obtiene la imagen PNG del QR para un ticket.
 * Devuelve un object URL (blob:) que puede usarse directamente en <img src>.
 * Recuerda revocar el URL con URL.revokeObjectURL() al desmontar.
 */
export async function getTicketQrImage(ticketId: string): Promise<string> {
  const res = await authedFetch(`/api/v1/tickets/${ticketId}/qr`)
  if (!res.ok) {
    throw new ApiException(res.status, "No se pudo cargar el código QR")
  }
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
