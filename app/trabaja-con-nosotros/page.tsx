"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, ArrowRight, Check, MapPin, User, Music2, Phone, Globe, Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { registerPromoter } from "@/lib/api/auth"
import { ApiException } from "@/lib/api/client"

// ── Datos ────────────────────────────────────────────────────────────────────

const GENRES: { label: string; value: string }[] = [
  { label: "Electronic", value: "ELECTRONIC" },
  { label: "Techno",     value: "TECHNO" },
  { label: "House",      value: "HOUSE" },
  { label: "Indie",      value: "INDIE" },
  { label: "Pop",        value: "POP" },
  { label: "Rock",       value: "ROCK" },
  { label: "Hip-Hop",    value: "HIP_HOP" },
  { label: "Jazz",       value: "JAZZ" },
  { label: "Reggaeton",  value: "REGGAETON" },
  { label: "R&B",        value: "R_AND_B" },
  { label: "Metal",      value: "METAL" },
  { label: "Trap",       value: "TRAP" },
  { label: "Flamenco",   value: "FLAMENCO" },
  { label: "Punk",       value: "PUNK" },
  { label: "Latin Jazz", value: "LATIN_JAZZ" },
  { label: "Clásica",    value: "CLASSICAL" },
]

const COUNTRIES = [
  { label: "España",      value: "España",      prefix: "+34" },
  { label: "Francia",     value: "Francia",     prefix: "+33" },
  { label: "Italia",      value: "Italia",      prefix: "+39" },
  { label: "Alemania",    value: "Alemania",    prefix: "+49" },
  { label: "Reino Unido", value: "Reino Unido", prefix: "+44" },
]

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "España":       ["Barcelona", "Madrid", "Valencia", "Sevilla", "Bilbao", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas"],
  "Francia":      ["París", "Lyon", "Marsella", "Burdeos", "Toulouse", "Estrasburgo", "Nantes"],
  "Italia":       ["Roma", "Milán", "Florencia", "Nápoles", "Turín", "Bolonia", "Venecia"],
  "Alemania":     ["Berlín", "Múnich", "Hamburgo", "Colonia", "Frankfurt", "Stuttgart", "Düsseldorf"],
  "Reino Unido":  ["Londres", "Manchester", "Birmingham", "Edimburgo", "Glasgow", "Liverpool", "Bristol"],
}

const TOTAL_STEPS = 5

// ── Página principal ─────────────────────────────────────────────────────────

export default function TrabajaConNosotrosPage() {
  const router = useRouter()

  const [step, setStep]     = useState(1)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Paso 1
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")

  // Paso 2
  const [country, setCountry]   = useState("")
  const [city, setCity]         = useState("")
  const [street, setStreet]     = useState("")

  // Paso 3
  const [genres, setGenres] = useState<string[]>([])

  // Paso 4
  const [phoneNumber, setPhoneNumber] = useState("")
  const [webSuffix, setWebSuffix]     = useState("")

  // Paso 5
  const [description, setDescription] = useState("")
  const [logo, setLogo]               = useState<File | null>(null)

  const progressPct = (step / TOTAL_STEPS) * 100
  const goBack = () => step > 1 && setStep((s) => s - 1)

  const phonePrefix = COUNTRIES.find((c) => c.value === country)?.prefix ?? ""

  function toggleGenre(g: string) {
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g])
  }

  function handleCountrySelect(c: string) {
    setCountry(c)
    setCity("")          // reset ciudad al cambiar país
    setPhoneNumber("")   // reset número (el prefijo cambia)
  }

  function canContinue(): boolean {
    if (step === 1) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      return name.trim() !== "" && emailOk && password.length >= 8
    }
    if (step === 2) return country !== "" && city !== "" && street.trim() !== ""
    if (step === 3) return genres.length > 0
    return true // pasos 4 y 5 son opcionales
  }

  async function handleFinish() {
    setLoading(true)
    setApiError(null)
    const fullPhone  = phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : undefined
    const fullWebsite = webSuffix.trim() ? `https://${webSuffix.trim()}` : undefined

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
          musicalGenres: genres,
          phone: fullPhone,
          website: fullWebsite,
        },
        logo ?? undefined
      )
      router.push("/promoter/pending")
    } catch (err) {
      if (err instanceof ApiException && err.status === 409) {
        setStep(1)
        setApiError("Este correo ya está registrado.")
      } else {
        setApiError("No se ha podido completar el registro. Inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else handleFinish()
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header con progreso ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </Link>
          )}

          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              PASO {step} DE {TOTAL_STEPS}
            </p>
          </div>

          {step < TOTAL_STEPS && (
            <button
              onClick={() => setStep(TOTAL_STEPS)}
              className="shrink-0 text-sm font-semibold text-gray-400 transition-colors hover:text-black"
            >
              Saltar
            </button>
          )}
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        {step === 1 && (
          <StepCredentials
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
          />
        )}
        {step === 2 && (
          <StepUbicacion
            country={country} onCountrySelect={handleCountrySelect}
            city={city} setCity={setCity}
            street={street} setStreet={setStreet}
          />
        )}
        {step === 3 && (
          <StepGenres genres={genres} toggle={toggleGenre} />
        )}
        {step === 4 && (
          <StepContacto
            phonePrefix={phonePrefix}
            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            webSuffix={webSuffix} setWebSuffix={setWebSuffix}
          />
        )}
        {step === 5 && (
          <StepIdentidad
            description={description} setDescription={setDescription}
            logo={logo} setLogo={setLogo}
          />
        )}
      </main>

      {/* ── Botón inferior fijo ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
        <div className="mx-auto max-w-3xl">
          {apiError && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-bold text-black">{apiError}</p>
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={!canContinue() || loading}
            className="h-14 w-full rounded-full bg-black text-base font-bold uppercase tracking-wider text-white hover:bg-gray-800 disabled:opacity-30"
          >
            {loading ? (
              "Enviando solicitud…"
            ) : step === TOTAL_STEPS ? (
              <>Enviar solicitud <ArrowRight className="ml-2 h-5 w-5" /></>
            ) : (
              <>Siguiente <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Paso 1: Credenciales ──────────────────────────────────────────────────────

function StepCredentials({
  name, setName, email, setEmail, password, setPassword,
}: {
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
}) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <Building2 className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        Crea tu cuenta<br />de promotora
      </h1>
      <p className="mt-3 text-base text-gray-500">
        En 5 pasos tienes tu promotora en GresK.
      </p>

      <div className="mt-10 space-y-0">
        <FormRow label="Nombre de la sala / promotora">
          <input
            type="text"
            placeholder="Ej. Razzmatazz, Apolo, Primavera Sound…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
          />
        </FormRow>
        <FormRow label="Correo electrónico">
          <input
            type="email"
            placeholder="hola@tupromotora.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
          />
        </FormRow>
        <FormRow label="Contraseña">
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
          />
        </FormRow>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/" className="font-semibold text-black underline underline-offset-2">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}

// ── Paso 2: Ubicación ────────────────────────────────────────────────────────

function StepUbicacion({
  country, onCountrySelect, city, setCity, street, setStreet,
}: {
  country: string; onCountrySelect: (v: string) => void
  city: string; setCity: (v: string) => void
  street: string; setStreet: (v: string) => void
}) {
  const cities = country ? (CITIES_BY_COUNTRY[country] ?? []) : []

  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <MapPin className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Dónde está<br />tu promotora?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Selecciona país y ciudad para que los fans te encuentren.
      </p>

      {/* País */}
      <div className="mt-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">País</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COUNTRIES.map((c) => {
            const selected = country === c.value
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onCountrySelect(c.value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-all ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-black hover:border-gray-400"
                }`}
              >
                {c.label}
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Ciudad */}
      {country && (
        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Ciudad</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cities.map((c) => {
              const selected = city === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-all ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-black hover:border-gray-400"
                  }`}
                >
                  {c}
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Calle */}
      {city && (
        <div className="mt-8">
          <FormRow label="Dirección (calle y número)">
            <input
              type="text"
              placeholder="Ej. Carrer dels Almogàvers, 122"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
            />
          </FormRow>
        </div>
      )}
    </div>
  )
}

// ── Paso 3: Géneros ───────────────────────────────────────────────────────────

function StepGenres({
  genres, toggle,
}: {
  genres: string[]
  toggle: (g: string) => void
}) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <Music2 className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Qué música<br />programáis?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Ayuda a los fans a encontrarte por su género favorito.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <span className="text-lg">🎯</span>
        <p className="text-xs font-bold text-gray-600">
          Elige al menos <span className="text-black">1 género</span>.
          {genres.length > 0 && (
            <span className="ml-1 font-black text-black">
              {genres.length} seleccionado{genres.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {GENRES.map(({ label, value }) => {
          const selected = genres.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-black hover:border-gray-400"
              }`}
            >
              {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Paso 4: Contacto ──────────────────────────────────────────────────────────

function StepContacto({
  phonePrefix, phoneNumber, setPhoneNumber, webSuffix, setWebSuffix,
}: {
  phonePrefix: string
  phoneNumber: string; setPhoneNumber: (v: string) => void
  webSuffix: string; setWebSuffix: (v: string) => void
}) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <Phone className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        Datos de contacto
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Opcionales, pero ayudan a que los fans confíen en ti.
      </p>

      <div className="mt-10 space-y-0">
        {/* Teléfono con prefijo */}
        <FormRow label="Teléfono">
          <div className="flex items-center gap-3">
            {phonePrefix && (
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-black">
                {phonePrefix}
              </span>
            )}
            <input
              type="tel"
              placeholder="600 000 000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
            />
          </div>
        </FormRow>

        {/* Web con prefijo https:// */}
        <FormRow label="Sitio web">
          <div className="flex items-center gap-1">
            <span className="shrink-0 text-sm font-bold text-gray-400">https://</span>
            <input
              type="text"
              placeholder="www.tupromotora.com"
              value={webSuffix}
              onChange={(e) => setWebSuffix(e.target.value.replace(/^https?:\/\//, ""))}
              className="flex-1 bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
            />
          </div>
        </FormRow>
      </div>
    </div>
  )
}

// ── Paso 5: Identidad (Descripción + Logo) ────────────────────────────────────

function StepIdentidad({
  description, setDescription, logo, setLogo,
}: {
  description: string; setDescription: (v: string) => void
  logo: File | null; setLogo: (f: File | null) => void
}) {
  const MAX = 600
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    setLogo(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <Globe className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        Cuéntanos<br />quiénes sois
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Opcional, pero los mejores perfiles siempre tienen algo que decir.
      </p>

      {/* Logo */}
      <div className="mt-10 flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-black"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="logo" className="h-full w-full object-cover grayscale" />
          ) : (
            <Building2 className="h-8 w-8 text-gray-300" />
          )}
        </button>
        <div>
          <p className="text-sm font-bold text-black">
            {logo ? logo.name : "Añade vuestro logo"}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-black"
          >
            {logo ? "Cambiar imagen" : "Subir imagen"}
          </button>
          {logo && (
            <button
              type="button"
              onClick={() => { setLogo(null); setPreview(null) }}
              className="ml-3 text-xs font-semibold text-gray-400 underline underline-offset-2 hover:text-black"
            >
              Eliminar
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Descripción */}
      <div className="mt-8">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX))}
            placeholder="Cuéntanos quiénes sois, qué tipo de eventos organizáis y qué buscáis en GresK…"
            rows={5}
            className="w-full resize-none bg-transparent text-base font-medium text-black placeholder:text-gray-400 focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-xs text-gray-400">Máximo {MAX} caracteres</span>
            <span className={`text-xs font-bold ${description.length > MAX * 0.85 ? "text-black" : "text-gray-400"}`}>
              {description.length}/{MAX}
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Una vez enviada la solicitud, el equipo de GresK la revisará y activará tu cuenta.
        </p>
      </div>
    </div>
  )
}

// ── Helper: fila de formulario ────────────────────────────────────────────────

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 py-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}
