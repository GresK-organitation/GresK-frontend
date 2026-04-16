const MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN",
                "JUL","AGO","SEP","OCT","NOV","DIC"]

/**
 * Convierte una fecha ISO completa ("2026-04-16T22:00:00Z") al formato de la UI:
 *   - Si es hoy     → "HOY"
 *   - Si es mañana  → "MAÑANA"
 *   - Si no         → "16 ABR"
 */
export function formatEventDate(isoDate: string): string {
  const date     = new Date(isoDate)
  const today    = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()

  if (sameDay(date, today))    return "HOY"
  if (sameDay(date, tomorrow)) return "MAÑANA"

  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/**
 * Convierte una fecha ISO local del dashboard ("2026-05-29") al formato "29 MAY"
 */
export function formatShortDate(isoLocalDate: string): string {
  const [, month, day] = isoLocalDate.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

/**
 * Extrae la hora de una fecha ISO completa: "2026-04-16T22:00:00Z" → "22:00"
 */
export function formatEventTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("es-ES", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/**
 * Convierte un número a precio legible:
 *   195   → "195€"
 *   12.5  → "12.50€"
 *   null  → ""
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return ""
  const fixed = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2)
  return `${fixed}€`
}
