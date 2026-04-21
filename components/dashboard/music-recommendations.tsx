"use client"

import Image from "next/image"
import { Music2, ExternalLink } from "lucide-react"
import type { DashboardMusic } from "@/lib/api/user"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSpotifyTrackId(url: string): string | null {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? null
}

function buildEmbedUrl(spotifyUrl: string): string | null {
  const id = getSpotifyTrackId(spotifyUrl)
  if (!id) return null
  // sin theme=0 → Spotify usa su tema claro por defecto
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator`
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <div className="h-36 w-full animate-pulse bg-gray-100" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="mx-4 mb-4 h-20 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-gray-50 py-16 px-6 text-center">
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

// ── Card ──────────────────────────────────────────────────────────────────────

function MusicCard({ track }: { track: DashboardMusic }) {
  const embedUrl = buildEmbedUrl(track.spotifyUrl)

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-md">
      {/* Portada del álbum */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gray-100">
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
        {/* Chip de género */}
        <span className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
          {track.genre.replace(/_/g, " ")}
        </span>
      </div>

      {/* Título + artista */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-black">{track.title}</p>
          <p className="truncate text-xs font-medium text-gray-500">{track.artist}</p>
        </div>
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir en Spotify"
          className="mt-0.5 shrink-0 text-gray-400 transition-colors hover:text-black"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Spotify Embed — overflow-hidden en el wrapper para contener el botón play */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: "block" }}
          />
        ) : (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-20 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 transition-colors hover:border-black hover:text-black"
          >
            <ExternalLink className="h-4 w-4" />
            Escuchar en Spotify
          </a>
        )}
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

interface MusicRecommendationsProps {
  tracks:  DashboardMusic[]
  loading: boolean
}

export function MusicRecommendations({ tracks, loading }: MusicRecommendationsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (tracks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track) => (
        <MusicCard key={track.spotifyUrl} track={track} />
      ))}
    </div>
  )
}
