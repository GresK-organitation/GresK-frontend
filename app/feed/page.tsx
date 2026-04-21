"use client"

import { useState, useEffect }                              from "react"
import Image                                                from "next/image"
import Link                                                 from "next/link"
import {
  Calendar, Clock, MapPin, Sparkles, Zap,
  ArrowRight, Ticket, Music2, Play, Heart, X,
} from "lucide-react"
import { Navbar }                                           from "@/components/dashboard/navbar"
import { TierCard }                                         from "@/components/dashboard/tier-card"
import {
  getUserDashboard,
  updateUserProfile,
  type DashboardEvent,
  type DashboardMusic,
  type UserDashboardResponse,
} from "@/lib/api/user"
import { getLastMinuteEvents, type EventResponse }          from "@/lib/api/events"
import { getUserAttendedEvents }                            from "@/lib/api/reviews"
import {
  formatShortDate,
  formatEventDate,
  formatEventTime,
  formatPrice,
}                                                           from "@/lib/utils/format"

// Puntos requeridos para subir de tier
const NEXT_TIER_POINTS: Record<string, number> = {
  FREE:    1000,
  PREMIUM: 1000,
}

const ALL_GENRES = [
  "ROCK", "POP", "TECHNO", "REGGAETON", "HIP_HOP", "HOUSE",
  "INDIE", "METAL", "TRAP", "JAZZ", "CLASSICAL", "FLAMENCO",
  "R_AND_B", "PUNK", "LATIN_JAZZ", "ELECTRONIC", "SURPRISE",
]

export default function FeedPage() {
  const [dashboard,        setDashboard]        = useState<UserDashboardResponse | null>(null)
  const [featuredEvent,    setFeaturedEvent]    = useState<DashboardEvent | null>(null)
  const [lastMinuteEvents, setLastMinuteEvents] = useState<EventResponse[]>([])
  const [loading,          setLoading]          = useState(true)

  // Stats derivados de eventos asistidos
  const [eventsCount,      setEventsCount]      = useState(0)
  const [avgRating,        setAvgRating]        = useState(0)
  const [pointsThisMonth,  setPointsThisMonth]  = useState(0)

  // Modales
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditGenres,  setShowEditGenres]  = useState(false)

  // Estado del form editar perfil
  const [editName, setEditName] = useState("")
  const [editCity, setEditCity] = useState("")
  const [editSaving, setEditSaving] = useState(false)

  // Estado del form editar géneros
  const [editGenres,  setEditGenres]  = useState<string[]>([])
  const [genreSaving, setGenreSaving] = useState(false)

  useEffect(() => {
    async function loadFeedData() {
      try {
        const [dash, lastMinute, attended] = await Promise.all([
          getUserDashboard(),
          getLastMinuteEvents(),
          getUserAttendedEvents(),
        ])
        setDashboard(dash)
        setFeaturedEvent(dash.events[0] ?? null)
        setLastMinuteEvents(lastMinute)

        // Calcular stats desde eventos asistidos
        setEventsCount(attended.length)

        const reviewed = attended.filter((e) => !e.pending && e.overallRating > 0)
        if (reviewed.length > 0) {
          const avg = reviewed.reduce((acc, e) => acc + e.overallRating, 0) / reviewed.length
          setAvgRating(avg)
        }

        const now = new Date()
        const thisMonth = attended.filter((e) => {
          if (!e.date) return false
          const d = new Date(e.date)
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        })
        setPointsThisMonth(thisMonth.reduce((acc, e) => acc + e.pointsAwarded, 0))
      } catch (err) {
        console.error("Error cargando feed:", err)
      } finally {
        setLoading(false)
      }
    }
    loadFeedData()
  }, [])

  function openEditProfile() {
    setEditName(dashboard?.name ?? "")
    setEditCity("")
    setShowEditProfile(true)
  }

  function openEditGenres() {
    setEditGenres(dashboard?.musicGenres ?? [])
    setShowEditGenres(true)
  }

  async function handleSaveProfile() {
    if (!dashboard) return
    setEditSaving(true)
    try {
      await updateUserProfile({
        name:        editName,
        description: "",
        city:        editCity,
        musicGenres: dashboard.musicGenres,
      })
      setDashboard({ ...dashboard, name: editName })
      setShowEditProfile(false)
    } catch (err) {
      console.error("Error actualizando perfil:", err)
    } finally {
      setEditSaving(false)
    }
  }

  async function handleSaveGenres() {
    if (!dashboard) return
    setGenreSaving(true)
    try {
      await updateUserProfile({
        name:        dashboard.name,
        description: "",
        city:        editCity,
        musicGenres: editGenres,
      })
      setDashboard({ ...dashboard, musicGenres: editGenres })
      setShowEditGenres(false)
    } catch (err) {
      console.error("Error actualizando géneros:", err)
    } finally {
      setGenreSaving(false)
    }
  }

  function toggleGenre(g: string) {
    setEditGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 md:px-8">

        {/* ── Bienvenida ── */}
        <div className="mb-4">
          <p className="text-2xl font-black text-black">
            Hola, {dashboard?.name ?? "…"} 👋
          </p>
        </div>

        {/* ── Tier & progreso ── */}
        <section className="mb-12">
          {loading ? (
            <div className="h-40 w-full animate-pulse rounded-3xl bg-gray-100" />
          ) : dashboard && (
            <TierCard
              tier={dashboard.tier}
              currentPoints={dashboard.points}
              nextTierPoints={NEXT_TIER_POINTS[dashboard.tier] ?? 1000}
              userName={dashboard.name}
              userAvatarUrl={dashboard.avatarUrl ?? undefined}
              eventsCount={eventsCount}
              avgRating={avgRating}
              pointsThisMonth={pointsThisMonth}
              musicGenres={dashboard.musicGenres}
              onEditProfile={openEditProfile}
              onEditGenres={openEditGenres}
            />
          )}
        </section>

        {/* ── Accesos rápidos ── */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/my-events"
            className="group flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-7 py-7 transition-all hover:border-black hover:shadow-lg"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Historial</p>
              <p className="mt-1 text-2xl font-black text-black">Mis eventos</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-all group-hover:border-black group-hover:bg-black">
              <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
            </div>
          </Link>
          <Link
            href="/my-tickets"
            className="group flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-7 py-7 transition-all hover:border-black hover:shadow-lg"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entradas</p>
              <p className="mt-1 text-2xl font-black text-black">Mis tickets</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-all group-hover:border-black group-hover:bg-black">
              <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
            </div>
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

        {/* ── Canciones recomendadas (Spotify) ── */}
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
                Basadas en tus géneros favoritos, vía Spotify.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 w-full animate-pulse rounded-3xl bg-gray-100" />
          ) : (dashboard?.music ?? []).length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              {(dashboard!.music).slice(0, 6).map((track, i, arr) => (
                <SpotifyTrackRow
                  key={track.spotifyUrl}
                  track={track}
                  index={i + 1}
                  isLast={i === arr.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
              <p className="text-sm font-medium text-gray-400">
                Sin recomendaciones por ahora
              </p>
            </div>
          )}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-3xl bg-gray-100" />
              ))}
            </div>
          ) : lastMinuteEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        {event.discountedAmount != null ? (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(event.amount)}
                            </span>
                            <span className="text-base font-black text-black">
                              {formatPrice(event.discountedAmount)}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-black text-black">
                            {formatPrice(event.amount)}
                          </span>
                        )}
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

      {/* ── Modal: Editar perfil ── */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-black">Editar perfil</h2>
              <button onClick={() => setShowEditProfile(false)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-black outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-black outline-none focus:border-black"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-black hover:border-black"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editSaving || !editName.trim() || !editCity.trim()}
                className="flex-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {editSaving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Editar géneros ── */}
      {showEditGenres && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-black">Géneros favoritos</h2>
              <button onClick={() => setShowEditGenres(false)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    editGenres.includes(g)
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-black"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditGenres(false)}
                className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-black hover:border-black"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGenres}
                disabled={genreSaving || editGenres.length === 0}
                className="flex-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {genreSaving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SpotifyTrackRow ──────────────────────────────────────────────────────────

function SpotifyTrackRow({
  track,
  index,
  isLast,
}: {
  track:  DashboardMusic
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
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir en Spotify"
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-4 w-4 fill-black text-black" />
        </a>
      </div>

      {/* Cover */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200">
        {track.imageUrl ? (
          <Image
            src={track.imageUrl}
            alt={track.trackName}
            fill
            className="object-cover grayscale"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Music2 className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-black">{track.trackName}</p>
        <p className="truncate text-xs font-medium text-gray-500">{track.artistName}</p>
      </div>

      {/* Genre chip */}
      <span className="hidden shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 sm:inline-block">
        {track.genre}
      </span>

      {/* Spotify link */}
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir en Spotify"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black hover:text-white"
      >
        <Heart className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
