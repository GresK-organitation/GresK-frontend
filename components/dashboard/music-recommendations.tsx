"use client"

import { useState } from "react"
import Image from "next/image"
import { Music2, ExternalLink, X } from "lucide-react"
import type { DashboardMusic } from "@/lib/api/user"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSpotifyTrackId(url: string): string | null {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? null
}

function buildEmbedUrl(spotifyUrl: string): string | null {
  const id = getSpotifyTrackId(spotifyUrl)
  if (!id) return null
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator`
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="h-36 w-full animate-pulse bg-gray-100" />
      <div className="space-y-2 p-3">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white">
        <Music2 className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-bold text-black">Sin recomendaciones aún</p>
      <p className="max-w-xs text-xs font-medium text-gray-500">
        Añade géneros musicales a tu perfil para recibir canciones personalizadas.
      </p>
    </div>
  )
}

// ── Music Card ────────────────────────────────────────────────────────────────

function MusicCard({
  track,
  isActive,
  onClick,
}: {
  track: DashboardMusic
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full overflow-hidden rounded-2xl border bg-white text-left transition-all duration-200 hover:shadow-md ${
        isActive ? "border-black shadow-sm" : "border-gray-200 hover:border-black"
      }`}
    >
      {/* Imagen cuadrada */}
      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
        {track.imageUrl ? (
          <Image
            src={track.imageUrl}
            alt={track.title}
            fill
            className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-10 w-10 text-gray-300" />
          </div>
        )}
        {/* Indicador activo */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Sonando
            </span>
          </div>
        )}
      </div>

      {/* Título + artista + género */}
      <div className="p-3">
        <p className="truncate text-sm font-black text-black">{track.trackName}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-gray-500">{track.artistName}</p>
        <span className="mt-2 inline-block rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
          {track.genre.replace(/_/g, " ")}
        </span>
      </div>
    </button>
  )
}

// ── Sticky Player ─────────────────────────────────────────────────────────────

function StickyPlayer({
  track,
  visible,
  onClose,
}: {
  track: DashboardMusic
  visible: boolean
  onClose: () => void
}) {
  const embedUrl = buildEmbedUrl(track.spotifyUrl)

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-2">

        {/* Título + artista — oculto en móvil para dar espacio al iframe */}
        <div className="hidden min-w-0 sm:block" style={{ width: 160 }}>
          <p className="truncate text-sm font-black text-black">{track.trackName}</p>
          <p className="truncate text-xs font-medium text-gray-500">{track.artistName}</p>
        </div>

        {/* Iframe Spotify — ancho flexible, altura fija 80px */}
        <div className="flex-1 overflow-hidden rounded-xl">
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ display: "block", borderRadius: "12px" }}
            />
          ) : (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 hover:border-black hover:text-black"
            >
              <ExternalLink className="h-4 w-4" />
              Escuchar en Spotify
            </a>
          )}
        </div>

        {/* Acciones */}
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir en Spotify"
            className="rounded-full p-2 text-gray-400 transition-colors hover:text-black"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            aria-label="Cerrar reproductor"
            className="rounded-full p-2 text-gray-400 transition-colors hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

interface MusicRecommendationsProps {
  tracks: DashboardMusic[]
  loading: boolean
}

export function MusicRecommendations({ tracks, loading }: MusicRecommendationsProps) {
  const [activeTrack, setActiveTrack] = useState<DashboardMusic | null>(null)

  function handleSelect(track: DashboardMusic) {
    setActiveTrack((prev) =>
      prev?.spotifyUrl === track.spotifyUrl ? null : track
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (tracks.length === 0) return <EmptyState />

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <MusicCard
            key={track.spotifyUrl}
            track={track}
            isActive={activeTrack?.spotifyUrl === track.spotifyUrl}
            onClick={() => handleSelect(track)}
          />
        ))}
      </div>

      {/* Barra fija inferior — slide-up solo cuando hay canción activa */}
      {activeTrack && (
        <StickyPlayer
          track={activeTrack}
          visible={true}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </>
  )
}
