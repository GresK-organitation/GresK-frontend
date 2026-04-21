"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Crown, User, ArrowRight, Pencil, Music2 } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"

// ── Tiers ───────────────────────────────────────────────────────────────────

const TIER_ORDER = ["FREE", "PREMIUM"]

function getNextTier(tier: string): string | null {
  const idx = TIER_ORDER.indexOf(tier.toUpperCase())
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null
  return TIER_ORDER[idx + 1]
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
  const target = Math.min((currentPoints / nextTierPoints) * 100, 100)
  const pointsRemaining = Math.max(nextTierPoints - currentPoints, 0)
  const nextTier = getNextTier(tier)

  const [animatedPct, setAnimatedPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(target), 120)
    return () => clearTimeout(t)
  }, [target])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">

      {/* ── Botones superiores (edit + pts) ── */}
      <div className="absolute right-5 top-5 flex items-center gap-2">
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:border-black"
          >
            <Pencil className="h-3 w-3" />
            Editar
          </button>
        )}
        <div className="rounded-full bg-black px-4 py-1.5">
          <span className="text-xs font-bold text-white">{currentPoints} pts</span>
        </div>
      </div>

      {/* ── Fila principal: avatar izq + stats der ── */}
      <div className="flex items-center gap-6 pr-28">
        {/* Avatar grande + tier debajo */}
        <div className="flex shrink-0 flex-col items-center gap-2.5">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
            {userAvatarUrl ? (
              <Image
                src={userAvatarUrl}
                alt={userName}
                fill
                className="object-cover grayscale"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Tier badge bajo el avatar */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Crown className="h-4 w-4 text-black" />
              <Sparkles count={3} color="#000000" size="sm" className="absolute -right-2 -top-2" />
            </div>
            <span className="text-sm font-black tracking-tight text-black">{tier}</span>
            {nextTier && (
              <>
                <ArrowRight className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {nextTier}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stats a la derecha del avatar */}
        <div className="flex flex-1 divide-x divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <StatItem value={eventsCount.toString()} label="Eventos" />
          <StatItem
            value={avgRating > 0 ? avgRating.toFixed(1) + "★" : "—"}
            label="Media"
          />
          <StatItem value={`+${pointsThisMonth}`} label="Pts este mes" />
        </div>
      </div>

      {/* ── Barra de progreso ── */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span className="text-gray-500">Progreso</span>
          <span className="text-black">{currentPoints} / {nextTierPoints} pts</span>
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
          <span className="font-semibold text-black">{nextTier ?? "el nivel máximo"}</span>
        </p>
      </div>

      {/* ── Géneros musicales ── */}
      {musicGenres.length > 0 && (
        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Music2 className="h-3 w-3 text-gray-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Géneros favoritos
              </span>
            </div>
            {onEditGenres && (
              <button
                onClick={onEditGenres}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-black"
              >
                <Pencil className="h-2.5 w-2.5" />
                Editar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {musicGenres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Stat Item ────────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center py-4">
      <span className="text-xl font-black text-black">{value}</span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
  )
}
