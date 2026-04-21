"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Map, { Marker, Popup, type MapRef } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react"

export interface EventLocation {
  id: string
  title: string
  date: string
  venue: string
  latitude: number
  longitude: number
  imageUrl?: string
  genre?: string
  time?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTH_ORDER: Record<string, number> = {
  ENE: 1, FEB: 2, MAR: 3, ABR: 4, MAY: 5, JUN: 6,
  JUL: 7, AGO: 8, SEP: 9, OCT: 10, NOV: 11, DIC: 12,
}

function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const iso = Date.parse(dateStr)
  if (!isNaN(iso)) return new Date(iso)
  const parts = dateStr.trim().split(" ")
  if (parts.length === 2) {
    const day = parseInt(parts[0], 10)
    const month = MONTH_ORDER[parts[1].toUpperCase()] ?? 0
    const now = new Date()
    const year = month < now.getMonth() + 1 ? now.getFullYear() + 1 : now.getFullYear()
    return new Date(year, month - 1, day)
  }
  return null
}

function daysUntil(dateStr: string): string {
  const date = parseEventDate(dateStr)
  if (!date) return "?"
  const now = new Date()
  const diffMs = date.setHours(0, 0, 0, 0) - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return "HOY"
  if (days === 1) return "1d"
  return `${days}d`
}

function isToday(dateStr: string): boolean { return daysUntil(dateStr) === "HOY" }
function isThisWeek(dateStr: string): boolean {
  const d = daysUntil(dateStr)
  if (d === "HOY") return true
  const num = parseInt(d)
  return !isNaN(num) && num <= 7
}

// ── Filtros ──────────────────────────────────────────────────────────────────

const DATE_FILTERS = [
  { label: "Todos", value: null },
  { label: "Hoy", value: "HOY" },
  { label: "Esta semana", value: "SEMANA" },
]

function matchesFilter(event: EventLocation, filter: string | null): boolean {
  if (!filter) return true
  if (filter === "HOY") return isToday(event.date)
  if (filter === "SEMANA") return isThisWeek(event.date)
  return (event.genre ?? "").toUpperCase() === filter.toUpperCase()
}

function buildFilters(events: EventLocation[]) {
  const genres = Array.from(new Set(events.map((e) => e.genre).filter(Boolean) as string[]))
    .sort()
    .map((g) => ({ label: g.charAt(0) + g.slice(1).toLowerCase().replace(/_/g, " "), value: g }))
  return [...DATE_FILTERS, ...genres]
}

// ── Marker ───────────────────────────────────────────────────────────────────

function EventMarker({ event, selected }: { event: EventLocation; selected: boolean }) {
  const label = daysUntil(event.date)
  const today = label === "HOY"

  return (
    <div className="group flex flex-col items-center cursor-pointer">
      <div className={`relative rounded-full transition-all duration-200 group-hover:scale-110 ${selected ? "scale-110" : ""} ${today ? "animate-pulse" : ""} ring-2 ${selected ? "ring-black" : "ring-black/60"}`}>
        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-black bg-white">
          {event.imageUrl
            ? <Image src={event.imageUrl} alt={event.title} fill className="object-cover grayscale" />
            : <div className="h-full w-full bg-gray-100 flex items-center justify-center"><MapPin className="h-4 w-4 text-black" /></div>
          }
        </div>
      </div>
      <span className={`mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-black shadow-md bg-black text-white`}>
        {label}
      </span>
    </div>
  )
}

// ── Panel de eventos (derecha) ────────────────────────────────────────────────

interface EventPanelProps {
  events: EventLocation[]
  allEvents: EventLocation[]
  activeFilter: string | null
  selectedId: string | null
  onFilterChange: (f: string | null) => void
  onEventClick: (event: EventLocation) => void
}

function EventPanel({ events, allEvents, activeFilter, selectedId, onFilterChange, onEventClick }: EventPanelProps) {
  const filters = useMemo(() => buildFilters(allEvents), [allEvents])
  return (
    <div className="flex h-full w-full flex-col border-l border-l-gray-200 bg-white">
      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto px-5 py-5 scrollbar-none shrink-0">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              activeFilter === f.value
                ? "bg-black text-white border border-black"
                : "border border-gray-300 bg-white text-black hover:border-black"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Contador */}
      <p className="px-5 pb-3 text-xs font-medium text-gray-500 shrink-0">
        {events.length} evento{events.length !== 1 ? "s" : ""}
      </p>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto space-y-3 px-5 pb-5 scrollbar-none">
        {events.length === 0 && (
          <p className="text-sm text-gray-500 pt-8 text-center">No hay eventos con este filtro</p>
        )}
        {events.map((event) => {
          const isSelected = event.id === selectedId
          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`group w-full flex gap-3 rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-black bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-black hover:shadow-md"
              }`}
            >
              {/* Imagen */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                {event.imageUrl
                  ? <Image src={event.imageUrl} alt={event.title} fill className="object-cover grayscale" />
                  : <div className="h-full w-full bg-gray-100" />
                }
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-black">{event.title}</p>
                <div className="mt-1 flex items-center gap-1.5 text-gray-700">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span className="text-xs font-semibold">{event.date}</span>
                  {event.time && (
                    <>
                      <Clock className="h-3 w-3 shrink-0 ml-1" />
                      <span className="text-xs">{event.time}</span>
                    </>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-gray-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate text-xs">{event.venue}</span>
                </div>
                {event.genre && (
                  <span className="mt-2 inline-block rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                    {event.genre}
                  </span>
                )}
              </div>

              {/* Flecha */}
              <Link
                href={`/events/${event.id}`}
                onClick={(e) => e.stopPropagation()}
                className="self-center shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-black hover:text-white transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

interface EventMapProps {
  events: EventLocation[]
}

export function EventMap({ events }: EventMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventLocation | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const validEvents = useMemo(
    () => events.filter((e) => e.latitude !== 0 && e.longitude !== 0),
    [events]
  )

  const filteredEvents = useMemo(
    () => validEvents.filter((e) => matchesFilter(e, activeFilter)),
    [validEvents, activeFilter]
  )

  const handleMarkerClick = useCallback((event: EventLocation) => {
    setSelectedEvent(event)
  }, [])

  const handleEventPanelClick = useCallback((event: EventLocation) => {
    setSelectedEvent(event)
    mapRef.current?.flyTo({
      center: [event.longitude, event.latitude],
      zoom: 13,
      duration: 800,
    })
  }, [])

  return (
    <div className="flex h-full w-full">
      {/* Mapa — 60% */}
      <div className="relative flex-[3]">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{ longitude: 2.1734, latitude: 41.3851, zoom: 10.5 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          reuseMaps
          onClick={() => setSelectedEvent(null)}
        >
          {filteredEvents.map((event) => (
            <Marker
              key={event.id}
              longitude={event.longitude}
              latitude={event.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(event)
              }}
            >
              <EventMarker event={event} selected={selectedEvent?.id === event.id} />
            </Marker>
          ))}

          {selectedEvent && (
            <Popup
              longitude={selectedEvent.longitude}
              latitude={selectedEvent.latitude}
              anchor="bottom"
              offset={56}
              onClose={() => setSelectedEvent(null)}
              closeButton={false}
            >
              <div className="min-w-48 rounded-2xl bg-white p-4 text-black shadow-xl border border-gray-200">
                <div className="flex items-center gap-1.5 text-black mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">{selectedEvent.date}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug text-black">{selectedEvent.title}</h3>
                <div className="mt-1.5 flex items-center gap-1 text-gray-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="text-xs">{selectedEvent.venue}</span>
                </div>
                <Link
                  href={`/events/${selectedEvent.id}`}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  Ver detalles <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Panel — 40% */}
      <div className="flex-[2] overflow-hidden">
        <EventPanel
          events={filteredEvents}
          allEvents={validEvents}
          activeFilter={activeFilter}
          selectedId={selectedEvent?.id ?? null}
          onFilterChange={setActiveFilter}
          onEventClick={handleEventPanelClick}
        />
      </div>
    </div>
  )
}
