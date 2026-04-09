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
import { MOCK_EVENTS, MOCK_LAST_MINUTE } from "@/lib/mock-data"

import { API_BASE_URL } from "@/lib/api/client"

export default function HomePage() {
  const [events, setEvents] = useState<EventLocation[]>(MOCK_EVENTS)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE_URL}/events`)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data)
        }
      } catch {
        // Backend no disponible, se mantienen los eventos mock
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-12">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-black px-8 py-24 text-center">
            <h1 className="text-7xl font-black tracking-tighter text-white md:text-9xl">
              GresK
            </h1>
            <p className="mt-6 max-w-lg text-2xl font-black italic tracking-tight text-white/80 md:text-3xl">
              Somos el under del under.
            </p>
            <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-white/40">
              Los conciertos que no salen en ningún algoritmo.<br />
              Los artistas de los que hablarás dentro de dos años.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/discover"
                className="rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition-all hover:bg-gray-100"
              >
                Descubrir eventos →
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_LAST_MINUTE.map((event) => (
              <LastMinuteCard key={event.id} event={event} />
            ))}
          </div>
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
            <EventMap events={events} />
          </div>
        </section>
      </main>
    </div>
  )
}

// ── Last Minute Card ────────────────────────────────────────────────────────

function LastMinuteCard({
  event,
}: {
  event: (typeof MOCK_LAST_MINUTE)[0]
}) {
  const isCritical = event.spotsLeft <= 15
  return (
    <Link
      href={`/last-minute/${event.id}`}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg"
    >
      <div className="relative h-40 w-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Date */}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
          {event.date}
        </span>

        {/* Discount badge */}
        <span className="absolute right-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-black bg-white">
          <span className="text-sm font-black leading-none text-black">
            -{event.discountPct}%
          </span>
        </span>

        {/* Spots + viewers en overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {isCritical && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              ¡Solo {event.spotsLeft}!
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black backdrop-blur">
            <Eye className="h-2.5 w-2.5" />
            {event.viewersNow}
          </span>
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
            <Clock className="ml-1 h-3 w-3 shrink-0" />
            <span>{event.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-gray-400 line-through">
              {event.originalPrice}
            </span>
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
