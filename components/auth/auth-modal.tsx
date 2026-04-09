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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const API_BASE_URL = "http://localhost:8080/api/v1"

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

        <Tabs defaultValue="login" className="mt-1">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
            <TabsTrigger
              value="login"
              className="rounded-full text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
            >
              Acceder
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-full text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onClose={onClose} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// ——— Campo de formulario estilo GresK ———
function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  minLength,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  minLength?: number
}) {
  return (
    <div className="border-b border-gray-200 py-3">
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="mt-1 w-full bg-transparent text-sm font-medium text-black placeholder:text-gray-300 focus:outline-none"
      />
    </div>
  )
}

function LoginForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "user" }),
      })
      if (!res.ok) {
        login("user")
        onClose()
        router.push("/feed")
        return
      }
      login("user")
      onClose()
      router.push("/feed")
    } catch {
      login("user")
      onClose()
      router.push("/feed")
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

      <div className="pt-5">
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
        >
          {loading ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </div>

      <p className="pt-4 text-center text-xs text-gray-400">
        ¿Eres promotora?{" "}
        <a
          href="/trabaja-con-nosotros"
          className="font-semibold text-black underline underline-offset-2"
          onClick={onClose}
        >
          Regístrate aquí
        </a>
      </p>
    </form>
  )
}

function RegisterForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      })
      if (!res.ok) {
        login("user")
        onClose()
        router.push("/feed")
        return
      }
      login("user")
      onClose()
      router.push("/feed")
    } catch {
      login("user")
      onClose()
      router.push("/feed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-0">
      <FormField
        id="reg-name"
        label="Nombre"
        placeholder="Tu nombre"
        value={name}
        onChange={setName}
        required
      />
      <FormField
        id="reg-email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={setEmail}
        required
      />
      <FormField
        id="reg-password"
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={setPassword}
        required
        minLength={8}
      />

      <div className="pt-5">
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </div>

      <p className="pt-4 text-center text-xs text-gray-400">
        ¿Eres promotora?{" "}
        <a
          href="/trabaja-con-nosotros"
          className="font-semibold text-black underline underline-offset-2"
          onClick={onClose}
        >
          Regístrate aquí
        </a>
      </p>
    </form>
  )
}
