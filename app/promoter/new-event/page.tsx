"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Plus,
  Check,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Euro,
  Upload,
  Camera,
  Sparkles,
  Zap,
  Music2,
  X,
  Tag,
  Trash2,
  FileText,
  Ticket,
  Navigation,
} from "lucide-react"
import { createEvent, publishEvent } from "@/lib/api/events"

// ── Géneros (label → valor enum backend) ────────────────────────────────────

const GENRES: { label: string; value: string }[] = [
  { label: "Rock",       value: "ROCK" },
  { label: "Indie",      value: "INDIE" },
  { label: "Pop",        value: "POP" },
  { label: "Electrónica",value: "ELECTRONIC" },
  { label: "Techno",     value: "TECHNO" },
  { label: "House",      value: "HOUSE" },
  { label: "Jazz",       value: "JAZZ" },
  { label: "Hip-Hop",    value: "HIP_HOP" },
  { label: "Metal",      value: "METAL" },
  { label: "Trap",       value: "TRAP" },
  { label: "Reggaeton",  value: "REGGAETON" },
  { label: "Flamenco",   value: "FLAMENCO" },
  { label: "R&B",        value: "R_AND_B" },
  { label: "Punk",       value: "PUNK" },
  { label: "Latin Jazz", value: "LATIN_JAZZ" },
  { label: "Clásica",    value: "CLASSICAL" },
]

const TIME_SLOTS = [
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00",
]

// ── Tipos ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5

interface EventDraft {
  title: string
  artists: string[]
  genres: string[]       // valores enum: "ROCK", "INDIE", …
  place: string          // nombre de la sala
  street: string
  city: string
  country: string
  latitude: string
  longitude: string
  date: string
  time: string
  description: string
  posterUrl: string | null
  price: string
  capacity: string
}

// ── Página principal ────────────────────────────────────────────────────────

export default function NewEventPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<EventDraft>({
    title: "",
    artists: [],
    genres: [],
    place: "",
    street: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    date: "",
    time: "",
    description: "",
    posterUrl: null,
    price: "",
    capacity: "",
  })

  const update = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((p) => ({ ...p, [key]: value }))

  const progressPct = (step / 5) * 100
  const goBack = () => step > 1 && setStep((step - 1) as Step)
  const goNext = () => step < 5 && setStep((step + 1) as Step)

  const stepValid: Record<Step, boolean> = {
    1: draft.title.trim().length > 0 && draft.artists.length > 0 && draft.genres.length > 0,
    2: draft.place.trim().length > 0 &&
       draft.street.trim().length > 0 &&
       draft.city.trim().length > 0 &&
       draft.country.trim().length > 0 &&
       draft.latitude.trim().length > 0 &&
       draft.longitude.trim().length > 0 &&
       draft.date.length > 0 &&
       draft.time.length > 0,
    3: draft.posterUrl !== null && draft.description.trim().length > 0,
    4: draft.price.trim().length > 0 && draft.capacity.trim().length > 0,
    5: true,
  }

  async function handlePublish() {
    setPublishing(true)
    setError(null)
    try {
      // Combinar fecha + hora en ISO-8601 con zona UTC
      const eventDate = new Date(`${draft.date}T${draft.time}:00`).toISOString()

      const created = await createEvent({
        title: draft.title,
        genre: draft.genres[0],        // backend acepta un género
        price: parseFloat(draft.price),
        currency: "EUR",
        totalCapacity: parseInt(draft.capacity),
        eventDate,
        place: draft.place || undefined,
        street: draft.street,
        city: draft.city,
        country: draft.country,
        latitude: parseFloat(draft.latitude),
        longitude: parseFloat(draft.longitude),
        coverImageUrl: draft.posterUrl?.startsWith("data:") ? undefined : draft.posterUrl ?? undefined,
        artistName: draft.artists[0] || undefined,
        description: draft.description || undefined,
      })

      await publishEvent(created.id)
      router.push("/promoter")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al publicar el evento")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </button>
          ) : (
            <Link
              href="/promoter"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </Link>
          )}

          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Paso {step} de 5 · {STEP_LABELS[step]}
            </p>
          </div>

          <button
            onClick={() => router.push("/promoter")}
            className="text-sm font-semibold text-gray-500 hover:text-black"
          >
            Guardar y salir
          </button>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        {step === 1 && <Step1Basic draft={draft} update={update} />}
        {step === 2 && <Step2Place draft={draft} update={update} />}
        {step === 3 && <Step3Poster draft={draft} update={update} />}
        {step === 4 && <Step4Tickets draft={draft} update={update} />}
        {step === 5 && <Step5Review draft={draft} onEdit={setStep} />}
      </main>

      {/* ── Footer CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {error && (
            <p className="text-center text-xs font-bold text-red-600">{error}</p>
          )}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={goBack}
                className="flex h-14 items-center justify-center rounded-full border border-gray-300 bg-white px-6 text-sm font-bold uppercase tracking-widest text-black transition-all hover:border-black"
              >
                Atrás
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={goNext}
                disabled={!stepValid[step]}
                className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                  stepValid[step]
                    ? "bg-black text-white hover:bg-gray-800"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 disabled:opacity-50"
              >
                {publishing ? "Publicando…" : "Publicar evento"}
                <Zap className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const STEP_LABELS: Record<Step, string> = {
  1: "Datos básicos",
  2: "Lugar y fecha",
  3: "Cartel e info",
  4: "Entradas",
  5: "Revisar y publicar",
}

// ── Paso 1: Básico ──────────────────────────────────────────────────────────

function Step1Basic({
  draft,
  update,
}: {
  draft: EventDraft
  update: <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => void
}) {
  const [artistInput, setArtistInput] = useState("")

  const addArtist = () => {
    const name = artistInput.trim()
    if (!name || draft.artists.includes(name)) return
    update("artists", [...draft.artists, name])
    setArtistInput("")
  }

  const removeArtist = (name: string) =>
    update("artists", draft.artists.filter((a) => a !== name))

  const toggleGenre = (value: string) =>
    update(
      "genres",
      draft.genres.includes(value)
        ? draft.genres.filter((x) => x !== value)
        : [...draft.genres, value],
    )

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Qué estás
        <br />
        montando?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Empieza con lo básico: nombre, artistas y estilo.
      </p>

      {/* Título */}
      <div className="mt-10">
        <Label>Nombre del evento</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Ej: Night Waves · Sesión Electrónica"
            className="w-full bg-transparent text-lg font-black text-black placeholder:text-gray-300 focus:outline-none"
            maxLength={80}
          />
          <p className="mt-1 text-right text-[10px] font-semibold text-gray-400">
            {draft.title.length}/80
          </p>
        </div>
      </div>

      {/* Artistas */}
      <div className="mt-8">
        <Label>Artistas</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addArtist() }
              }}
              placeholder="Añadir artista y pulsar Enter"
              className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
            <button
              onClick={addArtist}
              disabled={!artistInput.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-all disabled:bg-gray-200 disabled:text-gray-400"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {draft.artists.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {draft.artists.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white"
                >
                  {a}
                  <button
                    onClick={() => removeArtist(a)}
                    aria-label={`Eliminar ${a}`}
                    className="ml-0.5 rounded-full hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Géneros */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <Label>Géneros musicales</Label>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {draft.genres.length} seleccionados
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GENRES.map(({ label, value }) => {
            const selected = draft.genres.includes(value)
            return (
              <button
                key={value}
                onClick={() => toggleGenre(value)}
                className={`flex items-center justify-between rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-black"
                }`}
              >
                <span>{label}</span>
                {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Paso 2: Lugar + fecha + hora ────────────────────────────────────────────

function Step2Place({
  draft,
  update,
}: {
  draft: EventDraft
  update: <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => void
}) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Dónde y
        <br />
        cuándo?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Define la ubicación exacta y la fecha del show.
      </p>

      {/* Sala / place */}
      <div className="mt-10">
        <Label>Sala / Place</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={draft.place}
              onChange={(e) => update("place", e.target.value)}
              placeholder="Ej: Sala Apolo"
              className="flex-1 bg-transparent text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Calle */}
      <div className="mt-4">
        <Label>Calle y número</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <input
            type="text"
            value={draft.street}
            onChange={(e) => update("street", e.target.value)}
            placeholder="Ej: Carrer Nou de la Rambla, 113"
            className="w-full bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Ciudad + País */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Ciudad</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <input
              type="text"
              value={draft.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Ej: Barcelona"
              className="w-full bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <Label>País</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <input
              type="text"
              value={draft.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="Ej: España"
              className="w-full bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Coordenadas */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Latitud</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.000001"
                value={draft.latitude}
                onChange={(e) => update("latitude", e.target.value)}
                placeholder="Ej: 41.375278"
                className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <Label>Longitud</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.000001"
                value={draft.longitude}
                onChange={(e) => update("longitude", e.target.value)}
                placeholder="Ej: 2.167778"
                className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fecha + Hora */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Fecha</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={draft.date}
                onChange={(e) => update("date", e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Hora</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => update("time", e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-black focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Franjas rápidas */}
      <div className="mt-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Horarios sugeridos
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => update("time", s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                draft.time === s
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Paso 3: Cartel + Descripción ────────────────────────────────────────────

function Step3Poster({
  draft,
  update,
}: {
  draft: EventDraft
  update: <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update("posterUrl", reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        Dale cara al
        <br />
        evento
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Sube el cartel y cuenta qué hace único este concierto.
      </p>

      {/* Upload */}
      <div className="mt-10">
        <Label>Cartel del evento</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {draft.posterUrl ? (
          <div className="mt-2 overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="relative aspect-[4/5] w-full sm:aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.posterUrl}
                alt="Cartel evento"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black"
              >
                <Upload className="h-3 w-3" />
                Reemplazar
              </button>
              <button
                onClick={() => update("posterUrl", null)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-all hover:border-black hover:text-black"
              >
                <Trash2 className="h-3 w-3" />
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-gray-300 bg-white py-14 transition-all hover:border-black hover:bg-gray-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Camera className="h-6 w-6 text-black" />
            </div>
            <p className="text-sm font-bold text-black">
              Haz click para subir el cartel
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              JPG, PNG · Recomendado 1200×1500px
            </p>
          </button>
        )}
      </div>

      {/* Descripción */}
      <div className="mt-8">
        <Label>Descripción</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Cuenta qué esperar del show
            </span>
          </div>
          <textarea
            value={draft.description}
            onChange={(e) => update("description", e.target.value.slice(0, 600))}
            placeholder="Un repaso a los temas clásicos con nueva banda, invitados sorpresa y visuales inéditos…"
            rows={6}
            className="w-full resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
          />
          <p className="mt-1 text-right text-[10px] font-semibold text-gray-400">
            {draft.description.length}/600
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Paso 4: Entradas ────────────────────────────────────────────────────────

function Step4Tickets({
  draft,
  update,
}: {
  draft: EventDraft
  update: <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => void
}) {
  const price = parseFloat(draft.price) || 0
  const capacity = parseInt(draft.capacity) || 0
  const grossRevenue = price * capacity

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        Precio y
        <br />
        aforo
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Define cuántas entradas pondrás a la venta y a qué precio.
      </p>

      {/* Precio */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Precio por entrada</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                min="0"
                step="0.5"
                value={draft.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-black text-black placeholder:text-gray-300 focus:outline-none"
              />
              <span className="text-lg font-bold text-gray-400">€</span>
            </div>
          </div>
        </div>

        <div>
          <Label>Aforo / Nº entradas</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                min="1"
                step="1"
                value={draft.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-black text-black placeholder:text-gray-300 focus:outline-none"
              />
              <span className="text-lg font-bold text-gray-400">pax</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proyección recaudación */}
      {grossRevenue > 0 && (
        <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Proyección máxima
          </p>
          <p className="mt-1 text-3xl font-black text-black">
            {grossRevenue.toLocaleString("es-ES")}€
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Si vendes el 100% del aforo
          </p>
        </div>
      )}

      {/* Nota sobre descuentos */}
      <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Flash Deal
        </p>
        <p className="mt-1 text-sm font-medium text-gray-600">
          Podrás activar descuentos y Flash Deals desde el panel de promotora
          una vez el evento esté publicado.
        </p>
      </div>
    </div>
  )
}

// ── Paso 5: Revisión ────────────────────────────────────────────────────────

function Step5Review({
  draft,
  onEdit,
}: {
  draft: EventDraft
  onEdit: (step: Step) => void
}) {
  const price = parseFloat(draft.price) || 0
  const capacity = parseInt(draft.capacity) || 0
  const gross = price * capacity
  const genreLabel = GENRES.find((g) => g.value === draft.genres[0])?.label ?? draft.genres[0]

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-black" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-black">
          Última revisión
        </span>
      </div>
      <h1 className="text-3xl font-black tracking-tight text-black md:text-4xl">
        Así lo verán
        <br />
        los fans
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Revisa los datos antes de publicar.
      </p>

      {/* Preview card */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white">
        {draft.posterUrl ? (
          <div className="relative aspect-[16/9] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.posterUrl}
              alt={draft.title}
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                {genreLabel ?? "Género"}
              </span>
              <h2 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                {draft.title || "Sin título"}
              </h2>
              <p className="mt-1 text-sm font-bold text-white/80">
                {draft.place || "Sin sala"} · {formatDate(draft.date)} · {draft.time || "--:--"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center bg-gray-50">
            <p className="text-sm font-bold text-gray-400">Sin cartel</p>
          </div>
        )}

        <div className="space-y-4 p-6">
          {draft.description && (
            <p className="text-sm leading-relaxed text-gray-700">{draft.description}</p>
          )}

          {draft.artists.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Artistas
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {draft.artists.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-black"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen editable */}
      <div className="mt-8 space-y-3">
        <SummaryRow
          icon={Tag}
          label="Datos básicos"
          value={`${draft.title || "—"} · ${draft.genres.length} géneros`}
          onEdit={() => onEdit(1)}
        />
        <SummaryRow
          icon={MapPin}
          label="Lugar y fecha"
          value={`${draft.place || "—"} · ${formatDate(draft.date)} ${draft.time || ""}`}
          onEdit={() => onEdit(2)}
        />
        <SummaryRow
          icon={Camera}
          label="Cartel e info"
          value={draft.posterUrl ? "Cartel subido" : "Sin cartel"}
          onEdit={() => onEdit(3)}
        />
        <SummaryRow
          icon={Ticket}
          label="Entradas"
          value={`${draft.capacity || 0} × ${draft.price || 0}€ = ${gross.toLocaleString("es-ES")}€`}
          onEdit={() => onEdit(4)}
        />
      </div>
    </div>
  )
}

// ── Sub-componentes ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {children}
    </label>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  onEdit,
}: {
  icon: React.ElementType
  label: string
  value: string
  onEdit: () => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-4 transition-all hover:border-black">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-50">
        <Icon className="h-4 w-4 text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-black">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black"
      >
        Editar
      </button>
    </div>
  )
}

// ── Utils ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(+d)) return iso
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
}
