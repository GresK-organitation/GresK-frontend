"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Music2,
  Plus,
  Star,
  MapPin,
  Pencil,
  Trash2,
  Search,
  Users,
  Mic2,
  ArrowRight,
  Link2,
  ExternalLink,
  Mail,
  Calendar,
  Tag,
  ChevronDown,
  Euro,
  Filter,
} from "lucide-react"
import {
  MOCK_PROMOTER_ARTISTS,
  type PromoterArtist,
  type ArtistStatus,
} from "@/lib/mock-data"

// ── Status meta ─────────────────────────────────────────────────────────────

const STATUS_META: Record<ArtistStatus, { label: string; className: string }> =
  {
    confirmed: {
      label: "Confirmado",
      className: "border-black bg-black text-white",
    },
    negotiating: {
      label: "Negociando",
      className: "border-black bg-white text-black",
    },
    available: {
      label: "Disponible",
      className: "border-gray-300 bg-gray-50 text-gray-700",
    },
    inactive: {
      label: "Inactivo",
      className: "border-gray-200 bg-white text-gray-400",
    },
  }

const GENRE_FILTERS = [
  "Todos",
  "Indie",
  "Electronic",
  "Folk",
  "Soul",
  "House",
  "Pop",
]

// ── Sección principal ────────────────────────────────────────────────────────

const ARTISTS_PER_PAGE = 3

export function ArtistsSection() {
  const [artists, setArtists] = useState<PromoterArtist[]>(
    MOCK_PROMOTER_ARTISTS,
  )
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ArtistStatus | "all">("all")
  const [genreFilter, setGenreFilter] = useState("Todos")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "events">("name")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [artistsPage, setArtistsPage] = useState(1)

  const filtered = useMemo(() => {
    return artists
      .filter((a) => {
        const matchSearch =
          search.trim() === "" ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.genres.some((g) =>
            g.toLowerCase().includes(search.toLowerCase()),
          )
        const matchStatus =
          statusFilter === "all" || a.status === statusFilter
        const matchGenre =
          genreFilter === "Todos" ||
          a.genres.some((g) =>
            g.toLowerCase().includes(genreFilter.toLowerCase()),
          )
        return matchSearch && matchStatus && matchGenre
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.avgRating - a.avgRating
        if (sortBy === "events") return b.eventsPlayed - a.eventsPlayed
        return a.name.localeCompare(b.name)
      })
  }, [artists, search, statusFilter, genreFilter, sortBy])

  const totalArtistPages = Math.ceil(filtered.length / ARTISTS_PER_PAGE)
  const pagedArtists = filtered.slice(
    (artistsPage - 1) * ARTISTS_PER_PAGE,
    artistsPage * ARTISTS_PER_PAGE,
  )

  function handleDelete(id: number) {
    setArtists((prev) => prev.filter((a) => a.id !== id))
    setDeleteId(null)
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-black" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Cartera
            </p>
          </div>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-black">
            Tus artistas
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {artists.length} artistas · {artists.filter((a) => a.status === "confirmed").length} confirmados
          </p>
        </div>
        <Link
          href="/promoter/artists/new"
          className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo artista
        </Link>
      </div>

      {/* Controles: búsqueda + filtros + orden */}
      <div className="mb-6 space-y-3">
        {/* Buscador */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all focus-within:border-black">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setArtistsPage(1) }}
            placeholder="Buscar por nombre o género…"
            className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs font-bold text-gray-400 hover:text-black"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros y orden en fila */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 shrink-0 text-gray-400" />

          {/* Status */}
          {(["all", "confirmed", "negotiating", "available", "inactive"] as const).map((s) => (
            <Pill
              key={s}
              active={statusFilter === s}
              onClick={() => { setStatusFilter(s); setArtistsPage(1) }}
            >
              {s === "all"
                ? "Todos"
                : STATUS_META[s as ArtistStatus].label}
            </Pill>
          ))}

          <span className="h-4 w-px bg-gray-200" />

          {/* Géneros */}
          {GENRE_FILTERS.map((g) => (
            <Pill
              key={g}
              active={genreFilter === g}
              onClick={() => { setGenreFilter(g); setArtistsPage(1) }}
            >
              {g}
            </Pill>
          ))}

          <span className="h-4 w-px bg-gray-200" />

          {/* Orden */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Ordenar:
          </span>
          <Pill active={sortBy === "name"} onClick={() => setSortBy("name")}>
            A–Z
          </Pill>
          <Pill active={sortBy === "rating"} onClick={() => setSortBy("rating")}>
            Nota
          </Pill>
          <Pill active={sortBy === "events"} onClick={() => setSortBy("events")}>
            Eventos
          </Pill>
        </div>
      </div>

      {/* Grid de artistas */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
            <Music2 className="h-5 w-5 text-black" />
          </div>
          <p className="mt-4 text-lg font-black text-black">
            Sin resultados
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Prueba con otros filtros o añade un artista nuevo.
          </p>
          <Link
            href="/promoter/artists/new"
            className="mt-5 flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800"
          >
            <Plus className="h-3 w-3" />
            Añadir artista
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {pagedArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                expanded={expandedId === artist.id}
                onToggle={() =>
                  setExpandedId(expandedId === artist.id ? null : artist.id)
                }
                onDelete={() => setDeleteId(artist.id)}
              />
            ))}
          </div>

          {/* Paginación artistas */}
          {totalArtistPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setArtistsPage((p) => Math.max(1, p - 1))}
                disabled={artistsPage === 1}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black disabled:opacity-30"
              >
                ← Anterior
              </button>
              <span className="text-xs font-bold text-gray-500">
                {artistsPage} / {totalArtistPages}
              </span>
              <button
                onClick={() => setArtistsPage((p) => Math.min(totalArtistPages, p + 1))}
                disabled={artistsPage === totalArtistPages}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:border-black disabled:opacity-30"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirm delete modal */}
      {deleteId !== null && (
        <ConfirmDeleteModal
          artist={artists.find((a) => a.id === deleteId)!}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </section>
  )
}

// ── Artist Card ──────────────────────────────────────────────────────────────

function ArtistCard({
  artist,
  expanded,
  onToggle,
  onDelete,
}: {
  artist: PromoterArtist
  expanded: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const meta = STATUS_META[artist.status]

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all hover:border-black hover:shadow-lg">
      {/* Cabecera siempre visible */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {/* Foto */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover grayscale"
          />
        </div>

        {/* Info principal */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${meta.className}`}
                >
                  {meta.label}
                </span>
                {artist.nextEventId && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Próximo evento →
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 text-xl font-black leading-tight text-black">
                {artist.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {artist.origin}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {artist.genres.join(" · ")}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Nota
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="text-lg font-black text-black">
                  {artist.avgRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="grid grid-cols-3 gap-2">
            <InlineStat
              icon={Calendar}
              label="Eventos"
              value={artist.eventsPlayed.toString()}
            />
            <InlineStat
              icon={Users}
              label="Seguidores"
              value={artist.followers}
            />
            <InlineStat icon={Euro} label="Caché" value={artist.fee} />
          </div>

          {/* Géneros chips */}
          <div className="flex flex-wrap gap-1.5">
            {artist.genres.map((g) => (
              <span
                key={g}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-700"
              >
                {g}
              </span>
            ))}
            {artist.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-100 bg-white px-2.5 py-1 text-[10px] font-semibold italic text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Panel expandible con transición */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ArtistDetail artist={artist} />
        </div>
      </div>

      {/* Footer acciones */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-5 py-3">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black hover:text-gray-600"
        >
          {expanded ? "Ver menos" : "Ver ficha completa"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          {/* Contacto rápido */}
          <a
            href={`mailto:${artist.contact}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-black hover:text-black"
            title="Contactar"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
          {artist.socialInstagram && (
            <a
              href={artist.socialInstagram}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-black hover:text-black"
              title="Instagram"
            >
              <Link2 className="h-3.5 w-3.5" />
            </a>
          )}
          {artist.socialSpotify && (
            <a
              href={artist.socialSpotify}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-black hover:text-black"
              title="Spotify"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <span className="h-4 w-px bg-gray-200" />

          <Link
            href={`/promoter/artists/${artist.id}/edit`}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:border-black"
          >
            <Pencil className="h-3 w-3" />
            Editar
          </Link>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-all hover:border-black hover:text-black"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <Link
            href={`/promoter/artists/${artist.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-black transition-transform group-hover:translate-x-1"
          >
            Ver perfil <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ── Artist Detail (expandible) ───────────────────────────────────────────────

function ArtistDetail({ artist }: { artist: PromoterArtist }) {
  return (
    <div className="space-y-5 border-t border-gray-200 bg-gray-50 p-5">
      {/* Bio */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Biografía
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-800">
          {artist.bio}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Contacto */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Contacto / Manager
          </p>
          <a
            href={`mailto:${artist.contact}`}
            className="mt-1.5 flex items-center gap-2 text-sm font-bold text-black hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            {artist.contact}
          </a>
        </div>

        {/* Redes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Redes sociales
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {artist.socialSpotify && (
              <a
                href={artist.socialSpotify}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black hover:border-black"
              >
                <ExternalLink className="h-3 w-3" />
                Spotify
              </a>
            )}
            {artist.socialInstagram && (
              <a
                href={artist.socialInstagram}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black hover:border-black"
              >
                <Link2 className="h-3 w-3" />
                Instagram
              </a>
            )}
            {!artist.socialSpotify && !artist.socialInstagram && (
              <p className="text-sm text-gray-400">Sin redes añadidas</p>
            )}
          </div>
        </div>
      </div>

      {/* Historial de eventos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Contrataciones contigo
        </p>
        <div className="mt-3 flex items-center gap-6">
          <div>
            <p className="text-2xl font-black text-black">
              {artist.eventsPlayed}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Eventos
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-black text-black" />
              <p className="text-2xl font-black text-black">
                {artist.avgRating.toFixed(1)}
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Nota media
            </p>
          </div>
          <div>
            <p className="text-2xl font-black text-black">{artist.fee}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Caché
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Delete ───────────────────────────────────────────────────────────

function ConfirmDeleteModal({
  artist,
  onConfirm,
  onCancel,
}: {
  artist: PromoterArtist
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-black text-black">
          Eliminar artista
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          ¿Estás segura de que quieres eliminar a{" "}
          <span className="font-bold text-black">{artist.name}</span> de tu
          cartera? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:border-black"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Inline Stat ──────────────────────────────────────────────────────────────

function InlineStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className="mt-0.5 truncate text-xs font-black text-black">{value}</p>
    </div>
  )
}

// ── Pill button ──────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  )
}
