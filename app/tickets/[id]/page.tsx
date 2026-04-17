"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Download,
  Share2,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import { getTicketQrImage } from "@/lib/api/tickets"
import { getEvent, type EventResponse } from "@/lib/api/events"

// ── Helpers ────────────────────────────────────────────────────────────────

const ES_MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getUTCDate()).padStart(2,"0")} ${ES_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}`
}

// ── Page wrapper (Suspense required for useSearchParams in App Router) ─────

export default function TicketQrPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="mx-auto max-w-lg px-4 pt-32 text-center md:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
              Cargando entrada…
            </p>
          </main>
        </div>
      }
    >
      <TicketQrPage />
    </Suspense>
  )
}

function TicketQrPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")

  const [qrUrl, setQrUrl]       = useState<string | null>(null)
  const [event, setEvent]       = useState<EventResponse | null>(null)
  const [qrError, setQrError]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [appeared, setAppeared] = useState(false)

  // Store the blob URL so we can revoke on unmount
  const blobRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        // Fetch QR and event data in parallel
        const promises: [Promise<string>, Promise<EventResponse | null>] = [
          getTicketQrImage(id),
          eventId ? getEvent(eventId) : Promise.resolve(null),
        ]
        const [url, ev] = await Promise.all(promises)
        if (cancelled) return
        blobRef.current = url
        setQrUrl(url)
        setEvent(ev)
      } catch {
        if (!cancelled) setQrError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    // Entrance animation slight delay
    const t = setTimeout(() => setAppeared(true), 80)

    return () => {
      cancelled = true
      clearTimeout(t)
      if (blobRef.current) URL.revokeObjectURL(blobRef.current)
    }
  }, [id, eventId])

  // ── Derived display data ─────────────────────────────────────────────────

  const title  = event?.title ?? "Tu entrada"
  const venue  = event ? (event.place ?? event.city ?? "—") : "—"
  const date   = event ? fmtDate(event.eventDate) : "—"
  const time   = event ? fmtTime(event.eventDate) : "—"
  const genre  = event?.genre ?? null
  const shortId = id.substring(0, 8).toUpperCase()

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16 md:px-8">

        {/* Back */}
        <Link
          href="/feed"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al feed
        </Link>

        {/* Header success */}
        <div
          className={`mb-8 flex flex-col items-center text-center transition-all duration-500 ${
            appeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-black">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            ¡Entrada confirmada!
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Guarda este QR — lo necesitarás en la puerta del recinto.
          </p>
        </div>

        {/* Ticket card */}
        <div
          className={`overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 delay-100 ${
            appeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Top strip */}
          <div className="bg-black px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">GresK · Entrada digital</p>
            <h2 className="mt-0.5 truncate text-xl font-black uppercase text-white">{title}</h2>
          </div>

          {/* Dashed separator */}
          <div className="relative flex items-center px-6 py-0">
            <div className="absolute -left-3 h-6 w-6 rounded-full bg-white border border-gray-200" />
            <div className="w-full border-t border-dashed border-gray-300" />
            <div className="absolute -right-3 h-6 w-6 rounded-full bg-white border border-gray-200" />
          </div>

          {/* QR section */}
          <div className="flex flex-col items-center px-6 py-8">
            {loading ? (
              <div className="flex h-52 w-52 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                  Cargando QR…
                </p>
              </div>
            ) : qrError || !qrUrl ? (
              <div className="flex h-52 w-52 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  QR no disponible
                </p>
                <p className="text-[10px] text-gray-400">Muestra el ID de ticket en taquilla</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="Código QR de tu entrada"
                  className="h-52 w-52 object-contain"
                />
              </div>
            )}

            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              ID: {shortId}…
            </p>
          </div>

          {/* Dashed separator */}
          <div className="relative flex items-center px-6 py-0">
            <div className="absolute -left-3 h-6 w-6 rounded-full bg-white border border-gray-200" />
            <div className="w-full border-t border-dashed border-gray-300" />
            <div className="absolute -right-3 h-6 w-6 rounded-full bg-white border border-gray-200" />
          </div>

          {/* Event info */}
          <div className="grid grid-cols-2 gap-4 px-6 py-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recinto</p>
              <p className="mt-0.5 text-sm font-black text-black">{venue}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fecha</p>
              <p className="mt-0.5 text-sm font-black text-black">{date}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hora</p>
              <p className="mt-0.5 text-sm font-black text-black">{time}</p>
            </div>
            {genre && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Género</p>
                <p className="mt-0.5 text-sm font-black text-black">{genre}</p>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="border-t border-dashed border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Presenta este QR en la entrada · No transferible
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`mt-6 flex flex-col gap-3 transition-all duration-500 delay-200 sm:flex-row ${
            appeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {qrUrl && (
            <a
              href={qrUrl}
              download={`ticket-${shortId}.png`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              Guardar QR
            </a>
          )}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Entrada para ${title}`, text: `ID: ${shortId}` }).catch(() => {})
              }
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:border-black hover:shadow-md"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </div>

        {/* Link to my-events */}
        <div
          className={`mt-6 text-center transition-all duration-500 delay-300 ${
            appeared ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href="/my-events"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-600"
          >
            Ver todas mis entradas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </main>
    </div>
  )
}
