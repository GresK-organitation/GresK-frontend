"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft, Plus, Check, MapPin, Calendar, Clock,
  Sparkles, ArrowRight, RefreshCw, Ticket, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Datos mock ──────────────────────────────────────────────────────────────

const GENRES = [
  "Rock", "Indie", "Pop", "Electrónica", "Jazz", "Hip-Hop",
  "Folk", "Metal", "Funk", "Soul", "Flamenco", "Experimental",
]

const DAYS = [
  { label: "HOY", number: "18" },
  { label: "MAÑANA", number: "19" },
  { label: "SÁB", number: "20" },
  { label: "DOM", number: "21" },
]

const TIME_SLOTS = ["18:00-20:00", "20:00-22:00", "22:00-00:00", "00:00+"]

const DISTANCES = [
  { value: "cerca", label: "Cerca", hint: "< 15 min" },
  { value: "normal", label: "Normal", hint: "< 30 min" },
  { value: "igual", label: "Me da igual", hint: "" },
]

const RESULTS = [
  {
    id: "1",
    type: "SORPRESA",
    genre: "Electrónica",
    match: 92,
    title: "Secret Venue",
    venue: "El Raval",
    date: "Hoy",
    time: "22:00",
    price: "7 €",
    cta: "Comprar · 7 €",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  },
  {
    id: "2",
    type: null,
    genre: "Alternative Pop",
    match: 87,
    title: "The Velvet Echoes",
    venue: "Sala Apolo",
    date: "Viernes 18 abr",
    time: "21:00",
    price: "12 €",
    cta: "Ver detalle",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  },
  {
    id: "3",
    type: "ÚLTIMA HORA",
    genre: "Jazz",
    match: 82,
    title: "Smooth Sessions",
    venue: "Gràcia",
    date: "Hoy",
    time: "20:30",
    price: "5 €",
    cta: "Ir ahora",
    imageUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
  },
  {
    id: "4",
    type: "SORPRESA",
    genre: "Indie / Rock",
    match: 78,
    title: "Garage Echoes",
    venue: "Poblenou",
    date: "Mañana",
    time: "22:00",
    price: "5 €",
    cta: "Ver detalle",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  },
]

// ── Componente principal ────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

export default function DiscoverPage() {
  const [step, setStep] = useState<Step>(1)
  const [genres, setGenres] = useState<string[]>(["Rock", "Jazz"])
  const [days, setDays] = useState<string[]>(["HOY"])
  const [slots, setSlots] = useState<string[]>(["20:00-22:00", "22:00-00:00"])
  const [distance, setDistance] = useState<string>("normal")
  const [surprise, setSurprise] = useState(50)

  const toggleGenre = (g: string) =>
    setGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]))
  const toggleDay = (d: string) =>
    setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
  const toggleSlot = (s: string) =>
    setSlots((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const progressPct = (step / 4) * 100

  const goBack = () => step > 1 && setStep((step - 1) as Step)
  const goNext = () => step < 4 && setStep((step + 1) as Step)

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-black transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-black transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </Link>
          )}

          {/* Progress bar */}
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              PASO {step} DE 4
            </p>
          </div>

          {step < 4 && (
            <button
              onClick={() => setStep(4)}
              className="text-sm font-semibold text-gray-500 hover:text-black"
            >
              Saltar
            </button>
          )}
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        {step === 1 && (
          <GenresStep
            genres={genres}
            toggle={toggleGenre}
          />
        )}
        {step === 2 && (
          <DateStep
            days={days}
            slots={slots}
            toggleDay={toggleDay}
            toggleSlot={toggleSlot}
          />
        )}
        {step === 3 && (
          <FinalStep
            distance={distance}
            setDistance={setDistance}
            surprise={surprise}
            setSurprise={setSurprise}
          />
        )}
        {step === 4 && <ResultsStep />}
      </main>

      {/* ── Botón inferior fijo ── */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
          <div className="mx-auto max-w-3xl">
            <Button
              onClick={goNext}
              className="w-full rounded-full bg-black text-base font-bold uppercase tracking-wider text-white hover:bg-gray-800 h-14"
            >
              {step === 3 ? (
                <>
                  Descubrir experiencias <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Siguiente <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Paso 1: Géneros ─────────────────────────────────────────────────────────

function GenresStep({
  genres,
  toggle,
}: {
  genres: string[]
  toggle: (g: string) => void
}) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Qué te apetece<br />esta noche?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        No te diremos todo. Solo lo suficiente.
      </p>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Elige uno o varios
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {GENRES.length} estilos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GENRES.map((g) => {
          const selected = genres.includes(g)
          return (
            <button
              key={g}
              onClick={() => toggle(g)}
              className={`flex items-center justify-between rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              <span>{g}</span>
              {selected ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Paso 2: Fechas ──────────────────────────────────────────────────────────

function DateStep({
  days,
  slots,
  toggleDay,
  toggleSlot,
}: {
  days: string[]
  slots: string[]
  toggleDay: (d: string) => void
  toggleSlot: (s: string) => void
}) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Cuándo puedes?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Dinos qué noches estás libre.
      </p>

      <div className="mt-10 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Elige los días
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {DAYS.map((d) => {
          const selected = days.includes(d.label)
          return (
            <button
              key={d.label}
              onClick={() => toggleDay(d.label)}
              className={`flex flex-col items-center justify-center rounded-2xl border py-4 transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {d.label}
              </span>
              <span className="mt-1 text-2xl font-black">{d.number}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-10 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Franjas horarias
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TIME_SLOTS.map((s) => {
          const selected = slots.includes(s)
          return (
            <button
              key={s}
              onClick={() => toggleSlot(s)}
              className={`flex items-center justify-between rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              <span>{s}</span>
              {selected ? (
                <Check className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-gray-300" />
              )}
            </button>
          )
        })}
      </div>

      {/* Sugerencia */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white">
        <div className="relative h-32 w-full">
          <Image
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
            alt="Sugerencia"
            fill
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            Sugerencia
          </span>
        </div>
        <p className="p-5 text-sm text-gray-700">
          Los viernes suele haber eventos especiales en las zonas que eligiste.
        </p>
      </div>
    </div>
  )
}

// ── Paso 3: Distancia + sorpresa ────────────────────────────────────────────

function FinalStep({
  distance,
  setDistance,
  surprise,
  setSurprise,
}: {
  distance: string
  setDistance: (d: string) => void
  surprise: number
  setSurprise: (s: number) => void
}) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl">
        ¿Hasta dónde<br />llegas?
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Elige tu radio de exploración.
      </p>

      <div className="mt-10 space-y-3">
        {DISTANCES.map((d) => {
          const selected = distance === d.value
          return (
            <button
              key={d.value}
              onClick={() => setDistance(d.value)}
              className={`flex w-full items-center justify-between rounded-full border px-6 py-4 text-base font-semibold transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              <span>{d.label}</span>
              <span className={`text-xs font-medium ${selected ? "text-white/70" : "text-gray-500"}`}>
                {d.hint}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-black" />
            <span className="text-sm font-bold text-black">Nivel de sorpresa</span>
          </div>
          <span className="text-sm font-bold text-black">{surprise}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={surprise}
          onChange={(e) => setSurprise(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <span>SAFE</span>
          <span>WILD</span>
        </div>
      </div>
    </div>
  )
}

// ── Paso 4: Resultados ──────────────────────────────────────────────────────

function ResultsStep() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-black" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-black">
          Sound Discoveries
        </span>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-black md:text-4xl">
        Hemos encontrado {RESULTS.length}<br />experiencias para ti
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Basado en tus preferencias de hoy.
      </p>

      <div className="mt-10 space-y-4">
        {RESULTS.map((r) => (
          <ResultCard key={r.id} result={r} />
        ))}
      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-4 text-sm font-semibold text-black hover:border-black transition-colors">
        <RefreshCw className="h-4 w-4" />
        ¿No te convence? Prueba de nuevo
      </button>

      <div className="mt-6 text-center">
        <Link
          href="/feed"
          className="text-sm font-semibold text-gray-500 hover:text-black"
        >
          Volver al feed →
        </Link>
      </div>
    </div>
  )
}

function ResultCard({ result }: { result: typeof RESULTS[0] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Imagen */}
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
          <Image
            src={result.imageUrl}
            alt={result.title}
            fill
            className="object-cover grayscale"
          />
          {result.type && (
            <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {result.type}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {result.genre}
              </p>
              <h3 className="mt-0.5 text-xl font-black text-black leading-tight">
                {result.title}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Match
              </p>
              <p className="text-lg font-black text-black">{result.match}%</p>
            </div>
          </div>

          <div className="space-y-1.5 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-black" />
              <span className="font-medium">{result.venue}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-black" />
              <span className="font-medium">{result.date}</span>
              <Clock className="h-3.5 w-3.5 shrink-0 text-black ml-1" />
              <span className="font-medium">{result.time}</span>
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-2xl font-black text-black">{result.price}</span>
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-black transition-colors">
                <Heart className="h-4 w-4 text-black" />
              </button>
              <Button className="rounded-full bg-black text-white font-bold hover:bg-gray-800">
                <Ticket className="mr-1.5 h-3.5 w-3.5" />
                {result.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
