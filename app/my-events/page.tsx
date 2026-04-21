"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  ChevronDown,
  Mic2,
  Volume2,
  Users,
  Building2,
  ListMusic,
  Camera,
  Sparkles as SparklesIcon,
  Pencil,
  Share2,
  Download,
  Filter,
  X,
  Award,
  TrendingUp,
  Zap,
  Plus,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import {
  getUserAttendedEvents,
  updateReview,
  type AttendedEventResponse,
} from "@/lib/api/reviews"

// ── Tipo local ────────────────────────────────────────────────────────────────

interface AttendedEvent {
  id: string               // ticketId
  eventId: string
  title: string
  date: string             // "2026-04-05" ISO local date
  venue: string
  imageUrl: string
  genre: string
  userRating: number
  attendedAt: string       // same as date, ISO local date
  ratings: {
    artista: number
    sonido: number
    ambiente: number
    sala: number
    repertorio: number
  }
  comment?: string
  photoUrl?: string
  pointsEarned: number
  communityAvg: number
  pending?: boolean
  reviewId?: string
}

function mapResponse(r: AttendedEventResponse): AttendedEvent {
  return {
    id: r.ticketId,
    eventId: r.eventId,
    title: r.title,
    date: r.date ?? "",
    venue: r.venue ?? "",
    imageUrl: r.coverImageUrl ?? "",
    genre: r.genre ?? "",
    userRating: r.overallRating,
    attendedAt: r.date ?? "",
    ratings: {
      artista: r.artistRating,
      sonido: r.soundRating,
      ambiente: r.ambienceRating,
      sala: r.venueRating,
      repertorio: r.setlistRating,
    },
    comment: r.comment ?? undefined,
    photoUrl: r.photoUrl ?? undefined,
    pointsEarned: r.pointsAwarded,
    communityAvg: r.communityAvgRating,
    pending: r.pending,
    reviewId: r.reviewId ?? undefined,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const ES_MONTHS_SHORT = [
  "ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC",
]
const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]

function fmtDateDisplay(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return `${String(d.getDate()).padStart(2,"0")} ${ES_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

type SortKey = "recent" | "rating" | "points"

const CATEGORY_META = [
  { key: "artista" as const, label: "Artista", icon: Mic2 },
  { key: "sonido" as const, label: "Sonido", icon: Volume2 },
  { key: "ambiente" as const, label: "Ambiente", icon: Users },
  { key: "sala" as const, label: "Sala", icon: Building2 },
  { key: "repertorio" as const, label: "Repertorio", icon: ListMusic },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyEventsPage() {
  const [allEvents, setAllEvents] = useState<AttendedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>("recent")
  const [genreFilter, setGenreFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [editing, setEditing] = useState<AttendedEvent | null>(null)
  const [shareEvent, setShareEvent] = useState<AttendedEvent | null>(null)

  useEffect(() => {
    getUserAttendedEvents()
      .then((data) => setAllEvents(data.map(mapResponse)))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false))
  }, [])

  // ── Derivados ───────────────────────────────────────────────────────────
  const reviewed = allEvents.filter((e) => !e.pending)
  const pending  = allEvents.filter((e) => e.pending)

  const totalEvents = allEvents.length
  const avgRating = reviewed.length
    ? reviewed.reduce((acc, e) => acc + e.userRating, 0) / reviewed.length
    : 0
  const totalPoints = allEvents.reduce((a, e) => a + e.pointsEarned, 0)

  const insights = useMemo(() => {
    if (!reviewed.length) return null
    const catTotals: Record<string, { sum: number; count: number }> = {}
    CATEGORY_META.forEach(({ key }) => (catTotals[key] = { sum: 0, count: 0 }))
    reviewed.forEach((e) => {
      CATEGORY_META.forEach(({ key }) => {
        catTotals[key].sum += e.ratings[key]
        catTotals[key].count += 1
      })
    })
    const catAvgs = Object.entries(catTotals).map(([k, v]) => ({
      key: k,
      avg: v.sum / v.count,
    }))
    const mostDemanding = catAvgs.reduce((a, b) => (a.avg < b.avg ? a : b))

    const venueCounts: Record<string, number> = {}
    reviewed.forEach((e) => {
      venueCounts[e.venue] = (venueCounts[e.venue] || 0) + 1
    })
    const favVenue = Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0]

    const genreCounts: Record<string, number> = {}
    reviewed.forEach((e) => {
      const main = e.genre.split("/")[0].trim()
      genreCounts[main] = (genreCounts[main] || 0) + 1
    })
    const favGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      mostDemanding: {
        label: CATEGORY_META.find((c) => c.key === mostDemanding.key)?.label ?? "",
        avg: mostDemanding.avg,
      },
      favVenue: { name: favVenue[0], visits: favVenue[1] },
      favGenre: favGenre[0],
    }
  }, [reviewed])

  const availableGenres = useMemo(() => {
    const set = new Set<string>()
    allEvents.forEach((e) => set.add(e.genre.split("/")[0].trim()))
    return Array.from(set)
  }, [allEvents])

  const availableYears = useMemo(() => {
    const set = new Set<string>()
    allEvents.forEach((e) => e.attendedAt && set.add(e.attendedAt.slice(0, 4)))
    return Array.from(set).sort((a, b) => +b - +a)
  }, [allEvents])

  const filtered = reviewed.filter((e) => {
    if (genreFilter !== "all" && !e.genre.toLowerCase().startsWith(genreFilter.toLowerCase()))
      return false
    if (yearFilter !== "all" && !e.attendedAt.startsWith(yearFilter)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "rating") return b.userRating - a.userRating
    if (sort === "points") return b.pointsEarned - a.pointsEarned
    return +new Date(b.attendedAt) - +new Date(a.attendedAt)
  })

  const grouped = useMemo(() => {
    const map = new Map<string, AttendedEvent[]>()
    sorted.forEach((e) => {
      const d = new Date(e.attendedAt + "T00:00:00")
      const key = `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    })
    return Array.from(map.entries())
  }, [sorted])

  const uniqueVenues = useMemo(() => {
    const map = new Map<string, number>()
    reviewed.forEach((e) => map.set(e.venue, (map.get(e.venue) || 0) + 1))
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [reviewed])

  function handleEditSaved(updated: AttendedEvent) {
    setAllEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    )
    setEditing(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pt-32 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Cargando historial…
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 md:px-8">
        {/* Header */}
        <section className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Historial
            </p>
            <h1 className="mt-1 text-4xl font-black tracking-tight text-black md:text-5xl">
              Mis eventos
            </h1>
            <p className="mt-3 text-base text-gray-500">
              Todos los eventos a los que has asistido y tus valoraciones.
            </p>
          </div>
          <button
            onClick={() => alert("Exportando historial…")}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-lg"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar historial
          </button>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Asistidos" value={totalEvents.toString()} suffix="eventos" />
          <StatCard
            label="Nota media"
            value={avgRating.toFixed(1)}
            suffix="/ 5"
            showStar
          />
          <StatCard label="Puntos ganados" value={totalPoints.toString()} suffix="pts" />
          <StatCard label="Género top" value={insights?.favGenre ?? "—"} suffix="" />
        </section>

        {/* Insights personales */}
        {insights && (
          <section className="mb-10 grid gap-4 sm:grid-cols-3">
            <InsightCard
              icon={TrendingUp}
              label="Más exigente con"
              value={insights.mostDemanding.label}
              hint={`Media ${insights.mostDemanding.avg.toFixed(1)} / 5`}
            />
            <InsightCard
              icon={Building2}
              label="Sala favorita"
              value={insights.favVenue.name}
              hint={`${insights.favVenue.visits} visita${insights.favVenue.visits > 1 ? "s" : ""}`}
            />
            <InsightCard
              icon={Award}
              label="Reviews completadas"
              value={`${reviewed.length} reviews`}
              hint="Con comentario y fotos"
            />
          </section>
        )}

        {/* Pendientes de valorar */}
        {pending.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-black" />
              <h2 className="text-xl font-black text-black">Pendientes de valorar</h2>
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            </div>
            <div className="space-y-3">
              {pending.map((e) => (
                <PendingCard key={e.id} event={e} fmtDate={fmtDateDisplay} />
              ))}
            </div>
          </section>
        )}

        {/* Filtros + orden */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-black">Historial de asistencia</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                filtersOpen || genreFilter !== "all" || yearFilter !== "all"
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
              }`}
            >
              <Filter className="h-3 w-3" />
              Filtros
            </button>
            <SortButton active={sort === "recent"} onClick={() => setSort("recent")}>
              Recientes
            </SortButton>
            <SortButton active={sort === "rating"} onClick={() => setSort("rating")}>
              Mejor nota
            </SortButton>
            <SortButton active={sort === "points"} onClick={() => setSort("points")}>
              Más puntos
            </SortButton>
          </div>
        </section>

        {/* Panel de filtros */}
        {filtersOpen && (
          <section className="mb-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Género
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip active={genreFilter === "all"} onClick={() => setGenreFilter("all")}>
                    Todos
                  </Chip>
                  {availableGenres.map((g) => (
                    <Chip key={g} active={genreFilter === g} onClick={() => setGenreFilter(g)}>
                      {g}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Año
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip active={yearFilter === "all"} onClick={() => setYearFilter("all")}>
                    Todos
                  </Chip>
                  {availableYears.map((y) => (
                    <Chip key={y} active={yearFilter === y} onClick={() => setYearFilter(y)}>
                      {y}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline agrupada */}
        <section>
          {allEvents.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <p className="mt-4 text-lg font-black text-black">Sin eventos</p>
              <p className="mt-1 text-sm text-gray-500">
                Compra una entrada para empezar tu historial.
              </p>
              <Link
                href="/feed"
                className="mt-5 inline-flex items-center gap-1 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800"
              >
                <Plus className="h-3 w-3" />
                Descubrir eventos
              </Link>
            </div>
          ) : grouped.length === 0 ? (
            <EmptyState onReset={() => { setGenreFilter("all"); setYearFilter("all") }} />
          ) : (
            <div className="space-y-10">
              {grouped.map(([month, events]) => (
                <div key={month}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {month}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <AttendedCard
                        key={event.id}
                        event={event}
                        fmtDate={fmtDateDisplay}
                        onEdit={() => setEditing(event)}
                        onShare={() => setShareEvent(event)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mapa de venues visitados */}
        {uniqueVenues.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Tu mapa
              </p>
              <h2 className="mt-1 text-2xl font-black text-black">Salas visitadas</h2>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: "radial-gradient(circle, #D4D4D8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {uniqueVenues.map(([venue, visits]) => (
                  <div
                    key={venue}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-black">{venue}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        {visits} visita{visits > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {editing && (
        <EditReviewModal
          event={editing}
          onClose={() => setEditing(null)}
          onSaved={handleEditSaved}
        />
      )}
      {shareEvent && (
        <ShareReviewModal event={shareEvent} onClose={() => setShareEvent(null)} />
      )}
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, suffix, showStar = false,
}: {
  label: string; value: string; suffix: string; showStar?: boolean
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="truncate text-3xl font-black text-black">{value}</span>
        {showStar && <Star className="h-4 w-4 fill-black text-black" />}
        {suffix && <span className="text-sm font-semibold text-gray-500">{suffix}</span>}
      </div>
    </div>
  )
}

// ── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  icon: Icon, label, value, hint,
}: {
  icon: React.ElementType; label: string; value: string; hint: string
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:border-black hover:shadow-lg">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-black" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      </div>
      <p className="mt-2 truncate text-lg font-black text-black">{value}</p>
      <p className="text-xs font-medium text-gray-500">{hint}</p>
    </div>
  )
}

// ── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  )
}

// ── Sort Button ──────────────────────────────────────────────────────────────

function SortButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  )
}

// ── Pending Card ─────────────────────────────────────────────────────────────

function PendingCard({
  event, fmtDate,
}: {
  event: AttendedEvent; fmtDate: (d: string) => string
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-black bg-white p-4 transition-all hover:shadow-lg">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover grayscale" />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {fmtDate(event.date)}
        </p>
        <p className="truncate text-sm font-black text-black">{event.title}</p>
        <p className="truncate text-xs font-medium text-gray-500">{event.venue}</p>
      </div>
      <Link
        href={`/my-events/${event.id}/review`}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800"
      >
        Valorar
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-black text-black">
          +50 pts
        </span>
      </Link>
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
        <Calendar className="h-5 w-5 text-black" />
      </div>
      <p className="mt-4 text-lg font-black text-black">Sin resultados</p>
      <p className="mt-1 text-sm text-gray-500">
        Prueba a cambiar los filtros o descubre nuevos eventos.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:border-black"
        >
          Limpiar filtros
        </button>
        <Link
          href="/feed"
          className="flex items-center gap-1 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800"
        >
          <Plus className="h-3 w-3" />
          Descubrir eventos
        </Link>
      </div>
    </div>
  )
}

// ── Attended Event Card ──────────────────────────────────────────────────────

function AttendedCard({
  event, fmtDate, onEdit, onShare,
}: {
  event: AttendedEvent
  fmtDate: (d: string) => string
  onEdit: () => void
  onShare: () => void
}) {
  const [open, setOpen] = useState(false)
  const diff = event.userRating - event.communityAvg
  const diffLabel = diff > 0.2 ? "Por encima" : diff < -0.2 ? "Por debajo" : "En línea"

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-black">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
          {event.imageUrl ? (
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover grayscale" />
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
            Asistido
          </span>
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {event.photoUrl && (
              <span className="flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <Camera className="h-3 w-3" />
                Foto
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {event.genre}
              </p>
              <h3 className="mt-0.5 text-xl font-black leading-tight text-black">
                {event.title}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Tu nota
              </p>
              <div className="mt-0.5 flex items-center justify-end gap-1">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="text-lg font-black text-black">{event.userRating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-black" />
              <span className="font-medium">{fmtDate(event.date)}</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-black" />
              <span className="font-medium">{event.venue}</span>
            </p>
          </div>

          <ComparatorBar userValue={event.userRating} communityValue={event.communityAvg} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
              <SparklesIcon className="h-3 w-3" />
              +{event.pointsEarned} pts
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              {diffLabel}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:text-gray-600"
              aria-expanded={open}
            >
              {open ? "Ocultar" : "Ver mi valoración"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              href={`/events/${event.eventId}`}
              className="flex items-center gap-1 text-sm font-semibold text-black transition-transform group-hover:translate-x-1"
            >
              Ver evento <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ReviewDetails event={event} onEdit={onEdit} onShare={onShare} />
        </div>
      </div>
    </article>
  )
}

// ── Comparator Bar ───────────────────────────────────────────────────────────

function ComparatorBar({ userValue, communityValue }: {
  userValue: number; communityValue: number
}) {
  const userPct = (userValue / 5) * 100
  const commPct = (communityValue / 5) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-black">Tú {userValue.toFixed(1)}</span>
        <span className="text-gray-500">Comunidad {communityValue.toFixed(1)}</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-black"
          style={{ width: `${userPct}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-gray-500"
          style={{ left: `${commPct}%` }}
        />
      </div>
    </div>
  )
}

// ── Review Details ───────────────────────────────────────────────────────────

function ReviewDetails({ event, onEdit, onShare }: {
  event: AttendedEvent; onEdit: () => void; onShare: () => void
}) {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Tu valoración detallada
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black hover:border-black"
          >
            <Share2 className="h-3 w-3" />
            Compartir
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black hover:border-black"
          >
            <Pencil className="h-3 w-3" />
            Editar
          </button>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {CATEGORY_META.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-black" />
              <span className="text-xs font-semibold text-black">{label}</span>
            </div>
            <StarRow value={event.ratings[key]} />
          </div>
        ))}
      </div>

      {event.comment && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Tu comentario
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-800">
            &ldquo;{event.comment}&rdquo;
          </p>
        </div>
      )}

      {event.photoUrl && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Tu foto
          </p>
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-gray-200 sm:w-64">
            <Image
              src={event.photoUrl}
              alt={`Foto de ${event.title}`}
              fill
              className="object-cover grayscale"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= value ? "fill-black text-black" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

// ── Edit Review Modal ────────────────────────────────────────────────────────

function EditReviewModal({
  event, onClose, onSaved,
}: {
  event: AttendedEvent
  onClose: () => void
  onSaved: (updated: AttendedEvent) => void
}) {
  const [comment, setComment] = useState(event.comment ?? "")
  const [ratings, setRatings] = useState(event.ratings)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!event.reviewId) return
    setSaving(true)
    try {
      await updateReview(event.reviewId, {
        artistRating: ratings.artista,
        soundRating: ratings.sonido,
        ambienceRating: ratings.ambiente,
        venueRating: ratings.sala,
        setlistRating: ratings.repertorio,
        comment: comment || undefined,
      })
      onSaved({
        ...event,
        ratings,
        comment: comment || undefined,
        userRating: Math.round(
          (ratings.artista + ratings.sonido + ratings.ambiente +
           ratings.sala + ratings.repertorio) / 5
        ),
      })
    } catch {
      // keep modal open on error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white hover:border-black"
        >
          <X className="h-4 w-4 text-black" />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Editar valoración
        </p>
        <h3 className="mt-1 text-2xl font-black text-black">{event.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{event.venue}</p>

        <div className="mt-6 space-y-2.5">
          {CATEGORY_META.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-black" />
                <span className="text-xs font-semibold text-black">{label}</span>
              </div>
              <InteractiveStarRow
                value={ratings[key]}
                onChange={(v) => setRatings({ ...ratings, [key]: v })}
              />
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Comentario
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            placeholder="¿Qué fue lo mejor de la noche?"
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white p-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
          />
          <p className="mt-1 text-right text-[10px] font-semibold text-gray-400">
            {comment.length}/300
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:border-black"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}

function InteractiveStarRow({ value, onChange }: {
  value: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => onChange(i)} type="button">
          <Star
            className={`h-4 w-4 transition-colors ${
              i <= value ? "fill-black text-black" : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ── Share Review Modal ───────────────────────────────────────────────────────

function ShareReviewModal({ event, onClose }: {
  event: AttendedEvent; onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur hover:border-white"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover opacity-40 grayscale"
            />
          )}
          <div className="relative flex h-full flex-col justify-between p-6 text-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                GresK · Review
              </p>
              <h3 className="mt-2 text-3xl font-black leading-tight">{event.title}</h3>
              <p className="mt-1 text-sm font-medium text-white/80">{event.venue}</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i <= event.userRating ? "fill-white text-white" : "text-white/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-3xl font-black">{event.userRating}</span>
                <span className="text-lg font-bold text-white/60">/5</span>
              </div>
              {event.comment && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/90">
                  &ldquo;{event.comment}&rdquo;
                </p>
              )}
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                gresk.app
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 p-4">
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:border-black"
          >
            Cerrar
          </button>
          <button
            onClick={() => alert("Imagen descargada")}
            className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800"
          >
            <Download className="h-3 w-3" />
            Descargar
          </button>
        </div>
      </div>
    </div>
  )
}
