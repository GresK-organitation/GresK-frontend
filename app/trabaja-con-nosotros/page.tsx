"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/dashboard/navbar"
import { Check, AlertCircle } from "lucide-react"
import { registerPromoter } from "@/lib/api/auth"
import { ApiException } from "@/lib/api/client"

// Géneros alineados con el enum MusicGenre del backend
const GENRES: { label: string; value: string }[] = [
  { label: "Electronic",  value: "ELECTRONIC" },
  { label: "Techno",      value: "TECHNO" },
  { label: "House",       value: "HOUSE" },
  { label: "Indie",       value: "INDIE" },
  { label: "Pop",         value: "POP" },
  { label: "Rock",        value: "ROCK" },
  { label: "Hip-Hop",     value: "HIP_HOP" },
  { label: "Jazz",        value: "JAZZ" },
  { label: "Reggaeton",   value: "REGGAETON" },
  { label: "R&B",         value: "R_AND_B" },
  { label: "Metal",       value: "METAL" },
  { label: "Trap",        value: "TRAP" },
  { label: "Flamenco",    value: "FLAMENCO" },
  { label: "Punk",        value: "PUNK" },
  { label: "Latin Jazz",  value: "LATIN_JAZZ" },
  { label: "Classical",   value: "CLASSICAL" },
]

// ——— Componente de fila del formulario (estilo DICE) ———
function FormRow({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 py-5 sm:flex-row sm:items-start sm:gap-8">
      <span className="w-52 shrink-0 text-sm font-semibold text-black">
        {label}
        {required && <span className="ml-0.5 text-black">*</span>}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function TextInput({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
    />
  )
}

export default function TrabajaConNosotrosPage() {
  const router = useRouter()
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Campos del formulario
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  function toggleGenre(value: string) {
    setSelectedGenres((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setEmailError("Introduce un correo electrónico válido")
      return
    }
    setError(null)
    setLoading(true)

    try {
      await registerPromoter(
        {
          email,
          password,
          name,
          street,
          city,
          country,
          description: description || undefined,
          musicalGenres: selectedGenres,
          phone: phone || undefined,
          website: website || undefined,
        },
        logo ?? undefined
      )
      router.push("/promoter/pending")
    } catch (err) {
      if (err instanceof ApiException && err.status === 409) {
        setError("Este correo electrónico ya está registrado.")
      } else {
        setError("No se ha podido completar el registro. Inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">

          {/* Layout: título izquierda + formulario derecha */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr]">

            {/* ——— Columna izquierda: presentación ——— */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Trabaja con nosotros
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-black md:text-5xl">
                ¿Interesada en trabajar juntos?
              </h1>
              <p className="mt-6 text-sm font-medium leading-relaxed text-gray-500">
                GresK conecta promotoras y salas con los usuarios que más les
                importan. Desde la gestión de tu cartel hasta la venta de entradas
                flash, te damos las herramientas para llenar cada evento.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Panel de control con KPIs en tiempo real",
                  "Entradas flash para maximizar el aforo",
                  "Gestión de artistas y riders",
                  "Audiencia segmentada por géneros musicales",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ——— Columna derecha: formulario ——— */}
            <div>
              <form onSubmit={handleSubmit}>

                <FormRow label="Nombre de la promotora / sala" required>
                  <TextInput
                    id="name"
                    placeholder="Ej. Razzmatazz, Apolo, Primavera Sound…"
                    value={name}
                    onChange={setName}
                    required
                  />
                </FormRow>

                <FormRow label="Correo electrónico" required>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="hola@tusala.com"
                    value={email}
                    onChange={(v) => {
                      setEmail(v)
                      if (v && !isValidEmail(v)) {
                        setEmailError("Introduce un correo electrónico válido")
                      } else {
                        setEmailError(null)
                      }
                    }}
                    required
                  />
                </FormRow>
                {emailError && (
                  <div className="flex items-center gap-1.5 pb-3 pt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-black" />
                    <p className="text-xs font-bold text-black">{emailError}</p>
                  </div>
                )}

                <FormRow label="Contraseña" required>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                </FormRow>

                <FormRow label="Dirección (calle)" required>
                  <TextInput
                    id="street"
                    placeholder="Calle, número, código postal"
                    value={street}
                    onChange={setStreet}
                    required
                  />
                </FormRow>

                <FormRow label="Ciudad" required>
                  <TextInput
                    id="city"
                    placeholder="Barcelona, Madrid, Valencia…"
                    value={city}
                    onChange={setCity}
                    required
                  />
                </FormRow>

                <FormRow label="País" required>
                  <TextInput
                    id="country"
                    placeholder="España, Francia, Alemania…"
                    value={country}
                    onChange={setCountry}
                    required
                  />
                </FormRow>

                <FormRow label="Teléfono de contacto">
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={phone}
                    onChange={setPhone}
                  />
                </FormRow>

                <FormRow label="Sitio web / Red social">
                  <TextInput
                    id="website"
                    type="url"
                    placeholder="https://…"
                    value={website}
                    onChange={setWebsite}
                  />
                </FormRow>

                {/* Géneros musicales — chips */}
                <FormRow label="Géneros musicales" required>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(({ label, value }) => {
                      const active = selectedGenres.includes(value)
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleGenre(value)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                            active
                              ? "bg-black text-white"
                              : "border border-gray-200 bg-white text-black hover:border-black"
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                  {selectedGenres.length === 0 && (
                    <p className="mt-2 text-xs text-gray-400">
                      Selecciona al menos un género
                    </p>
                  )}
                </FormRow>

                {/* Descripción */}
                <FormRow label="Descripción breve">
                  <textarea
                    placeholder="Cuéntanos quiénes sois, qué tipo de eventos organizáis y qué buscáis en GresK…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
                  />
                </FormRow>

                {/* Logo */}
                <FormRow label="Logo">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold text-black hover:border-black transition-all"
                    >
                      {logo ? "Cambiar imagen" : "Subir logo"}
                    </button>
                    {logo && (
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        {logo.name}
                      </span>
                    )}
                  </div>
                </FormRow>

                {/* Error */}
                {error && (
                  <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
                )}

                {/* Submit */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading || selectedGenres.length === 0 || !!emailError}
                    className="w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
                  >
                    {loading ? "Enviando solicitud…" : "Enviar solicitud →"}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-400">
                    Los campos marcados con * son obligatorios
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
