"use client"

import { useEffect, useState, type JSX } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  TrendingUp,
  Users,
  Star,
  Euro,
  Ticket,
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Eye,
  BarChart3,
  Download,
  Percent,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import { ArtistsSection } from "@/components/promoter/artists-section"
import {
  getPromoterDashboard,
  getPromoterEvents,
  type PromoterDashboard,
  type PromoterEvent,
} from "@/lib/api/promoter"

type PromoterEventStatus = "draft" | "pending-review" | "published" | "live" | "completed" | "cancelled"

function toFrontendStatus(backendStatus: string): PromoterEventStatus {
  const map: Record<string, PromoterEventStatus> = {
    DRAFT:       "draft",
    PUBLISHED:   "published",
    LAST_MINUTE: "live",
    COMPLETED:   "completed",
    CANCELLED:   "cancelled",
  }
  return map[backendStatus] ?? "draft"
}

function formatEventDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("es-ES", {
      day: "numeric", month: "short", year: "numeric",
    }).toUpperCase()
  } catch {
    return isoDate
  }
}

// ── Helpers de estado ───────────────────────────────────────────────────────

const STATUS_META: Record<
  PromoterEventStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Borrador",
    className: "border-gray-300 bg-gray-100 text-gray-700",
  },
  "pending-review": {
    label: "En revisión",
    className: "border-black bg-white text-black",
  },
  published: {
    label: "Publicado",
    className: "border-black bg-black text-white",
  },
  live: {
    label: "En vivo",
    className: "border-black bg-black text-white",
  },
  completed: {
    label: "Finalizado",
    className: "border-gray-200 bg-gray-50 text-gray-500",
  },
  cancelled: {
    label: "Cancelado",
    className: "border-gray-300 bg-white text-gray-400",
  },
}

// ── Página ──────────────────────────────────────────────────────────────────

const EVENTS_PER_PAGE = 3

export default function PromoterHomePage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")
  const [eventsPage, setEventsPage] = useState(1)
  const [dashboard, setDashboard] = useState<PromoterDashboard | null>(null)
  const [events, setEvents] = useState<PromoterEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPromoterDashboard(), getPromoterEvents()])
      .then(([dash, evts]) => { setDashboard(dash); setEvents(evts) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // ── Historial filtrado ──
  const history = events
    .filter((e) => {
      const s = toFrontendStatus(e.status)
      if (filter === "upcoming") return ["published", "live"].includes(s)
      if (filter === "completed") return s === "completed"
      return true
    })
    .sort((a, b) => +new Date(b.eventDate) - +new Date(a.eventDate))

  const totalEventPages = Math.ceil(history.length / EVENTS_PER_PAGE)
  const pagedHistory = history.slice(
    (eventsPage - 1) * EVENTS_PER_PAGE,
    eventsPage * EVENTS_PER_PAGE,
  )

  const pendingEvents = events.filter((e) => toFrontendStatus(e.status) === "draft")

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-8">
          <p className="text-sm text-gray-500">Cargando dashboard…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-8">
        {/* Header */}
        <section className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Panel de promotora
            </p>
            <h1 className="mt-1 text-4xl font-black tracking-tight text-black md:text-5xl">
              Hola, {dashboard?.name ?? ""}
            </h1>
            <p className="mt-3 text-base text-gray-500">
              Gestiona tus eventos, revisa el rendimiento y publica nuevas
              fechas.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-lg">
            <Download className="h-3.5 w-3.5" />
            Exportar datos
          </button>
        </section>

        {/* ── KPI Stats ────────────────────────────────────── */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Euro}
            label="Recaudación total"
            value={`${(dashboard?.totalRevenue ?? 0).toLocaleString("es-ES")}€`}
            hint={`${dashboard?.totalEvents ?? 0} eventos`}
          />
          <KpiCard
            icon={Users}
            label="Asistentes totales"
            value={(dashboard?.totalAttendees ?? 0).toLocaleString("es-ES")}
            hint="asistentes totales"
          />
          <KpiCard
            icon={Star}
            label="Nota media"
            value={(dashboard?.averageRating ?? 0).toFixed(1)}
            suffix="/ 5"
            showStar
          />
          <KpiCard
            icon={Percent}
            label="Sell-through"
            value={`${(dashboard?.sellThrough ?? 0).toFixed(0)}%`}
            hint="% aforo vendido"
          />
        </section>

        {/* Secundarias */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <MiniStat
            icon={Ticket}
            label="Eventos activos"
            value={(dashboard?.activeEvents ?? 0).toString()}
          />
          <MiniStat
            icon={AlertCircle}
            label="Pendientes"
            value={(dashboard?.pendingEvents ?? 0).toString()}
          />
          <MiniStat
            icon={TrendingUp}
            label="Ticket medio"
            value={`${(dashboard?.avgTicketPrice ?? 0).toFixed(0)}€`}
          />
        </section>

        {/* ── Crear nuevo evento ───────────────────────────── */}
        <section className="mb-14">
          <Link
            href="/promoter/new-event"
            className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border-2 border-dashed border-black bg-white p-8 transition-all hover:bg-gray-50 hover:shadow-xl md:flex-row md:items-center"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-white transition-transform group-hover:rotate-90">
                <Plus className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Empieza ya
                </p>
                <h2 className="mt-1 text-3xl font-black text-black md:text-4xl">
                  Crear nuevo evento
                </h2>
                <p className="mt-1 max-w-lg text-sm font-medium text-gray-500">
                  Publica un nuevo concierto en minutos. Sube foto, define
                  aforo, precio y deja que GresK haga el resto.
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform group-hover:translate-x-1">
              Crear
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </section>

        {/* ── Eventos pendientes ───────────────────────────── */}
        {pendingEvents.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-black" />
              <h2 className="text-xl font-black text-black">
                Eventos pendientes
              </h2>
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                {pendingEvents.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingEvents.map((e) => (
                <PendingEventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* ── Historial ────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Historial
              </p>
              <h2 className="mt-1 text-2xl font-black text-black">
                Tus eventos
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              <FilterPill
                active={filter === "all"}
                onClick={() => { setFilter("all"); setEventsPage(1) }}
              >
                Todos
              </FilterPill>
              <FilterPill
                active={filter === "upcoming"}
                onClick={() => { setFilter("upcoming"); setEventsPage(1) }}
              >
                Próximos
              </FilterPill>
              <FilterPill
                active={filter === "completed"}
                onClick={() => { setFilter("completed"); setEventsPage(1) }}
              >
                Finalizados
              </FilterPill>
            </div>
          </div>

          <div className="space-y-4">
            {pagedHistory.map((event) => (
              <PromoterEventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Paginación eventos */}
          {totalEventPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
                disabled={eventsPage === 1}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black disabled:opacity-30"
              >
                ← Anterior
              </button>
              <span className="text-xs font-bold text-gray-500">
                {eventsPage} / {totalEventPages}
              </span>
              <button
                onClick={() => setEventsPage((p) => Math.min(totalEventPages, p + 1))}
                disabled={eventsPage === totalEventPages}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black disabled:opacity-30"
              >
                Siguiente →
              </button>
            </div>
          )}
        </section>

        {/* ── Artistas ─────────────────────────────────────── */}
        <section className="mt-14">
          <div className="mb-2 h-px w-full bg-gray-200" />
          <div className="mt-14">

            {/* CTA Añadir artista */}
            <div className="mb-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Artistas
              </p>
              <Link href="/promoter/artists/new" className="block">
                <div className="group flex items-center justify-between rounded-3xl border border-dashed border-gray-300 bg-white p-6 transition-all hover:border-black hover:bg-gray-50 hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-black text-black">Añadir nuevo artista</p>
                      <p className="text-sm text-gray-500">Gestiona tu cartera de artistas</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white sm:flex">
                    Añadir <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>

            <ArtistsSection />
          </div>
        </section>
      </main>
    </div>
  )
}

// ── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  trend,
  showStar = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  suffix?: string
  hint?: string
  trend?: string
  showStar?: boolean
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:border-black hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50">
          <Icon className="h-4 w-4 text-black" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-bold text-black">
            <TrendingUp className="h-2.5 w-2.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-black">{value}</span>
        {showStar && <Star className="h-4 w-4 fill-black text-black" />}
        {suffix && (
          <span className="text-sm font-semibold text-gray-500">{suffix}</span>
        )}
      </div>
      {hint && (
        <p className="mt-1 text-xs font-medium text-gray-500">{hint}</p>
      )}
    </div>
  )
}

// ── Mini Stat ───────────────────────────────────────────────────────────────

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </p>
        <p className="text-lg font-black text-black">{value}</p>
      </div>
    </div>
  )
}

// ── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PromoterEventStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}

// ── Pending Event Card ──────────────────────────────────────────────────────

function PendingEventCard({ event }: { event: PromoterEvent }) {
  const status = toFrontendStatus(event.status)
  const isDraft = status === "draft"
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border-2 border-dashed border-black bg-white p-4 transition-all hover:shadow-lg sm:flex-row sm:items-center">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
        {event.coverImageUrl && (
          <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover grayscale" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
        </div>
        <p className="mt-1 truncate text-base font-black text-black">
          {event.title}
        </p>
        <p className="truncate text-xs font-medium text-gray-500">
          {event.venue ?? event.city} · {formatEventDate(event.eventDate)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800">
          {isDraft ? "Publicar" : "Revisar"}
        </button>
      </div>
    </div>
  )
}

// ── Promoter Event Card (historial) ─────────────────────────────────────────

function PromoterEventCard({ event }: { event: PromoterEvent }) {
  const fillPct = event.totalCapacity > 0 ? (event.ticketsSold / event.totalCapacity) * 100 : 0
  const status = toFrontendStatus(event.status)
  const isCompleted = status === "completed"

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* Imagen */}
        <div className="relative h-40 w-full shrink-0 bg-gray-100 lg:h-auto lg:w-56">
          {event.coverImageUrl && (
            <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover grayscale" />
          )}
          <div className="absolute left-3 top-3">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Info + KPIs */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {event.genre}
              </p>
              <h3 className="mt-0.5 text-xl font-black leading-tight text-black">
                {event.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-black" />
                  <span className="font-semibold">{formatEventDate(event.eventDate)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-black" />
                  <span className="font-semibold">{event.venue ?? event.city}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-black" />
                  <span className="font-semibold">{event.price}€</span>
                </span>
              </div>
            </div>
          </div>

          {/* Barra de venta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-gray-500">
                {event.ticketsSold.toLocaleString("es-ES")} /{" "}
                {event.totalCapacity.toLocaleString("es-ES")} entradas
              </span>
              <span className="text-black">{Math.round(fillPct)}% vendido</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="absolute inset-y-0 left-0 bg-black transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          {/* KPIs inline */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <InlineStat
              icon={Euro}
              label="Recaudación"
              value={`${event.revenue.toLocaleString("es-ES")}€`}
            />
            <InlineStat
              icon={Users}
              label="Asistentes"
              value={event.ticketsSold.toLocaleString("es-ES")}
            />
            <InlineStat
              icon={BarChart3}
              label="Conversión"
              value={`${event.conversionRate != null ? event.conversionRate.toFixed(0) : Math.round(fillPct)}%`}
            />
            <InlineStat
              icon={Ticket}
              label="Capacidad"
              value={event.totalCapacity.toLocaleString("es-ES")}
            />
          </div>

          {/* Acciones */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black">
                <Eye className="h-3 w-3" />
                Ver público
              </button>
              {!isCompleted && (
                <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-all hover:border-black hover:text-black">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ── Inline Stat ─────────────────────────────────────────────────────────────

function InlineStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className="mt-0.5 text-sm font-black text-black">{value}</p>
    </div>
  )
}

// ── Filter Pill ─────────────────────────────────────────────────────────────

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
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

