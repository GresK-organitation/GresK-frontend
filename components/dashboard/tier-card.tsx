"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Crown, User, ArrowRight, Pencil } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"

// ── Tiers ───────────────────────────────────────────────────────────────────

const TIER_ORDER = ["FREE", "PREMIUM"]

function getNextTier(tier: string): string | null {
  const idx = TIER_ORDER.indexOf(tier.toUpperCase())
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null
  return TIER_ORDER[idx + 1]
}

function getGreeting(name: string): string {
  const h = new Date().getHours()
  if (h >= 6 && h < 14) return `Buenos días, ${name}`
  if (h >= 14 && h < 21) return `Buenas tardes, ${name}`
  return `Buenas noches, ${name}`
}

// ── Props ───────────────────────────────────────────────────────────────────

interface TierCardProps {
  tier: string
  currentPoints: number
  nextTierPoints: number
  userName?: string
  userAvatarUrl?: string
  eventsCount?: number
  avgRating?: number
  pointsThisMonth?: number
  musicGenres?: string[]
  onEditProfile?: () => void
  onEditGenres?: () => void
}

// ── Componente ──────────────────────────────────────────────────────────────

export function TierCard({
  tier,
  currentPoints,
  nextTierPoints,
  userName = "Tú",
  userAvatarUrl,
  eventsCount = 0,
  avgRating = 0,
  pointsThisMonth = 0,
  musicGenres = [],
  onEditProfile,
  onEditGenres,
}: TierCardProps) {
  const target = (currentPoints / nextTierPoints) * 100
  const pointsRemaining = nextTierPoints - currentPoints
  const nextTier = getNextTier(tier)

  const [animatedPct, setAnimatedPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(target), 120)
    return () => clearTimeout(t)
  }, [target])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
      {/* Fila superior: avatar + saludo + nivel + pts */}
      <div className="flex items-center gap-4">
        {/* Avatar circular */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt={userName}
              fill
              className="object-cover grayscale"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Crown className="h-5 w-5 text-black" />
                <Sparkles
                  count={3}
                  color="#000000"
                  size="sm"
                  className="absolute -right-2 -top-2"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-black">
                {tier}
              </span>
              {nextTier && (
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {nextTier}
                  </span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {onEditProfile && (
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-black hover:border-black transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
              )}
              <div className="rounded-full bg-black px-3 py-1">
                <span className="text-xs font-bold text-white">
                  {currentPoints} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso animada */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span className="text-gray-500">Progreso</span>
          <span className="text-black">
            {currentPoints} / {nextTierPoints} pts
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-black transition-all duration-700 ease-out"
            style={{ width: `${animatedPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Te faltan{" "}
          <span className="font-semibold text-black">{pointsRemaining} pts</span>{" "}
          para{" "}
          <span className="font-semibold text-black">
            {nextTier ?? "el nivel máximo"}
          </span>
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-gray-50">
        <StatItem value={eventsCount.toString()} label="Eventos" />
        <StatItem
          value={avgRating > 0 ? avgRating.toFixed(1) + "★" : "—"}
          label="Media"
        />
        <StatItem value={`+${pointsThisMonth}`} label="Pts este mes" />
      </div>

      {/* Géneros musicales */}
      {musicGenres.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {musicGenres.map((g) => (
            <span
              key={g}
              className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600"
            >
              {g}
            </span>
          ))}
          {onEditGenres && (
            <button
              onClick={onEditGenres}
              className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-colors"
            >
              <Pencil className="h-2.5 w-2.5" />
              Editar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Stat Item ────────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <span className="text-base font-black text-black">{value}</span>
      <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
  )
}
