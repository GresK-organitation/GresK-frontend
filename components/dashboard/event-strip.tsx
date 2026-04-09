"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { type EventLocation } from "@/components/dashboard/event-map"

const MONTH_ORDER: Record<string, number> = {
  ENE: 1, FEB: 2, MAR: 3, ABR: 4, MAY: 5, JUN: 6,
  JUL: 7, AGO: 8, SEP: 9, OCT: 10, NOV: 11, DIC: 12,
}

function parseDateScore(dateStr: string): number {
  if (!dateStr) return Infinity
  const iso = Date.parse(dateStr)
  if (!isNaN(iso)) return iso
  const parts = dateStr.trim().split(" ")
  if (parts.length === 2) {
    const day = parseInt(parts[0], 10)
    const month = MONTH_ORDER[parts[1].toUpperCase()] ?? 0
    const now = new Date()
    const year = month < now.getMonth() + 1 ? now.getFullYear() + 1 : now.getFullYear()
    return new Date(year, month - 1, day).getTime()
  }
  return Infinity
}

interface EventStripProps {
  events: EventLocation[]
}

export function EventStrip({ events }: EventStripProps) {
  const sorted = [...events].sort(
    (a, b) => parseDateScore(a.date) - parseDateScore(b.date)
  )

  if (sorted.length === 0) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none bg-gradient-to-t from-background via-background/90 to-transparent pt-28 pb-4">
      {/* Contador */}
      <div className="pointer-events-auto px-4 mb-3 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          {sorted.length} eventos cerca
        </span>
      </div>

      {/* Tarjetas centradas con scroll */}
      <div className="pointer-events-auto w-full overflow-x-auto scrollbar-none">
        <div className="flex gap-3 pb-2 px-4 w-max mx-auto">
        {sorted.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-sm transition-all hover:border-yellow-400/60 hover:bg-zinc-800"
          >
            {/* Imagen */}
            <div className="relative h-28 w-full overflow-hidden">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-1 text-yellow-400">
                <Calendar className="h-3 w-3 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">{event.date}</span>
              </div>
              <p className="truncate text-sm font-bold text-white leading-tight">
                {event.title}
              </p>
              <div className="flex items-center gap-1 text-zinc-400">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate text-xs">{event.venue}</span>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  )
}
