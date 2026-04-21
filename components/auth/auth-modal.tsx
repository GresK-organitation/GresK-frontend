"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/lib/api/auth"
import { ApiException } from "@/lib/api/client"
import { authService } from "@/lib/auth-service"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border border-gray-200 bg-white shadow-xl sm:max-w-sm sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-black">
            GresK
          </DialogTitle>
        </DialogHeader>

        <LoginForm onClose={onClose} />

      </DialogContent>
    </Dialog>
  )
}

// ── Campo de formulario ──────────────────────────────────────────────────────

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div className="border-b border-gray-200 py-3">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase tracking-widest text-gray-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full bg-transparent text-sm font-medium text-black placeholder:text-gray-300 focus:outline-none"
      />
    </div>
  )
}

// ── Formulario de login ──────────────────────────────────────────────────────

function LoginForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const result = await loginUser(email, password)
      login(result.role, result.accountId, result.token)
      onClose()
      router.push(authService.getRedirectPath(result.role))
    } catch (err) {
      if (err instanceof ApiException && err.status === 401) {
        setErrorMsg("Email o contraseña incorrectos")
      } else if (err instanceof Error && err.name === "TypeError") {
        // Backend caído — fallback offline-tolerant
        login("user")
        onClose()
        router.push(authService.getRedirectPath("user"))
      } else {
        setErrorMsg("Error al conectar con el servidor")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-0">
      <FormField
        id="login-email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={setEmail}
        required
      />
      <FormField
        id="login-password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={setPassword}
        required
      />

      {errorMsg && (
        <p className="pt-3 text-center text-xs font-bold text-red-600">{errorMsg}</p>
      )}

      <div className="pt-5">
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
        >
          {loading ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </div>
    </form>
  )
}
