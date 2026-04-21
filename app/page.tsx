"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Zap,
  MapPin,
  Ticket,
  ArrowRight,
  Flame,
  Eye,
  Clock,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import { EventMap, type EventLocation } from "@/components/dashboard/event-map"
import { getEvents, getLastMinuteEvents, type EventResponse } from "@/lib/api/events"

// ── Local types ───────────────────────────────────────────────────────────────

interface LastMinuteCardData {
  id: string
  title: string
  date: string
  time: string
  venue: string
  imageUrl: string
  genre: string
  spotsLeft: number
  originalPrice: string
  discountPrice: string
  discountPct: number
  viewersNow: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ES_MONTHS_SHORT = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
]

function fmtDateLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowStart = new Date(todayStart.getTime() + 86400000)
  const eventStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  if (eventStart.getTime() === todayStart.getTime()) return "HOY"
  if (eventStart.getTime() === tomorrowStart.getTime()) return "MAÑANA"
  return `${String(d.getDate()).padStart(2, "0")} ${ES_MONTHS_SHORT[d.getMonth()]}`
}

function fmtDateMap(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")} ${ES_MONTHS_SHORT[d.getMonth()]}`
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function fmtPrice(amount: number, currency: string): string {
  return `${amount}${currency === "EUR" ? "€" : currency}`
}

function toEventLocation(e: EventResponse): EventLocation {
  return {
    id: e.id,
    title: e.title,
    date: e.eventDate ? fmtDateMap(e.eventDate) : "",
    time: e.eventDate ? fmtTime(e.eventDate) : "",
    venue: e.place ?? e.city ?? "",
    latitude: e.latitude ?? 0,
    longitude: e.longitude ?? 0,
    imageUrl: e.coverImageUrl ?? undefined,
    genre: e.genre ?? undefined,
  }
}

function toLastMinuteCard(e: EventResponse): LastMinuteCardData {
  const originalPrice = e.amount ? fmtPrice(e.amount, e.currency) : ""
  const discountPrice = e.discountedAmount
    ? fmtPrice(e.discountedAmount, e.currency)
    : originalPrice
  const discountPct =
    e.discountedAmount && e.amount > 0
      ? Math.round((1 - e.discountedAmount / e.amount) * 100)
      : 0
  return {
    id: e.id,
    title: e.title,
    date: e.eventDate ? fmtDateLabel(e.eventDate) : "",
    time: e.eventDate ? fmtTime(e.eventDate) : "",
    venue: e.place ?? e.city ?? "",
    imageUrl: e.coverImageUrl ?? "",
    genre: e.genre ?? "",
    spotsLeft: e.availableCapacity,
    originalPrice,
    discountPrice,
    discountPct,
    viewersNow: 0,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mapEvents, setMapEvents] = useState<EventLocation[]>([])
  const [lastMinute, setLastMinute] = useState<LastMinuteCardData[]>([])

  useEffect(() => {
    getEvents()
      .then((data) => setMapEvents(data.map(toEventLocation)))
      .catch(() => setMapEvents([]))
  }, [])

  useEffect(() => {
    getLastMinuteEvents()
      .then((data) => setLastMinute(data.map(toLastMinuteCard)))
      .catch(() => setLastMinute([]))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">

        {/* ── Hero / About ────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-12">
          <div className="rounded-3xl bg-black px-8 py-16 md:px-16 md:py-20">
            {/* Eyebrow */}
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              Sobre GresK
            </p>

            {/* Headline */}
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tighter text-white md:text-6xl">
              Donde la música<br className="hidden md:block" /> te encuentra a ti.
            </h1>

            {/* Divider */}
            <div className="mt-8 h-px w-16 bg-white/20" />

            {/* Why GresK */}
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-white/40">
              ¿Por qué elegir GresK?
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Planes a tu medida",
                  body: "Recibe recomendaciones personalizadas basadas en tus gustos y ubicación para que nunca te pierdas un evento que te apasione.",
                },
                {
                  title: "Gana mientras disfrutas",
                  body: "Nuestra experiencia está gamificada. Por cada concierto al que asistas o reseña que compartas, acumulas puntos canjeables por recompensas exclusivas.",
                },
                {
                  title: "Comunidad Real",
                  body: "Accede a valoraciones de asistentes verificados y conecta con otras personas que comparten tu mismo estilo musical.",
                },
                {
                  title: "Cultura en vivo",
                  body: "Nuestra misión es revitalizar la cultura en vivo, apoyando a las salas locales y dando visibilidad al talento que merece ser escuchado.",
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-sm font-black text-white">{title}</p>
                  <p className="text-xs font-medium leading-relaxed text-white/50">{body}</p>
                </div>
              ))}
            </div>

            {/* Closing line */}
            <p className="mt-10 max-w-xl text-sm font-medium leading-relaxed text-white/60">
              Únete a la comunidad y vive la música de una forma más social, dinámica y cercana.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/registro"
                className="rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition-all hover:bg-gray-100"
              >
                Crear cuenta →
              </Link>
              <Link
                href="/trabaja-con-nosotros"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-bold text-white transition-all hover:border-white/50"
              >
                Soy promotora
              </Link>
            </div>
          </div>
        </section>

        {/* ── Última hora (arriba) ───────────────────────────── */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-black" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Flash Deals
                </p>
              </div>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-black md:text-4xl">
                Última hora
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-500">
                Entradas con descuento que desaparecen en cuestión de horas.
              </p>
            </div>
            <Link
              href="/feed"
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-lg"
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {lastMinute.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lastMinute.map((event) => (
                <LastMinuteCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm font-medium text-gray-400">
              No hay flash deals disponibles ahora.
            </p>
          )}
        </section>

        {/* ── Separador ──────────────────────────────────────── */}
        <div className="h-16 md:h-24" />

        {/* ── Mapa (abajo) ───────────────────────────────────── */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-black" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Mapa
              </p>
            </div>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-black md:text-4xl">
              Eventos cerca de ti
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Explora qué está pasando en Barcelona sobre el mapa.
            </p>
          </div>

          <div className="h-[70vh] min-h-[560px] overflow-hidden rounded-3xl border border-gray-200">
            <EventMap events={mapEvents} />
          </div>
        </section>
      </main>
    </div>
  )
}

// ── Last Minute Card ──────────────────────────────────────────────────────────

function LastMinuteCard({ event }: { event: LastMinuteCardData }) {
  const isCritical = event.spotsLeft <= 15
  return (
    <Link
      href={`/last-minute/${event.id}`}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg"
    >
      <div className="relative h-40 w-full">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Date */}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
          {event.date}
        </span>

        {/* Discount badge */}
        {event.discountPct > 0 && (
          <span className="absolute right-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-black bg-white">
            <span className="text-sm font-black leading-none text-black">
              -{event.discountPct}%
            </span>
          </span>
        )}

        {/* Spots + viewers en overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {isCritical && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              ¡Solo {event.spotsLeft}!
            </span>
          )}
          {event.viewersNow > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black backdrop-blur">
              <Eye className="h-2.5 w-2.5" />
              {event.viewersNow}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {event.genre}
          </p>
          <h3 className="mt-0.5 truncate text-base font-black text-black">
            {event.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.venue}</span>
            {event.time && (
              <>
                <Clock className="ml-1 h-3 w-3 shrink-0" />
                <span>{event.time}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-1.5">
            {event.discountPct > 0 && (
              <span className="text-xs font-semibold text-gray-400 line-through">
                {event.originalPrice}
              </span>
            )}
            <span className="text-xl font-black text-black">
              {event.discountPrice}
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-transform group-hover:translate-x-0.5">
            <Ticket className="h-3 w-3" />
            Comprar
            <Zap className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
