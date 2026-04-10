export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const TOKEN_KEY = "gresk_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Wrapper autenticado. El path debe incluir /api/v1/, e.g. "/api/v1/artists/my".
 * Content-Type NO se añade por defecto — las llamadas multipart lo necesitan sin él.
 */
export async function authenticatedFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken()
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

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
