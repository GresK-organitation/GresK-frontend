"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ArrowRight, Check, MapPin, User, Music2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { registerUser, loginUser } from "@/lib/api/auth"
import { ApiException } from "@/lib/api/client"

// ── Datos ────────────────────────────────────────────────────────────────────

const GENRES: { label: string; value: string }[] = [
  { label: "Rock",       value: "ROCK" },
  { label: "Indie",      value: "INDIE" },
  { label: "Pop",        value: "POP" },
  { label: "Electrónica",value: "ELECTRONIC" },
  { label: "Jazz",       value: "JAZZ" },
  { label: "Hip-Hop",    value: "HIP_HOP" },
  { label: "Metal",      value: "METAL" },
  { label: "Trap",       value: "TRAP" },
  { label: "Reggaeton",  value: "REGGAETON" },
  { label: "Flamenco",   value: "FLAMENCO" },
  { label: "R&B",        value: "R_AND_B" },
  { label: "Techno",     value: "TECHNO" },
  { label: "House",      value: "HOUSE" },
  { label: "Punk",       value: "PUNK" },
  { label: "Latin Jazz", value: "LATIN_JAZZ" },
  { label: "Clásica",    value: "CLASSICAL" },
]

const CITIES = [
  "Barcelona", "Madrid", "Valencia", "Sevilla", "Bilbao",
  "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas",
  "Otra ciudad",
]

const TOTAL_STEPS = 4

// ── Página principal ─────────────────────────────────────────────────────────

export default function RegistroPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Campos
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [customCity, setCustomCity] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)

  const progressPct = (step / TOTAL_STEPS) * 100
  const goBack = () => step > 1 && setStep((s) => s - 1)

  function toggleGenre(g: string) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  function canContinue(): boolean {
    if (step === 1) return name.trim() !== "" && email.trim() !== "" && password.length >= 6
    if (step === 2) return city !== ""
    if (step === 3) return genres.length > 0
    return true
  }

  async function handleFinish() {
    setLoading(true)
    setApiError(null)

    const finalCity = city === "Otra ciudad" ? customCity : city

    try {
      await registerUser(
        {
          email,
          password,
          name,
          description: bio,
          city: finalCity,
          musicGenres: genres,
        },
        avatar ?? undefined
      )
      // Auto-login para obtener el JWT y evitar 403 en llamadas posteriores
      const result = await loginUser(email, password)
      login(result.role, result.accountId, result.token)
      router.push("/feed")
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.status === 409) {
          setStep(1)
          setApiError("Este correo ya está registrado. ¿Quieres iniciar sesión?")
        } else {
          setApiError("Ha ocurrido un error. Inténtalo de nuevo.")
        }
      } else {
        // Backend caído / error de red → degradación graceful
        login("user")
        router.push("/feed")
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

      {/* ── Contenido por paso ── */}
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        {step === 1 && (
          <StepCredentials
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
          />
        )}
        {step === 2 && (
          <StepCity
            city={city} setCity={setCity}
            customCity={customCity} setCustomCity={setCustomCity}
          />
        )}
        {step === 3 && (
          <StepGenres genres={genres} toggle={toggleGenre} />
        )}
        {step === 4 && (
          <StepBio bio={bio} setBio={setBio} avatar={avatar} setAvatar={setAvatar} />
        )}
      </main>

      {/* ── Botón inferior fijo ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
        <div className="mx-auto max-w-3xl">
          {apiError && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-bold text-black">{apiError}</p>
              {apiError.includes("iniciar sesión") && (
                <Link
                  href="/"
                  className="mt-1 block text-xs font-bold text-black underline underline-offset-2"
                >
                  Ir a iniciar sesión →
                </Link>
              )}
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={!canContinue() || loading}
            className="h-14 w-full rounded-full bg-black text-base font-bold uppercase tracking-wider text-white hover:bg-gray-800 disabled:opacity-30"
          >
            {loading ? (
              "Creando tu cuenta…"
            ) : step === TOTAL_STEPS ? (
              <>Entrar a GresK <ArrowRight className="ml-2 h-5 w-5" /></>
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
        <User className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        Crea tu cuenta
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Solo te pedimos lo esencial. En 4 pasos estás dentro.
      </p>

      <div className="mt-10 space-y-0">
        <FormRow label="Nombre">
          <input
            type="text"
            placeholder="¿Cómo te llamamos?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
          />
        </FormRow>
        <FormRow label="Correo electrónico">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-300 focus:outline-none"
          />
        </FormRow>
        <FormRow label="Contraseña">
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
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

// ── Paso 2: Ciudad ────────────────────────────────────────────────────────────

function StepCity({
  city, setCity, customCity, setCustomCity,
}: {
  city: string; setCity: (v: string) => void
  customCity: string; setCustomCity: (v: string) => void
}) {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <MapPin className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Desde dónde<br />vas a los conciertos?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Te mostraremos primero lo que pasa cerca de ti.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CITIES.map((c) => {
          const selected = city === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={`relative flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-all ${
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

      {city === "Otra ciudad" && (
        <div className="mt-4 border-b border-gray-300 pb-2">
          <input
            type="text"
            placeholder="Escribe tu ciudad…"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base font-medium text-black placeholder:text-gray-400 focus:outline-none"
          />
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
        ¿Qué música<br />te mueve?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Cuantos más elijas, mejores serán tus recomendaciones.
      </p>

      {/* Recomendación de 3 */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <span className="text-lg">🎯</span>
        <p className="text-xs font-bold text-gray-600">
          Mientras más elijas, mejor serán tus recomendaciones.
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

// ── Paso 4: Bio + Avatar ──────────────────────────────────────────────────────

function StepBio({
  bio, setBio, avatar, setAvatar,
}: {
  bio: string; setBio: (v: string) => void
  avatar: File | null; setAvatar: (f: File | null) => void
}) {
  const MAX = 160
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
        <span className="text-xl">✦</span>
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-5xl">
        Cuéntanos<br />algo de ti
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Opcional, pero los mejores perfiles siempre tienen algo que decir.
      </p>

      {/* Avatar */}
      <div className="mt-10 flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-black"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="avatar" className="h-full w-full object-cover grayscale" />
          ) : (
            <User className="h-8 w-8 text-gray-300" />
          )}
        </button>
        <div>
          <p className="text-sm font-bold text-black">
            {avatar ? avatar.name : "Añade una foto de perfil"}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-black"
          >
            {avatar ? "Cambiar imagen" : "Subir imagen"}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={() => { setAvatar(null); setPreview(null) }}
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

      {/* Bio */}
      <div className="mt-8">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, MAX))}
            placeholder="Ej. Vivo pegado a la Sala Apolo. Si hay electrónica o jazz en directo, ahí estaré."
            rows={5}
            className="w-full resize-none bg-transparent text-base font-medium text-black placeholder:text-gray-400 focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-xs text-gray-400">Máximo {MAX} caracteres</span>
            <span className={`text-xs font-bold ${bio.length > MAX * 0.85 ? "text-black" : "text-gray-400"}`}>
              {bio.length}/{MAX}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Puedes editarlo más adelante desde tu perfil.
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
