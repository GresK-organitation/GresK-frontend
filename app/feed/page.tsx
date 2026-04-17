"use client"

import { useState, useEffect }                              from "react"
import Image                                                from "next/image"
import Link                                                 from "next/link"
import {
  Calendar, Clock, MapPin, Sparkles, Zap,
  ArrowRight, Ticket, Music2, Play, Heart,
} from "lucide-react"
import { Navbar }                                           from "@/components/dashboard/navbar"
import { TierCard }                                         from "@/components/dashboard/tier-card"
import { MOCK_RECOMMENDED_TRACKS, type RecommendedTrack }  from "@/lib/mock-data"
import { getUserDashboard, type DashboardEvent }            from "@/lib/api/user"
import { getLastMinuteEvents, type EventResponse }          from "@/lib/api/events"
import {
  formatShortDate,
  formatEventDate,
  formatEventTime,
  formatPrice,
}                                                           from "@/lib/utils/format"

export default function FeedPage() {
  const [featuredEvent,    setFeaturedEvent]    = useState<DashboardEvent | null>(null)
  const [lastMinuteEvents, setLastMinuteEvents] = useState<EventResponse[]>([])
  const [loading,          setLoading]          = useState(true)

  useEffect(() => {
    async function loadFeedData() {
      try {
        // Ambas llamadas se lanzan en paralelo
        const [dashboard, lastMinute] = await Promise.all([
          getUserDashboard(),
          getLastMinuteEvents(),
        ])
        setFeaturedEvent(dashboard.events[0] ?? null)
        setLastMinuteEvents(lastMinute.slice(0, 3))
      } catch (err) {
        console.error("Error cargando feed:", err)
      } finally {
        setLoading(false)
      }
    }
    loadFeedData()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 md:px-8">

        {/* ── Bienvenida ── */}
        <div className="mb-4">
          <p className="text-2xl font-black text-black">Hola, Javi 👋</p>
        </div>

        {/* ── Tier & progreso ── */}
        <section className="mb-12">
          <TierCard
            tier="SILVER"
            currentPoints={620}
            nextTierPoints={1000}
            userName="Javi"
            userAvatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
            eventsCount={6}
            avgRating={4.6}
            pointsThisMonth={125}
          />
        </section>

        {/* ── Accesos rápidos ── */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Link
            href="/discover"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-black hover:shadow-md"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Explorar</p>
              <p className="mt-0.5 text-sm font-black text-black">Descubrir</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-black" />
          </Link>
          <Link
            href="/my-events"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-black hover:shadow-md"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Historial</p>
              <p className="mt-0.5 text-sm font-black text-black">Mis eventos</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-black" />
          </Link>
          <Link
            href="/my-tickets"
            className="group col-span-2 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-black hover:shadow-md sm:col-span-1"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entradas</p>
              <p className="mt-0.5 text-sm font-black text-black">Mis tickets</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-black" />
          </Link>
        </div>

        {/* ── Tu siguiente concierto ── */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-black" />
            <span className="text-xs font-bold uppercase tracking-widest text-black">
              Tu siguiente concierto
            </span>
          </div>

          {loading ? (
            <div className="h-72 w-full animate-pulse rounded-3xl bg-gray-100 md:h-96" />
          ) : featuredEvent ? (
            <Link href={`/events/${featuredEvent.id}`}>
              <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:shadow-lg">
                <div className="relative h-72 w-full md:h-96">
                  <Image
                    src={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-3 flex items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatShortDate(featuredEvent.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredEvent.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {featuredEvent.location}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white md:text-4xl">
                    {featuredEvent.title}
                  </h2>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {featuredEvent.category}
                    </span>
                    <span className="text-sm font-bold text-white">
                      Desde {formatPrice(parseFloat(featuredEvent.price))}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                      Ver evento <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
              <p className="text-sm font-medium text-gray-400">
                No hay eventos disponibles ahora mismo
              </p>
            </div>
          )}
        </section>

        {/* ── Canciones recomendadas (mock — scope separado) ── */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-black" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Para tu playlist
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-black text-black">Canciones recomendadas</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Descubre temas nuevos basados en tu actividad en GresK.
              </p>
            </div>
            <button className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-lg">
              Abrir playlist <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {MOCK_RECOMMENDED_TRACKS.slice(0, 3).map((track, i) => (
              <TrackRow key={track.id} track={track} index={i + 1} isLast={i === 2} />
            ))}
          </div>
        </section>

        {/* ── Última hora ── */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-4 w-4 text-black" />
            <span className="text-xs font-bold uppercase tracking-widest text-black">
              Última hora
            </span>
            <span className="ml-1 rounded-full border border-black bg-black px-2.5 py-0.5 text-[10px] font-bold text-white">
              Quedan plazas
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-3xl bg-gray-100" />
              ))}
            </div>
          ) : lastMinuteEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {lastMinuteEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/last-minute/${event.id}`}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg"
                >
                  <div className="relative h-36 w-full">
                    <Image
                      src={event.coverImageUrl ?? ""}
                      alt={event.title}
                      fill
                      className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-black">
                      {formatEventDate(event.eventDate)}
                    </span>
                    {event.availableCapacity <= 15 && (
                      <span className="absolute right-3 top-3 rounded-full bg-black px-2.5 py-1 text-xs font-bold text-white">
                        ¡Solo {event.availableCapacity}!
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="font-bold text-black">{event.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {event.place} · {formatEventTime(event.eventDate)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(event.amount)}
                        </span>
                        <span className="text-base font-black text-black">
                          {formatPrice(event.discountedAmount ?? event.amount)}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white transition-transform group-hover:translate-x-0.5">
                        <Ticket className="h-3.5 w-3.5" /> Ver
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
              <p className="text-sm font-medium text-gray-400">
                No hay ofertas de última hora ahora mismo
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}

// ── TrackRow ─────────────────────────────────────────────────────────────────

function TrackRow({
  track,
  index,
  isLast,
}: {
  track:  RecommendedTrack
  index:  number
  isLast: boolean
}) {
  return (
    <div
      className={`group flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      {/* Index / Play */}
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span className="text-xs font-black text-gray-400 group-hover:opacity-0">
          {String(index).padStart(2, "0")}
        </span>
        <button
          aria-label="Reproducir"
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-4 w-4 fill-black text-black" />
        </button>
      </div>

      {/* Cover */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200">
        <Image
          src={track.coverUrl}
          alt={track.album}
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-black">{track.title}</p>
        <p className="truncate text-xs font-medium text-gray-500">
          {track.artist} · {track.album}
        </p>
      </div>

      {/* Reason chip */}
      <span className="hidden shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 sm:inline-block">
        {track.reason}
      </span>

      {/* Duration */}
      <span className="hidden shrink-0 text-xs font-semibold tabular-nums text-gray-500 md:inline">
        {track.duration}
      </span>

      {/* Like */}
      <button
        aria-label="Guardar"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black hover:text-white"
      >
        <Heart className="h-3.5 w-3.5" />
      </button>

      {/* Link to related event */}
      {track.relatedEventId && (
        <Link
          href={`/events/${track.relatedEventId}`}
          aria-label="Ver evento"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black hover:text-white"
        >
          <Ticket className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}
