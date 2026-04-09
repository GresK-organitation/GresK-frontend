"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/dashboard/navbar"
import { ChevronDown, Check } from "lucide-react"

const GENRES = [
  "Electronic", "Techno", "House", "Indie", "Pop", "Rock",
  "Hip-Hop", "Jazz", "Reggaeton", "R&B", "World Music", "Experimental",
  "Drum & Bass", "Ambient", "Classical",
]

const VENUE_SIZES = [
  { label: "Menos de 100 personas", value: "<100" },
  { label: "100 – 500 personas", value: "100-500" },
  { label: "500 – 2.000 personas", value: "500-2000" },
  { label: "Más de 2.000 personas", value: "+2000" },
]

const EVENT_TYPES = [
  { label: "Club / Sala", value: "club" },
  { label: "Festival", value: "festival" },
  { label: "Concierto", value: "concert" },
  { label: "Ciclo / Serie", value: "cycle" },
  { label: "Privado", value: "private" },
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
  const { login } = useAuth()

  // Campos del formulario
  const [promoterName, setPromoterName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [venueSize, setVenueSize] = useState("")
  const [eventType, setEventType] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function toggleGenre(g: string) {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulamos envío — offline-tolerant
    await new Promise((r) => setTimeout(r, 900))
    login("promoter")
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => router.push("/promoter"), 1800)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-white pt-16">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
              <Check className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Solicitud enviada
            </p>
            <h1 className="mt-2 text-3xl font-black text-black">
              ¡Bienvenida a GresK!
            </h1>
            <p className="mt-3 text-sm font-medium text-gray-500">
              Redirigiendo a tu panel de promotora…
            </p>
          </div>
        </main>
      </>
    )
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
                    id="promoter-name"
                    placeholder="Ej. Razzmatazz, Apolo, Primavera Sound…"
                    value={promoterName}
                    onChange={setPromoterName}
                    required
                  />
                </FormRow>

                <FormRow label="Nombre del responsable" required>
                  <TextInput
                    id="contact-name"
                    placeholder="Tu nombre completo"
                    value={contactName}
                    onChange={setContactName}
                    required
                  />
                </FormRow>

                <FormRow label="Correo electrónico" required>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="hola@tusala.com"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                </FormRow>

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

                <FormRow label="Dirección" required>
                  <TextInput
                    id="address"
                    placeholder="Calle, número, código postal"
                    value={address}
                    onChange={setAddress}
                    required
                  />
                </FormRow>

                <FormRow label="Ciudad principal" required>
                  <TextInput
                    id="city"
                    placeholder="Barcelona, Madrid, Valencia…"
                    value={city}
                    onChange={setCity}
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

                {/* Tipo de evento — select custom */}
                <FormRow label="Tipo de eventos" required>
                  <div className="relative">
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      required
                      className="w-full appearance-none bg-transparent text-sm text-black focus:outline-none"
                    >
                      <option value="" disabled>
                        Seleccionar
                      </option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-0.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormRow>

                {/* Aforo — select custom */}
                <FormRow label="Aforo habitual" required>
                  <div className="relative">
                    <select
                      value={venueSize}
                      onChange={(e) => setVenueSize(e.target.value)}
                      required
                      className="w-full appearance-none bg-transparent text-sm text-black focus:outline-none"
                    >
                      <option value="" disabled>
                        Seleccionar
                      </option>
                      {VENUE_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-0.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormRow>

                {/* Géneros musicales — chips */}
                <FormRow label="Géneros musicales" required>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => {
                      const active = selectedGenres.includes(g)
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                            active
                              ? "bg-black text-white"
                              : "border border-gray-200 bg-white text-black hover:border-black"
                          }`}
                        >
                          {g}
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
                <FormRow label="Descripción breve" required>
                  <textarea
                    placeholder="Cuéntanos quiénes sois, qué tipo de eventos organizáis y qué buscáis en GresK…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
                  />
                </FormRow>

                {/* Submit */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading || selectedGenres.length === 0}
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
