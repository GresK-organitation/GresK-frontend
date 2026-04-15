"use client"

import { useMemo, useState } from "react"
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
  MOCK_PROMOTER_EVENTS,
  type PromoterEvent,
  type PromoterEventStatus,
} from "@/lib/mock-data"

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

  const events = MOCK_PROMOTER_EVENTS

  // ── KPIs ──
  const completed = events.filter((e) => e.status === "completed")
  const upcoming = events.filter((e) =>
    ["published", "live", "pending-review"].includes(e.status),
  )
  const pending = events.filter((e) =>
    ["draft", "pending-review"].includes(e.status),
  )

  const totalRevenue = events.reduce((a, e) => a + e.revenue, 0)
  const totalAttendees = completed.reduce((a, e) => a + e.ticketsSold, 0)
  const ratedEvents = completed.filter((e) => e.reviewsCount > 0)
  const avgRating = ratedEvents.length
    ? ratedEvents.reduce((a, e) => a + e.avgRating, 0) / ratedEvents.length
    : 0
  const totalReviews = completed.reduce((a, e) => a + e.reviewsCount, 0)

  const sellThrough = useMemo(() => {
    const publishedAndDone = events.filter((e) =>
      ["published", "live", "completed"].includes(e.status),
    )
    const sold = publishedAndDone.reduce((a, e) => a + e.ticketsSold, 0)
    const cap = publishedAndDone.reduce((a, e) => a + e.capacity, 0)
    return cap ? (sold / cap) * 100 : 0
  }, [events])

  const activeEvents = events.filter(
    (e) => !["draft", "completed", "cancelled"].includes(e.status),
  ).length

  // ── Historial filtrado ──
  const history = events
    .filter((e) => {
      if (filter === "upcoming")
        return ["published", "live", "pending-review"].includes(e.status)
      if (filter === "completed") return e.status === "completed"
      return true
    })
    .sort((a, b) => +new Date(b.dateIso) - +new Date(a.dateIso))

  const totalEventPages = Math.ceil(history.length / EVENTS_PER_PAGE)
  const pagedHistory = history.slice(
    (eventsPage - 1) * EVENTS_PER_PAGE,
    eventsPage * EVENTS_PER_PAGE,
  )

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
              Hola, Night Waves
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
            value={`${totalRevenue.toLocaleString("es-ES")}€`}
            hint={`${events.length} eventos`}
            trend="+12%"
          />
          <KpiCard
            icon={Users}
            label="Asistentes totales"
            value={totalAttendees.toLocaleString("es-ES")}
            hint={`${completed.length} eventos finalizados`}
            trend="+8%"
          />
          <KpiCard
            icon={Star}
            label="Nota media"
            value={avgRating.toFixed(1)}
            suffix="/ 5"
            hint={`${totalReviews} reviews`}
            showStar
          />
          <KpiCard
            icon={Percent}
            label="Sell-through"
            value={`${sellThrough.toFixed(0)}%`}
            hint="% aforo vendido"
            trend="+5%"
          />
        </section>

        {/* Secundarias */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <MiniStat
            icon={Ticket}
            label="Eventos activos"
            value={activeEvents.toString()}
          />
          <MiniStat
            icon={AlertCircle}
            label="Pendientes"
            value={pending.length.toString()}
          />
          <MiniStat
            icon={TrendingUp}
            label="Ticket medio"
            value={`${completed.length ? Math.round(totalRevenue / totalAttendees) : 0}€`}
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
        {pending.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-black" />
              <h2 className="text-xl font-black text-black">
                Eventos pendientes
              </h2>
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            </div>
            <div className="space-y-3">
              {pending.map((e) => (
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
  const isDraft = event.status === "draft"
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border-2 border-dashed border-black bg-white p-4 transition-all hover:shadow-lg sm:flex-row sm:items-center">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover grayscale"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={event.status} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Creado {event.createdAt}
          </p>
        </div>
        <p className="mt-1 truncate text-base font-black text-black">
          {event.title}
        </p>
        <p className="truncate text-xs font-medium text-gray-500">
          {event.venue} · {event.date}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/promoter/events/${event.id}`}
          className="rounded-full border border-gray-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black"
        >
          <Pencil className="inline h-3 w-3" /> Editar
        </Link>
        <button className="rounded-full bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800">
          {isDraft ? "Publicar" : "Revisar"}
        </button>
      </div>
    </div>
  )
}

// ── Promoter Event Card (historial) ─────────────────────────────────────────

function PromoterEventCard({ event }: { event: PromoterEvent }) {
  const fillPct = (event.ticketsSold / event.capacity) * 100
  const isCompleted = event.status === "completed"

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* Imagen */}
        <div className="relative h-40 w-full shrink-0 lg:h-auto lg:w-56">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover grayscale"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={event.status} />
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
                  <span className="font-semibold">{event.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-black" />
                  <span className="font-semibold">{event.venue}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-black" />
                  <span className="font-semibold">{event.ticketPrice}€</span>
                </span>
              </div>
            </div>
            {isCompleted && event.reviewsCount > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Nota
                </p>
                <div className="mt-0.5 flex items-center justify-end gap-1">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <span className="text-lg font-black text-black">
                    {event.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Barra de venta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-gray-500">
                {event.ticketsSold.toLocaleString("es-ES")} /{" "}
                {event.capacity.toLocaleString("es-ES")} entradas
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
              icon={Star}
              label="Reviews"
              value={event.reviewsCount.toString()}
            />
            <InlineStat
              icon={BarChart3}
              label="Conversión"
              value={`${Math.round(fillPct)}%`}
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
                <>
                  <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black">
                    <Pencil className="h-3 w-3" />
                    Editar
                  </button>
                  <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-all hover:border-black hover:text-black">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
            <Link
              href={`/promoter/events/${event.id}`}
              className="flex items-center gap-1 text-sm font-semibold text-black transition-transform group-hover:translate-x-1"
            >
              Analytics <ArrowRight className="h-4 w-4" />
            </Link>
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

