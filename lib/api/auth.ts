import { API_BASE_URL, ApiException } from "./client"
import { authService } from "@/lib/auth-service"
import type { UserRole } from "@/lib/auth-context"

// ── Login ────────────────────────────────────────────────────────────────────

export interface LoginResult {
  token: string
  expiresIn: number
  accountId: string
  role: UserRole
}

/**
 * POST /api/v1/auth/login
 * Devuelve el token JWT + datos extraídos del payload via authService.
 */
export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiException(res.status, body.error ?? "Credenciales incorrectas")
  }

  const data = await res.json() as { token: string; expiresIn: number }
  const role    = authService.getRoleFromToken(data.token)
  const accountId = authService.getAccountIdFromToken(data.token)

  return { token: data.token, expiresIn: data.expiresIn, accountId, role }
}

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

export interface RegisterPromoterPayload {
  email: string
  password: string
  name: string
  street: string
  city: string
  country: string
  description?: string
  musicalGenres: string[]
  phone?: string
  website?: string
}

export interface RegisterPromoterResponse {
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
  payload: RegisterUserPayload,
  avatar?: File
): Promise<RegisterUserResponse> {
  const formData = new FormData();

  const cleanPayload = {
    ...payload,
    description: payload.description || "",
    musicGenres: payload.musicGenres || [],
  };

  formData.append(
    "data",
    new Blob([JSON.stringify(cleanPayload)], { type: "application/json" })
  );

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register/user`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error desconocido")
  }

  return res.json() as Promise<RegisterUserResponse>
}

// ── Registro de promotora ────────────────────────────────────────────────────

export async function registerPromoter(
  payload: RegisterPromoterPayload,
  logo?: File
): Promise<RegisterPromoterResponse> {
  const formData = new FormData()

  const cleanPayload = {
    ...payload,
    description: payload.description ?? "",
    musicalGenres: payload.musicalGenres ?? [],
    phone: payload.phone ?? null,
    website: payload.website ?? null,
  }

  formData.append(
    "data",
    new Blob([JSON.stringify(cleanPayload)], { type: "application/json" })
  )

  if (logo) {
    formData.append("logo", logo)
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register/promoter`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new ApiException(res.status, body.error ?? "Error desconocido")
  }

  return res.json() as Promise<RegisterPromoterResponse>
}
