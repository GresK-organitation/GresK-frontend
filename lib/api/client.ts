export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

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
