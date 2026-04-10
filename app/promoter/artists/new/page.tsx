"use client"

import { useRef, useState } from "react"
import { createArtist } from "@/lib/api/artists"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Plus,
  Check,
  ArrowRight,
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
  Mail,
  Link2,
  ExternalLink,
  Star,
  Pencil,
} from "lucide-react"

// ── Datos ────────────────────────────────────────────────────────────────────

const GENRES = [
  "Rock", "Indie", "Pop", "Electrónica", "Techno",
  "House", "Jazz", "Hip-Hop", "Folk", "Metal",
  "Funk", "Soul", "Flamenco", "Experimental", "Reggae",
  "Classical", "Ambient", "Dream Pop", "Shoegaze", "R&B",
]

const STATUS_OPTIONS = [
  { value: "available", label: "Disponible", hint: "Puede ser contratado ahora" },
  { value: "negotiating", label: "Negociando", hint: "En conversaciones activas" },
  { value: "confirmed", label: "Confirmado", hint: "Fecha cerrada" },
  { value: "inactive", label: "Inactivo", hint: "Sin actividad reciente" },
]

const TAG_SUGGESTIONS = [
  "directo potente", "rider sencillo", "bilingüe", "gran formato",
  "festival", "íntimo", "banda propia", "DJ set", "acústico",
  "experiencia", "versátil", "exclusividad",
]

type Step = 1 | 2 | 3 | 4

interface ArtistDraft {
  name: string
  origin: string
  genres: string[]
  bio: string
  status: string
  fee: string
  contact: string
  socialSpotify: string
  socialInstagram: string
  followers: string
  imageUrl: string | null
  tags: string[]
}

const STEP_LABELS: Record<Step, string> = {
  1: "Identidad",
  2: "Info profesional",
  3: "Contacto y redes",
  4: "Revisar y guardar",
}

// ── Página ───────────────────────────────────────────────────────────────────

export default function NewArtistPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [draft, setDraft] = useState<ArtistDraft>({
    name: "",
    origin: "",
    genres: [],
    bio: "",
    status: "available",
    fee: "",
    contact: "",
    socialSpotify: "",
    socialInstagram: "",
    followers: "",
    imageUrl: null,
    tags: [],
  })

  const update = <K extends keyof ArtistDraft>(k: K, v: ArtistDraft[K]) =>
    setDraft((p) => ({ ...p, [k]: v }))

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const progress = (step / 4) * 100
  const goBack = () => step > 1 && setStep((step - 1) as Step)
  const goNext = () => step < 4 && setStep((step + 1) as Step)

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await createArtist({
        name: draft.name,
        origin: draft.origin,
        genres: draft.genres,
        imageUrl: draft.imageUrl,
        bio: draft.bio,
        status: draft.status,
        fee: draft.fee,
        followers: draft.followers,
        contact: draft.contact,
        socialSpotify: draft.socialSpotify,
        socialInstagram: draft.socialInstagram,
        tags: draft.tags,
      })
      router.push("/promoter")
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Error al guardar el artista")
    } finally {
      setSaving(false)
    }
  }

  const stepValid: Record<Step, boolean> = {
    1: draft.name.trim().length > 0 && draft.genres.length > 0,
    2: draft.bio.trim().length > 0 && draft.status !== "",
    3: draft.contact.trim().length > 0,
    4: true,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header sticky */}
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
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Paso {step} de 4 · {STEP_LABELS[step]}
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

      {/* Contenido */}
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        {step === 1 && <Step1Identity draft={draft} update={update} />}
        {step === 2 && <Step2Professional draft={draft} update={update} />}
        {step === 3 && <Step3Contact draft={draft} update={update} />}
        {step === 4 && <Step4Review draft={draft} onEdit={setStep} />}
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex h-14 items-center justify-center rounded-full border border-gray-300 bg-white px-6 text-sm font-bold uppercase tracking-widest text-black transition-all hover:border-black"
            >
              Atrás
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={goNext}
              disabled={!stepValid[step]}
              className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                stepValid[step]
                  ? "bg-black text-white hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-1 flex-col gap-2">
              {saveError && (
                <p className="text-center text-xs font-semibold text-red-600">
                  {saveError}
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Guardando…" : <>Guardar artista <Zap className="h-4 w-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Paso 1: Identidad ────────────────────────────────────────────────────────

function Step1Identity({
  draft, update,
}: {
  draft: ArtistDraft
  update: <K extends keyof ArtistDraft>(k: K, v: ArtistDraft[K]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleGenre = (g: string) =>
    update("genres", draft.genres.includes(g)
      ? draft.genres.filter((x) => x !== g)
      : [...draft.genres, g])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update("imageUrl", reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Quién es el<br />artista?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Nombre, foto y géneros que lo definen.
      </p>

      {/* Foto */}
      <div className="mt-10 flex items-start gap-5">
        <div className="shrink-0">
          <Label>Foto</Label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all ${
              draft.imageUrl
                ? "border-black"
                : "border-dashed border-gray-300 bg-gray-50 hover:border-black"
            }`}
          >
            {draft.imageUrl ? (
              <>
                <Image src={draft.imageUrl} alt="Artista" fill className="object-cover grayscale" unoptimized />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </>
            ) : (
              <Camera className="h-6 w-6 text-gray-400" />
            )}
          </button>
          {draft.imageUrl && (
            <button
              onClick={() => update("imageUrl", null)}
              className="mt-1 w-full text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black"
            >
              Quitar
            </button>
          )}
        </div>

        {/* Nombre + origen */}
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <Label>Nombre artístico</Label>
            <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
              <input
                type="text"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ej: Noa Vidal"
                maxLength={60}
                className="w-full bg-transparent text-lg font-black text-black placeholder:text-gray-300 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <Label>Ciudad / Origen</Label>
            <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  type="text"
                  value={draft.origin}
                  onChange={(e) => update("origin", e.target.value)}
                  placeholder="Ej: Barcelona, ES"
                  className="flex-1 bg-transparent text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {GENRES.map((g) => {
            const sel = draft.genres.includes(g)
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`flex items-center justify-between rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                  sel
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-black"
                }`}
              >
                <span>{g}</span>
                {sel ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Paso 2: Info profesional ─────────────────────────────────────────────────

function Step2Professional({
  draft, update,
}: {
  draft: ArtistDraft
  update: <K extends keyof ArtistDraft>(k: K, v: ArtistDraft[K]) => void
}) {
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    const t = tagInput.trim()
    if (!t || draft.tags.includes(t)) return
    update("tags", [...draft.tags, t])
    setTagInput("")
  }

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        Perfil<br />profesional
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Biografía, estado, caché y etiquetas para tu equipo.
      </p>

      {/* Biografía */}
      <div className="mt-10">
        <Label>Biografía</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <textarea
            value={draft.bio}
            onChange={(e) => update("bio", e.target.value.slice(0, 600))}
            placeholder="Cuarteto barcelonés que mezcla… su tercer LP llega este otoño…"
            rows={5}
            className="w-full resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
          />
          <p className="mt-1 text-right text-[10px] font-semibold text-gray-400">
            {draft.bio.length}/600
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-8">
        <Label>Estado</Label>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => update("status", s.value)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                draft.status === s.value
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-black hover:border-black"
              }`}
            >
              <div>
                <p className="text-sm font-black">{s.label}</p>
                <p className={`text-xs ${draft.status === s.value ? "text-white/70" : "text-gray-500"}`}>
                  {s.hint}
                </p>
              </div>
              {draft.status === s.value && <Check className="h-5 w-5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Caché + Seguidores */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Caché aproximado</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={draft.fee}
                onChange={(e) => update("fee", e.target.value)}
                placeholder="500–1.500€"
                className="flex-1 bg-transparent text-sm font-black text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <Label>Seguidores (aprox.)</Label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={draft.followers}
                onChange={(e) => update("followers", e.target.value)}
                placeholder="12.4K"
                className="flex-1 bg-transparent text-sm font-black text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-8">
        <Label>Etiquetas internas</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              placeholder="Ej: rider sencillo, versátil…"
              className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
            <button onClick={addTag} disabled={!tagInput.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white disabled:bg-gray-200 disabled:text-gray-400"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {draft.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.tags.map((t) => (
                <span key={t} className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">
                  {t}
                  <button onClick={() => update("tags", draft.tags.filter((x) => x !== t))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Sugerencias */}
        <div className="mt-3 flex flex-wrap gap-2">
          {TAG_SUGGESTIONS.filter((t) => !draft.tags.includes(t)).map((t) => (
            <button key={t} onClick={() => update("tags", [...draft.tags, t])}
              className="rounded-full border border-dashed border-gray-300 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-500 hover:border-black hover:text-black"
            >
              + {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Paso 3: Contacto + redes ─────────────────────────────────────────────────

function Step3Contact({
  draft, update,
}: {
  draft: ArtistDraft
  update: <K extends keyof ArtistDraft>(k: K, v: ArtistDraft[K]) => void
}) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        Contacto<br />y redes
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Email de contacto o manager y enlaces a sus plataformas.
      </p>

      {/* Email */}
      <div className="mt-10">
        <Label>Email de contacto / Manager *</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={draft.contact}
              onChange={(e) => update("contact", e.target.value)}
              placeholder="manager@artista.com"
              className="flex-1 bg-transparent text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Redes */}
      <div className="mt-8 space-y-4">
        <Label>Redes sociales (opcional)</Label>
        <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={draft.socialInstagram}
              onChange={(e) => update("socialInstagram", e.target.value)}
              placeholder="https://instagram.com/artista"
              className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={draft.socialSpotify}
              onChange={(e) => update("socialSpotify", e.target.value)}
              placeholder="https://open.spotify.com/artist/…"
              className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Info de privacidad */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-xs font-medium leading-relaxed text-gray-500">
          <span className="font-bold text-black">Solo tú verás esta información.</span>{" "}
          Los datos de contacto y el caché son privados y no se muestran al público en GresK.
        </p>
      </div>
    </div>
  )
}

// ── Paso 4: Revisión ─────────────────────────────────────────────────────────

function Step4Review({
  draft, onEdit,
}: {
  draft: ArtistDraft
  onEdit: (s: Step) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-black" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-black">
          Última revisión
        </span>
      </div>
      <h1 className="text-3xl font-black tracking-tight text-black md:text-4xl">
        Así quedará<br />el artista
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Revisa antes de guardar.
      </p>

      {/* Preview card */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white">
        <div className="flex items-start gap-5 p-6">
          {draft.imageUrl ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200">
              <Image src={draft.imageUrl} alt={draft.name} fill className="object-cover grayscale" unoptimized />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
              <Camera className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-2xl font-black text-black">
                {draft.name || "Sin nombre"}
              </h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="text-lg font-black text-black">—</span>
              </div>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {draft.origin || "Sin ubicación"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {draft.genres.map((g) => (
                <span key={g} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-700">{g}</span>
              ))}
            </div>
          </div>
        </div>
        {draft.bio && (
          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-sm leading-relaxed text-gray-600">{draft.bio}</p>
          </div>
        )}
      </div>

      {/* Resumen editable */}
      <div className="mt-8 space-y-3">
        <SummaryRow icon={Music2} label="Identidad" value={`${draft.name || "—"} · ${draft.genres.length} géneros`} onEdit={() => onEdit(1)} />
        <SummaryRow icon={Star} label="Perfil profesional" value={`${draft.status} · ${draft.fee || "Sin caché"} · ${draft.tags.length} etiquetas`} onEdit={() => onEdit(2)} />
        <SummaryRow icon={Mail} label="Contacto y redes" value={draft.contact || "—"} onEdit={() => onEdit(3)} />
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {children}
    </label>
  )
}

function SummaryRow({
  icon: Icon, label, value, onEdit,
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
      <button onClick={onEdit} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black">
        <Pencil className="inline h-3 w-3" /> Editar
      </button>
    </div>
  )
}
