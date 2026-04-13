"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Building2,
  Heart,
  Share2,
  Star,
  ChevronDown,
  Zap,
} from "lucide-react"
import { MOCK_EVENTS, MOCK_REVIEWS } from "@/lib/mock-data"
import { Navbar } from "@/components/dashboard/navbar"

export default function EventDetailPage() {
  const { id } = useParams()
  const event = MOCK_EVENTS.find((e) => e.id === Number(id))
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 pt-32 text-center md:px-8">
          <h1 className="text-3xl font-black text-black">Evento no encontrado</h1>
          <Link
            href="/feed"
            className="mt-4 inline-block text-sm font-bold uppercase tracking-widest text-black underline"
          >
            Volver al feed
          </Link>
        </main>
      </div>
    )
  }

  const reviews = MOCK_REVIEWS.filter((r) => r.eventId === event.id)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-8">
        {/* Back */}
        <Link
          href="/feed"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al feed
        </Link>

        {/* Hero: imagen + info principal */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Cover cuadrada */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover grayscale"
              priority
            />
            {/* Genre chip top-left */}
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black">
              {event.genre.split("/")[0].trim()}
            </span>
            {/* Actions bottom-right */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setLiked(!liked)}
                aria-label="Guardar"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-all hover:border-black hover:shadow-lg"
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    liked ? "fill-black" : ""
                  }`}
                />
              </button>
              <button
                aria-label="Compartir"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-all hover:border-black hover:shadow-lg"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Info principal */}
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Evento
            </p>
            <h1 className="mt-1 text-5xl font-black uppercase leading-[0.9] tracking-tight text-black md:text-6xl lg:text-7xl">
              {event.title}
            </h1>

            <p className="mt-4 text-lg font-bold text-gray-700">
              {event.venue}
            </p>

            <div className="mt-2 flex items-center gap-2 text-base font-bold text-black">
              <Calendar className="h-4 w-4" />
              <span>
                {event.date} · {event.time}
              </span>
            </div>

            {/* Chips meta */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip icon={<Tag className="h-3 w-3" />}>{event.genre}</Chip>
              <Chip icon={<MapPin className="h-3 w-3" />}>
                {event.venue.split(",")[0]}
              </Chip>
              {reviews.length > 0 && (
                <Chip icon={<Star className="h-3 w-3 fill-black" />}>
                  {avgRating.toFixed(1)} · {reviews.length} reviews
                </Chip>
              )}
            </div>

            {/* Price card */}
            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Precio
                </p>
                <p className="mt-1 text-3xl font-black text-black">
                  {event.price}
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500">
                  Venta oficial. Sin sorpresas de última hora.
                </p>
              </div>
              <a
                href={event.ticketUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800"
              >
                Comprar
                <Zap className="h-4 w-4" />
              </a>
            </div>

            {/* Protección compra */}
            <p className="mt-4 text-xs font-medium leading-relaxed text-gray-500">
              <span className="font-bold text-black">GresK</span> protege a fans y
              artistas de la reventa ilegal. Tus entradas se guardan de forma
              segura en la app.
            </p>
          </div>
        </section>

        {/* Descripción */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black">Información</h2>
          <div className="mt-4 max-w-3xl">
            <p
              className={`text-base leading-relaxed text-gray-700 ${
                expanded ? "" : "line-clamp-4"
              }`}
            >
              {event.description}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black hover:text-gray-600"
            >
              {expanded ? "Leer menos" : "Leer más"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Detalles grid */}
        <section className="mt-12">
          <h2 className="text-2xl font-black text-black">Detalles</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <DetailItem
              icon={<Clock className="h-4 w-4" />}
              label="Hora"
              value={event.time}
            />
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Dirección"
              value={event.address}
            />
            <DetailItem
              icon={<Tag className="h-4 w-4" />}
              label="Género"
              value={event.genre}
            />
            <DetailItem
              icon={<Users className="h-4 w-4" />}
              label="Aforo"
              value={event.capacity}
            />
            <DetailItem
              icon={<Building2 className="h-4 w-4" />}
              label="Organizador"
              value={event.organizer}
            />
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha"
              value={event.date}
            />
          </div>
        </section>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Comunidad
                </p>
                <h2 className="mt-1 text-2xl font-black text-black">
                  Lo que dicen los fans
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="text-lg font-black text-black">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  / 5 · {reviews.length} reviews
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.slice(0, 4).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}

        {/* Aviso legal */}
        <section className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-xs font-medium leading-relaxed text-gray-600">
            <span className="font-bold uppercase tracking-widest text-black">
              Aviso ·
            </span>{" "}
            Para mayores de 18 años (necesario traer DNI). El acceso podrá
            denegarse si no se cumplen las condiciones de entrada.
          </p>
        </section>
      </main>
    </div>
  )
}

// ── Chip ────────────────────────────────────────────────────────────────────

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-black">
      {icon}
      {children}
    </span>
  )
}

// ── Detail Item ─────────────────────────────────────────────────────────────

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-black">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-bold text-black">{value}</p>
    </div>
  )
}

// ── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({
  review,
}: {
  review: (typeof MOCK_REVIEWS)[0]
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:border-black hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-black text-white">
            {review.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-black">{review.author}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              {review.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i <= review.rating
                  ? "fill-black text-black"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">
        “{review.comment}”
      </p>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {review.helpful} personas lo encontraron útil
      </p>
    </div>
  )
}
