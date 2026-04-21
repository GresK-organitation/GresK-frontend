"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  Mic2,
  Volume2,
  Users,
  Building2,
  ListMusic,
  Camera,
  Zap,
  Trophy,
  Check,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import {
  getUserAttendedEvents,
  submitReview,
  type AttendedEventResponse,
} from "@/lib/api/reviews"

type RatingsKey = "artista" | "sonido" | "ambiente" | "sala" | "repertorio"

const CATEGORIES: { key: RatingsKey; label: string; icon: React.ElementType }[] = [
  { key: "artista",   label: "Artista",    icon: Mic2 },
  { key: "sonido",    label: "Sonido",     icon: Volume2 },
  { key: "ambiente",  label: "Ambiente",   icon: Users },
  { key: "sala",      label: "Sala",       icon: Building2 },
  { key: "repertorio",label: "Repertorio", icon: ListMusic },
]

const BASE_POINTS   = 50
const BONUS_COMPLETE = 25
const BONUS_PHOTO   = 20

const ES_MONTHS_SHORT = [
  "ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC",
]

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return `${String(d.getDate()).padStart(2,"0")} ${ES_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export default function ReviewPage() {
  const params = useParams<{ id: string }>()
  const router  = useRouter()
  const ticketId = params.id

  const [event, setEvent]     = useState<AttendedEventResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [ratings, setRatings] = useState<Record<RatingsKey, number>>({
    artista: 0, sonido: 0, ambiente: 0, sala: 0, repertorio: 0,
  })
  const [comment,   setComment]   = useState("")
  const [photo,     setPhoto]     = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    getUserAttendedEvents()
      .then((list) => {
        const found = list.find((e) => e.ticketId === ticketId)
        if (!found || !found.pending) {
          setNotFound(true)
        } else {
          setEvent(found)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [ticketId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 pt-32 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Cargando…</p>
        </main>
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 pt-32 text-center md:px-8">
          <h1 className="text-3xl font-black text-black">Evento no encontrado</h1>
          <Link
            href="/my-events"
            className="mt-4 inline-block text-sm font-bold uppercase tracking-widest text-black underline"
          >
            Volver a mis eventos
          </Link>
        </main>
      </div>
    )
  }

  const allRated    = Object.values(ratings).every((r) => r > 0)
  const hasComment  = comment.trim().length > 0
  const completeBonus = allRated && hasComment ? BONUS_COMPLETE : 0
  const photoBonus  = photo ? BONUS_PHOTO : 0
  const totalPoints = BASE_POINTS + completeBonus + photoBonus

  async function handleSubmit() {
    if (!allRated || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitReview({
        ticketId: event!.ticketId,
        eventId:  event!.eventId,
        artistRating:   ratings.artista,
        soundRating:    ratings.sonido,
        ambienceRating: ratings.ambiente,
        venueRating:    ratings.sala,
        setlistRating:  ratings.repertorio,
        comment: comment.trim() || undefined,
        photoUrl: photo ?? undefined,
      })
      setSubmitted(true)
      setTimeout(() => router.push("/my-events"), 1800)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al enviar la valoración"
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-16 md:px-8">
        {/* Back */}
        <Link
          href="/my-events"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mis eventos
        </Link>

        {/* Header */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Post-Concert Review
          </p>
          <h1 className="mt-1 text-4xl font-black leading-tight tracking-tight text-black md:text-5xl">
            ¿Cómo fue la
            <br />
            experiencia?
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-500">
            <span className="font-bold text-black">{event.title}</span>
            {event.venue && <> · {event.venue}</>}
            {event.date && <> · {fmtDate(event.date)}</>}
          </p>
        </section>

        {/* Ratings */}
        <section className="mb-8 space-y-3">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-4 transition-all hover:border-black"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50">
                  <Icon className="h-4 w-4 text-black" />
                </div>
                <span className="text-sm font-bold text-black">{label}</span>
              </div>
              <InteractiveStars
                value={ratings[key]}
                onChange={(v) => setRatings({ ...ratings, [key]: v })}
              />
            </div>
          ))}
        </section>

        {/* Comentario */}
        <section className="mb-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Cuéntanos más{" "}
            <span className="text-gray-400 normal-case tracking-normal">(opcional)</span>
          </label>
          <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-4 transition-all focus-within:border-black">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              placeholder="¿Qué fue lo mejor de la noche?"
              rows={4}
              className="w-full resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              {hasComment && allRated ? (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black">
                  <Check className="h-3 w-3" />
                  +{BONUS_COMPLETE} pts bonus
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Feedback completo +{BONUS_COMPLETE} pts
                </span>
              )}
              <span className="text-[10px] font-semibold text-gray-400">
                {comment.length}/300
              </span>
            </div>
          </div>
        </section>

        {/* Foto */}
        <section className="mb-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Añade una foto{" "}
            <span className="text-gray-400 normal-case tracking-normal">(opcional)</span>
          </label>
          <button
            type="button"
            onClick={() => setPhoto(photo ? null : "https://example.com/photo-placeholder")}
            className={`mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-8 transition-all ${
              photo
                ? "border-black bg-gray-50"
                : "border-gray-300 bg-white hover:border-black hover:bg-gray-50"
            }`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${photo ? "bg-black" : "bg-gray-100"}`}>
              {photo ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <Camera className="h-5 w-5 text-black" />
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black">
              {photo ? "Foto añadida" : `+${BONUS_PHOTO} pts por foto validada`}
            </p>
          </button>
        </section>

        {/* Rewards card */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-black p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Recompensa
              </p>
              <p className="mt-1 text-xl font-black">
                Al enviar ganarás +{totalPoints} pts
              </p>
              {completeBonus > 0 && (
                <p className="mt-1 text-xs font-medium text-white/70">
                  Feedback completo:{" "}
                  <span className="font-bold text-white">+{completeBonus} pts extra</span>
                </p>
              )}
              {photoBonus > 0 && (
                <p className="text-xs font-medium text-white/70">
                  Foto validada:{" "}
                  <span className="font-bold text-white">+{photoBonus} pts extra</span>
                </p>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </div>
        </section>

        {/* Error */}
        {submitError && (
          <p className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center text-sm font-medium text-black">
            {submitError}
          </p>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allRated || submitted || submitting}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all ${
            submitted
              ? "bg-black text-white"
              : allRated
                ? "bg-black text-white hover:bg-gray-800 disabled:opacity-70"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          {submitted ? (
            <>
              <Check className="h-4 w-4" />
              Valoración enviada
            </>
          ) : submitting ? (
            "Enviando…"
          ) : (
            <>
              Enviar valoración y ganar puntos
              <Zap className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Gracias por formar parte de la comunidad GresK
        </p>
      </main>
    </div>
  )
}

// ── Interactive Stars ─────────────────────────────────────────────────────────

function InteractiveStars({ value, onChange }: {
  value: number; onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          className="transition-transform hover:scale-110"
          aria-label={`${i} estrellas`}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              i <= display ? "fill-black text-black" : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
