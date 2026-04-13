# GresK — Tipos e Interfaces

Todos los tipos viven en `lib/mock-data.ts`. No hay backend — los datos son arrays exportados como constantes.

---

## Tipos principales

### `Event` — Evento estándar
```ts
interface Event {
  id: number
  title: string
  date: string          // "29 MAY"
  dateIso: string       // "2026-05-29"
  time: string          // "16:00"
  venue: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string
  description: string
  genre: string
  price: string         // "Desde 195€"
  capacity: string      // "50.000 personas/día"
  organizer: string
  ticketUrl?: string
}
// Exportado como: MOCK_EVENTS (5 eventos)
```

### `LastMinuteEvent` — Flash deal
```ts
interface LastMinuteEvent {
  id: number
  title: string
  date: string          // "HOY" | "MAÑANA" | "14 ABR"
  time: string
  venue: string
  address: string
  imageUrl: string
  originalPrice: string // "22€"
  discountPrice: string // "12€"
  discountPct: number   // 45
  spotsLeft: number
  totalSpots: number
  ticketUrl?: string
  genre: string
  artist: string
  description: string
  reason: "cupos-liberados" | "baja-asistencia" | "cancelacion" | "oferta-relámpago"
  expiresAt: string     // ISO datetime
  doorsOpenAt: string   // "20:30"
  viewersNow: number    // personas mirando ahora
  instantDelivery: boolean
  setlistPreview?: string[]  // 3-5 canciones
  dressCode?: string
  ageRestriction?: string
}
// Exportado como: MOCK_LAST_MINUTE (3 eventos)
```

### `AttendedEvent` — Evento asistido (Mis Eventos)
```ts
interface AttendedEvent {
  id: number
  title: string
  date: string
  venue: string
  imageUrl: string
  genre: string
  price: string
  ratings: {            // valoraciones del usuario (null = no valorado aún)
    overall: number | null   // 1-5
    sound: number | null
    crowd: number | null
    venue: number | null
    value: number | null
  }
  comment?: string
  photoUrl?: string
  pointsEarned: number
  communityAvg?: number    // media de la comunidad
  pending?: boolean        // true = aún no valorado
  helpfulCount?: number    // cuántos encontraron útil la reseña
}
// Exportado como: MOCK_ATTENDED_EVENTS (~8 eventos, 2 pending)
```

### `RecommendedTrack` — Canción recomendada
```ts
interface RecommendedTrack {
  id: number
  title: string
  artist: string
  album: string
  duration: string      // "3:42"
  coverUrl: string
  reason: string        // "Porque te gustó Sónar 2025"
  relatedEventId?: number
}
// Exportado como: MOCK_RECOMMENDED_TRACKS (5 tracks)
```

### `PromoterEvent` — Evento de promotora
```ts
interface PromoterEvent {
  id: number
  title: string
  date: string
  venue: string
  imageUrl: string
  genre: string
  ticketsSold: number
  capacity: number
  revenue: string       // "4.200€"
  status: "publicado" | "borrador" | "cancelado" | "agotado" | "pendiente"
  viewsToday: number
  flashDeal?: boolean
}
// Exportado como: MOCK_PROMOTER_EVENTS (7 eventos)
```

### `PromoterArtist` — Artista de promotora
```ts
type ArtistStatus = "disponible" | "en-gira" | "negociando" | "confirmado"

interface PromoterArtist {
  id: number
  name: string
  genres: string[]
  status: ArtistStatus
  photoUrl: string
  bio: string
  socialLinks: {
    spotify?: string
    instagram?: string
    web?: string
  }
  fee?: string          // "Desde 2.000€"
  eventsCount: number   // eventos juntos
  tags: string[]        // ["Fiable", "Puntual", "Electrónica"]
  contactEmail?: string
  contactPhone?: string
}
// Exportado como: MOCK_PROMOTER_ARTISTS (6 artistas)
```

### `SurpriseEvent` — Concierto sorpresa (legado, no usado en UI actual)
```ts
interface SurpriseEvent {
  id: number
  date: string
  time: string
  venue: string
  genre: string
  priceHint: string
}
// Exportado como: MOCK_SURPRISE_EVENTS
```

---

## Constantes exportadas

```ts
export const MOCK_EVENTS: Event[]
export const MOCK_LAST_MINUTE: LastMinuteEvent[]
export const MOCK_ATTENDED_EVENTS: AttendedEvent[]
export const MOCK_RECOMMENDED_TRACKS: RecommendedTrack[]
export const MOCK_PROMOTER_EVENTS: PromoterEvent[]
export const MOCK_PROMOTER_ARTISTS: PromoterArtist[]
export const MOCK_SURPRISE_EVENTS: SurpriseEvent[]
```

---

## Notas

- Los IDs de `AttendedEvent` con `pending: true` son 7 y 8
- `MOCK_EVENTS[0]` es siempre el evento destacado del feed
- `communityAvg` en AttendedEvent representa la media de todos los usuarios, no solo del usuario actual
- `viewersNow` en LastMinuteEvent es estático (no hay WebSocket real)
