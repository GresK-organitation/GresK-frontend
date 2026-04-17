"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  Ticket,
  Calendar,
  MapPin,
  QrCode,
} from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"
import { getUserTickets, type TicketResponse } from "@/lib/api/tickets"
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

// ── Types ──────────────────────────────────────────────────────────────────

interface EnrichedTicket {
  ticket: TicketResponse
  event:  EventResponse | null
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MyTicketsPage() {
  const [tickets,  setTickets]  = useState<EnrichedTicket[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const raw = await getUserTickets()
        // Fetch event data for every ticket in parallel
        const enriched = await Promise.all(
          raw.map(async (ticket) => {
            const event = await getEvent(ticket.eventId).catch(() => null)
            return { ticket, event }
          })
        )
        // Most recent first
        enriched.sort(
          (a, b) =>
            new Date(b.ticket.purchasedAt).getTime() -
            new Date(a.ticket.purchasedAt).getTime()
        )
        setTickets(enriched)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-16 md:px-8">

        {/* Back */}
        <Link
          href="/feed"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al feed
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Entradas
            </p>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-black">
              Mis tickets
            </h1>
          </div>
          {!loading && tickets.length > 0 && (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-500">
              {tickets.length} {tickets.length === 1 ? "entrada" : "entradas"}
            </span>
          )}
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex h-48 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-400">
              No se pudieron cargar tus entradas
            </p>
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white">
              <Ticket className="h-7 w-7 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-black text-black">Aún no tienes entradas</p>
              <p className="mt-1 text-xs font-medium text-gray-500">
                Compra tu primera entrada y aparecerá aquí.
              </p>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800"
            >
              Descubrir eventos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Ticket list */}
        {!loading && !error && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map(({ ticket, event }) => (
              <TicketCard key={ticket.id} ticket={ticket} event={event} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

// ── TicketCard ─────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  event,
}: {
  ticket: TicketResponse
  event:  EventResponse | null
}) {
  const title    = event?.title ?? "Evento"
  const venue    = event ? (event.place ?? event.city ?? "—") : "—"
  const date     = event ? fmtDate(event.eventDate) : "—"
  const time     = event ? fmtTime(event.eventDate) : "—"
  const imageUrl = event?.coverImageUrl ?? null
  const shortId  = ticket.id.substring(0, 8).toUpperCase()

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-md">
      <div className="flex items-stretch">

        {/* Cover image strip */}
        {imageUrl ? (
          <div className="relative w-24 shrink-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          </div>
        ) : (
          <div className="flex w-24 shrink-0 items-center justify-center bg-gray-100">
            <Ticket className="h-6 w-6 text-gray-300" />
          </div>
        )}

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-black uppercase leading-tight text-black">
                {title}
              </h3>
              <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {ticket.status === "PURCHASED" ? "Comprada" : ticket.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Calendar className="h-3 w-3" />
                {date} · {time}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <MapPin className="h-3 w-3" />
                {venue}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              ID: {shortId}…
            </span>
            <Link
              href={`/tickets/${ticket.id}?eventId=${ticket.eventId}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 group-hover:gap-2"
            >
              <QrCode className="h-3.5 w-3.5" />
              Ver QR
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
