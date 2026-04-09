import { API_BASE_URL, ApiException } from "./client"

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface RegisterUserPayload {
  email: string
  password: string
  name: string
  description: string
  city: string
  musicGenres: string[]
}

export interface RegisterUserResponse {
  accountId: string
}

// ── Registro de usuario ──────────────────────────────────────────────────────

/**
 * Llama a POST /api/v1/auth/register/user con multipart/form-data.
 *
 * ⚠️ Spring @RequestPart("data") con @Valid requiere que la parte "data"
 * tenga Content-Type: application/json. Por eso se usa `new Blob([...], { type: "application/json" })`
 * en lugar de pasar el string directamente — si se pasara un string, Spring
 * lo recibiría como text/plain y respondería con 400.
 *
 * El Content-Type del request completo NO se establece manualmente para que
 * el navegador genere el boundary correcto automáticamente.
 */
export async function registerUser(
  payload: RegisterUserPayload
): Promise<RegisterUserResponse> {
  const formData = new FormData()
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  )
  // "avatar" se omite — es opcional en el backend (@RequestPart required = false)

  const res = await fetch(`${API_BASE_URL}/auth/register/user`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error desconocido")
  }

  return res.json() as Promise<RegisterUserResponse>
}
