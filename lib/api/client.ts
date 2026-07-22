export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://gresk-backend-sgb7.onrender.com"

/**
 * Error lanzado cuando el backend responde con un status no-OK (4xx, 5xx).
 * Distinguible de los errores de red (TypeError) para manejarlos por separado.
 */
export class ApiException extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "ApiException"
  }
}

/**
 * Decodifica el payload de un JWT (sin verificar firma).
 * Devuelve el objeto JSON del payload o null si el token es inválido.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Fetch autenticado con Bearer token desde localStorage. */
export async function authedFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("gresk_token")
  const headers = new Headers(options.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers })
}
