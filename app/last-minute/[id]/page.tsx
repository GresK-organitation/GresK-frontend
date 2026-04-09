"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Heart,
  Share2,
  Music2,
  Eye,
  ShieldCheck,
  DoorOpen,
  Timer,
  Tag,
  AlertTriangle,
  PlayCircle,
  Flame,
} from "lucide-react"
import { MOCK_LAST_MINUTE, type LastMinuteEvent } from "@/lib/mock-data"
import { Navbar } from "@/components/dashboard/navbar"

const REASON_LABEL: Record<LastMinuteEvent["reason"], string> = {
  "cupos-liberados": "Cupos liberados por la organización",
  "baja-asistencia": "Llena la sala, gana la ciudad",
  cancelacion: "Entradas devueltas disponibles",
  "oferta-relámpago": "Oferta relámpago exclusiva GresK",
}

export default function LastMinuteDetailPage() {
  const { id } = useParams()
  const event = MOCK_LAST_MINUTE.find((e) => e.id === Number(id))
  const [liked, setLiked] = useState(false)

  // Countdown hasta expires
  const [timeLeft, setTimeLeft] = useState<{
    h: number
    m: number
    s: number
    expired: boolean
  }>({ h: 0, m: 0, s: 0, expired: false })

  useEffect(() => {
    if (!event) return
    const update = () => {
      const diff = +new Date(event.expiresAt) - Date.now()
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0, expired: true })
        return
      }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1000)
      setTimeLeft({ h, m, s, expired: false })
    }
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [event])

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 pt-32 text-center md:px-8">
          <h1 className="text-3xl font-black text-black">
            Flash deal no encontrado
          </h1>
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

  const soldPct = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100
  const savings =
    parseFloat(event.originalPrice) - parseFloat(event.discountPrice)
  const isCritical = event.spotsLeft <= 15

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

        {/* Flash deal banner — marca de diferenciación */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-black bg-black p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Flash Deal · GresK
              </p>
              <p className="text-sm font-black">
                {REASON_LABEL[event.reason]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
              <Eye className="h-3 w-3" />
              {event.viewersNow} mirando
            </span>
            {event.instantDelivery && (
              <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black">
                <Zap className="h-3 w-3" />
                Entrega al instante
              </span>
            )}
          </div>
        </div>

        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Cover */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover grayscale"
              priority
            />
            {/* Discount sello */}
            <div className="absolute left-4 top-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-black bg-white">
              <span className="text-2xl font-black leading-none text-black">
                -{event.discountPct}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-black">
                Descuento
              </span>
            </div>
            {/* Actions */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setLiked(!liked)}
                aria-label="Guardar"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-all hover:border-black hover:shadow-lg"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-black" : ""}`} />
              </button>
              <button
                aria-label="Compartir"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-all hover:border-black hover:shadow-lg"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            {/* Badge precio tachado bottom-left */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
              <span className="text-xs font-bold text-gray-400 line-through">
                {event.originalPrice}
              </span>
              <span className="text-sm font-black text-black">
                {event.discountPrice}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Última hora
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

            {/* Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip icon={<Tag className="h-3 w-3" />}>{event.genre}</Chip>
              <Chip icon={<DoorOpen className="h-3 w-3" />}>
                Apertura {event.doorsOpenAt}
              </Chip>
              {event.ageRestriction && (
                <Chip icon={<ShieldCheck className="h-3 w-3" />}>
                  {event.ageRestriction}
                </Chip>
              )}
            </div>

            {/* Countdown */}
            <div className="mt-6 rounded-3xl border-2 border-black bg-white p-5">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-black" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                  {timeLeft.expired ? "Oferta expirada" : "Termina en"}
                </p>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <TimeBox value={timeLeft.h} label="Horas" />
                <span className="pb-5 text-3xl font-black text-gray-300">
                  :
                </span>
                <TimeBox value={timeLeft.m} label="Min" />
                <span className="pb-5 text-3xl font-black text-gray-300">
                  :
                </span>
                <TimeBox value={timeLeft.s} label="Seg" />
              </div>

              {/* Spots progress */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className={isCritical ? "text-black" : "text-gray-500"}>
                    {isCritical && (
                      <AlertTriangle className="mr-1 inline h-3 w-3" />
                    )}
                    {event.spotsLeft} plazas disponibles
                  </span>
                  <span className="text-gray-500">
                    {Math.round(soldPct)}% vendido
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="absolute inset-y-0 left-0 bg-black transition-all"
                    style={{ width: `${soldPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Precio flash
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-black">
                    {event.discountPrice}
                  </span>
                  <span className="text-lg font-bold text-gray-400 line-through">
                    {event.originalPrice}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-black">
                  Ahorras {savings.toFixed(2)}€
                </p>
              </div>
              <a
                href={event.ticketUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800"
              >
                Comprar ahora
                <Zap className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Sobre el concierto */}
        <section className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Descripción + setlist */}
          <div>
            <h2 className="text-2xl font-black text-black">Sobre la noche</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-700">
              {event.description}
            </p>

            {/* Setlist preview — exclusivo last-minute */}
            {event.setlistPreview && event.setlistPreview.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-black" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-black">
                    Setlist esperado
                  </h3>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Temas confirmados según ediciones anteriores
                </p>
                <div className="mt-4 space-y-2">
                  {event.setlistPreview.map((song, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition-all hover:border-black"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-bold text-black">
                        {song}
                      </span>
                      <PlayCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar info práctica */}
          <aside className="space-y-3">
            <h2 className="text-2xl font-black text-black">Detalles</h2>
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Dirección"
              value={event.address}
            />
            <DetailItem
              icon={<DoorOpen className="h-4 w-4" />}
              label="Apertura puertas"
              value={event.doorsOpenAt}
            />
            <DetailItem
              icon={<Clock className="h-4 w-4" />}
              label="Show"
              value={event.time}
            />
            <DetailItem
              icon={<Tag className="h-4 w-4" />}
              label="Género"
              value={event.genre}
            />
            {event.dressCode && (
              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Dress code"
                value={event.dressCode}
              />
            )}
          </aside>
        </section>

        {/* Por qué confiar en el flash deal */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black">
            Por qué comprar aquí
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <TrustItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Entrada verificada"
              description="GresK asegura que la entrada es oficial y no viene de reventa."
            />
            <TrustItem
              icon={<Zap className="h-5 w-5" />}
              title="Entrega al instante"
              description="Recibes tu entrada en la app GresK al momento del pago."
            />
            <TrustItem
              icon={<Flame className="h-5 w-5" />}
              title="Mejor precio"
              description={`${event.discountPct}% más barato que en cualquier otra plataforma.`}
            />
          </div>
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

// ── Time Box ────────────────────────────────────────────────────────────────

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-black tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
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

// ── Trust Item ──────────────────────────────────────────────────────────────

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:border-black hover:shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
        {icon}
      </div>
      <p className="mt-3 text-sm font-black text-black">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  )
}
