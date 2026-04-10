export interface Event {
  id: number
  title: string
  date: string
  dateIso: string
  time: string
  venue: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string
  description: string
  genre: string
  price: string
  capacity: string
  organizer: string
  ticketUrl?: string
}

export interface SurpriseEvent {
  id: number
  date: string
  time: string
  venue: string
  genre: string
  priceHint: string
}

export interface LastMinuteEvent {
  id: number
  title: string
  date: string
  time: string
  venue: string
  address: string
  imageUrl: string
  originalPrice: string
  discountPrice: string
  discountPct: number // % de descuento
  spotsLeft: number
  totalSpots: number
  ticketUrl?: string
  // Contexto extra del flash deal
  genre: string
  artist: string
  description: string
  reason: "cupos-liberados" | "baja-asistencia" | "cancelacion" | "oferta-relámpago"
  expiresAt: string // ISO date
  doorsOpenAt: string
  viewersNow: number // personas mirando ahora
  instantDelivery: boolean
  setlistPreview?: string[] // 3-5 canciones
  dressCode?: string
  ageRestriction?: string
}

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Primavera Sound 2026",
    date: "29 MAY",
    dateIso: "2026-05-29",
    time: "16:00",
    venue: "Parc del Fòrum",
    address: "Rambla del Prim, 5, 08019 Barcelona",
    latitude: 41.4036,
    longitude: 2.2220,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    description:
      "El festival de música independiente más importante de Europa vuelve al Parc del Fòrum con un cartel repleto de artistas internacionales y nacionales. Tres días de música ininterrumpida con más de 200 actuaciones en 10 escenarios.",
    genre: "Indie / Electronic / Alternative",
    price: "Desde 195€",
    capacity: "50.000 personas/día",
    organizer: "Primavera Sound SL",
    ticketUrl: "#",
  },
  {
    id: 2,
    title: "Sónar Festival",
    date: "18 JUN",
    dateIso: "2026-06-18",
    time: "18:00",
    venue: "Fira de Barcelona",
    address: "Av. Reina Maria Cristina, s/n, 08004 Barcelona",
    latitude: 41.3720,
    longitude: 2.1491,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    description:
      "Sónar es el festival internacional de música avanzada, creatividad y tecnología. Dos sedes — Sónar de Día y Sónar de Noche — con los nombres más influyentes de la música electrónica mundial.",
    genre: "Electronic / Techno / Experimental",
    price: "Desde 85€",
    capacity: "120.000 personas",
    organizer: "Advanced Music SL",
    ticketUrl: "#",
  },
  {
    id: 3,
    title: "Brunch Electronik",
    date: "12 ABR",
    dateIso: "2026-04-12",
    time: "12:00",
    venue: "Parc de la Ciutadella",
    address: "Passeig de Pujades, 1, 08003 Barcelona",
    latitude: 41.3879,
    longitude: 2.1869,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    description:
      "El ciclo de conciertos dominicales al aire libre que fusiona música electrónica en vivo con el ambiente relajado de un domingo en Barcelona. Ideal para disfrutar del parque con buena música.",
    genre: "Electronic / House / Live",
    price: "Desde 18€",
    capacity: "3.000 personas",
    organizer: "Brunch Electronik BCN",
    ticketUrl: "#",
  },
  {
    id: 4,
    title: "Cruïlla Festival",
    date: "10 JUL",
    dateIso: "2026-07-10",
    time: "17:00",
    venue: "Parc del Fòrum",
    address: "Rambla del Prim, 5, 08019 Barcelona",
    latitude: 41.4050,
    longitude: 2.2210,
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    description:
      "Cruïlla es un festival de música multidisciplinar que mezcla géneros musicales con gastronomía y actividades culturales. Un espacio donde la diversidad musical es la protagonista.",
    genre: "World Music / Pop / Rock",
    price: "Desde 75€",
    capacity: "30.000 personas/día",
    organizer: "Crossfingers SL",
    ticketUrl: "#",
  },
  {
    id: 5,
    title: "Sala Razzmatazz",
    date: "19 ABR",
    dateIso: "2026-04-19",
    time: "23:00",
    venue: "Razzmatazz, Poblenou",
    address: "Carrer dels Almogàvers, 122, 08018 Barcelona",
    latitude: 41.3994,
    longitude: 2.1947,
    imageUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    description:
      "Una noche especial en uno de los clubs más icónicos de Barcelona. Cinco salas con distintos sonidos: desde indie rock hasta techno, pasando por pop y electrónica. La sala que nunca duerme.",
    genre: "Club / Electronic / Indie",
    price: "Desde 15€",
    capacity: "5.000 personas",
    organizer: "Razzmatazz Club",
    ticketUrl: "#",
  },
]

export interface RecommendedTrack {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  coverUrl: string
  reason: string // por qué se recomienda
  relatedEventId?: number // evento donde tocará
}

export const MOCK_RECOMMENDED_TRACKS: RecommendedTrack[] = [
  {
    id: 301,
    title: "A Moment Set Aside",
    artist: "The Velvet Echoes",
    album: "Night Drive",
    duration: "3:42",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    reason: "Porque te gustó Sónar 2025",
    relatedEventId: 5,
  },
  {
    id: 302,
    title: "Ciutat Nocturna",
    artist: "Ocellot",
    album: "Estels caiguts",
    duration: "4:15",
    coverUrl:
      "https://images.unsplash.com/photo-1501386761578-eaa54b4a6db5?w=400&q=80",
    reason: "Toca el 14 ABR en Barcelona",
    relatedEventId: 5,
  },
  {
    id: 303,
    title: "Paprika",
    artist: "La Bien Querida",
    album: "Paprika",
    duration: "3:28",
    coverUrl:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
    reason: "Flash deal disponible",
    relatedEventId: 5,
  },
  {
    id: 304,
    title: "Gimnàstica passiva",
    artist: "Hidrogenesse",
    album: "Un dígito binario dudoso",
    duration: "4:02",
    coverUrl:
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80",
    reason: "Descubrimiento semanal",
  },
  {
    id: 305,
    title: "Hypersonic",
    artist: "Kaiser Chiefs",
    album: "Kaiser Chiefs' Easy Eighth Album",
    duration: "3:15",
    coverUrl:
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80",
    reason: "Basado en tu historial",
  },
]

export const MOCK_SURPRISE_EVENTS: SurpriseEvent[] = [
  {
    id: 101,
    date: "26 ABR",
    time: "21:00",
    venue: "Sala Apolo, Barcelona",
    genre: "Electronic / Live",
    priceHint: "~20€",
  },
  {
    id: 102,
    date: "02 MAY",
    time: "22:30",
    venue: "Razzmatazz, Barcelona",
    genre: "Indie / Alternative",
    priceHint: "~15€",
  },
  {
    id: 103,
    date: "09 MAY",
    time: "20:00",
    venue: "Palau Sant Jordi",
    genre: "Pop / Rock",
    priceHint: "~45€",
  },
]

export const MOCK_LAST_MINUTE: LastMinuteEvent[] = [
  {
    id: 201,
    title: "La Bien Querida",
    artist: "La Bien Querida",
    date: "HOY",
    time: "21:30",
    doorsOpenAt: "20:30",
    venue: "Sala 2 Razzmatazz",
    address: "Carrer dels Almogàvers, 122, 08018 Barcelona",
    imageUrl:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    originalPrice: "22€",
    discountPrice: "12€",
    discountPct: 45,
    spotsLeft: 18,
    totalSpots: 400,
    ticketUrl: "#",
    genre: "Indie / Pop",
    description:
      "Concierto íntimo de La Bien Querida en la sala 2 de Razzmatazz. Formato reducido, solo con banda y repaso de su último disco 'Paprika'.",
    reason: "cupos-liberados",
    expiresAt: "2026-04-08T20:00:00",
    viewersNow: 34,
    instantDelivery: true,
    setlistPreview: [
      "De momento abril",
      "Nuestra cancion",
      "Muero de amor",
      "Fiesta",
    ],
    dressCode: "Libre",
    ageRestriction: "+18",
  },
  {
    id: 202,
    title: "Hidrogenesse",
    artist: "Hidrogenesse",
    date: "MAÑANA",
    time: "22:00",
    doorsOpenAt: "21:00",
    venue: "Sala Barts",
    address: "Av. del Paral·lel, 62, 08001 Barcelona",
    imageUrl:
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    originalPrice: "18€",
    discountPrice: "9€",
    discountPct: 50,
    spotsLeft: 34,
    totalSpots: 600,
    ticketUrl: "#",
    genre: "Electro Pop / Experimental",
    description:
      "El dúo barcelonés presenta su repertorio clásico con nuevas versiones electrónicas. Una noche para bailar y cantar sus himnos generacionales.",
    reason: "baja-asistencia",
    expiresAt: "2026-04-09T21:00:00",
    viewersNow: 21,
    instantDelivery: true,
    setlistPreview: [
      "El amor por la música",
      "Gimnàstica passiva",
      "Disfraz de tigre",
    ],
    ageRestriction: "+16",
  },
  {
    id: 203,
    title: "Ocellot",
    artist: "Ocellot",
    date: "14 ABR",
    time: "20:30",
    doorsOpenAt: "20:00",
    venue: "Heliogàbal",
    address: "Carrer de Ramón y Cajal, 80, 08012 Barcelona",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eaa54b4a6db5?w=800&q=80",
    originalPrice: "12€",
    discountPrice: "6€",
    discountPct: 50,
    spotsLeft: 9,
    totalSpots: 80,
    ticketUrl: "#",
    genre: "Folk / Indie",
    description:
      "Sesión acústica muy íntima en el mítico Heliogàbal de Gràcia. Apenas 80 plazas, cerveza artesana y guitarra eléctrica.",
    reason: "oferta-relámpago",
    expiresAt: "2026-04-14T19:30:00",
    viewersNow: 52,
    instantDelivery: true,
    setlistPreview: [
      "Estels caiguts",
      "Matí d'hivern",
      "Camí de casa",
      "L'últim ball",
    ],
    dressCode: "Casual",
    ageRestriction: "+18",
  },
]

// ── Historial de eventos asistidos ──────────────────────────────────────────

export interface AttendedEvent {
  id: number
  eventId: number
  title: string
  date: string
  venue: string
  imageUrl: string
  genre: string
  userRating: number // valoración global (1-5)
  attendedAt: string
  // Valoración detallada por categorías (1-5)
  ratings: {
    artista: number
    sonido: number
    ambiente: number
    sala: number
    repertorio: number
  }
  comment?: string
  photoUrl?: string
  pointsEarned: number
  communityAvg: number // media de la comunidad para comparar
  pending?: boolean // asistió pero aún no ha valorado
  helpfulCount?: number // cuánta gente marcó útil tu review
}

export const MOCK_ATTENDED: AttendedEvent[] = [
  {
    id: 1,
    eventId: 1,
    title: "Primavera Sound 2025",
    date: "30 MAY 2025",
    venue: "Parc del Fòrum",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    genre: "Indie / Alternative",
    userRating: 5,
    attendedAt: "2025-05-30",
    ratings: { artista: 5, sonido: 5, ambiente: 5, sala: 4, repertorio: 5 },
    comment:
      "Uno de los mejores festivales a los que he ido. La vibra del Parc del Fòrum es única y el cartel superó expectativas.",
    photoUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    pointsEarned: 75,
    communityAvg: 4.6,
    helpfulCount: 42,
  },
  {
    id: 7,
    eventId: 5,
    title: "Sala Apolo — The Velvet Echoes",
    date: "05 ABR 2026",
    venue: "Sala Apolo",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    genre: "Indie / Rock",
    userRating: 0,
    attendedAt: "2026-04-05",
    ratings: { artista: 0, sonido: 0, ambiente: 0, sala: 0, repertorio: 0 },
    pointsEarned: 0,
    communityAvg: 4.3,
    pending: true,
  },
  {
    id: 8,
    eventId: 3,
    title: "Brunch Electronik — Domingo de abril",
    date: "03 ABR 2026",
    venue: "Parc de la Ciutadella",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    genre: "Electronic / House",
    userRating: 0,
    attendedAt: "2026-04-03",
    ratings: { artista: 0, sonido: 0, ambiente: 0, sala: 0, repertorio: 0 },
    pointsEarned: 0,
    communityAvg: 4.1,
    pending: true,
  },
  {
    id: 2,
    eventId: 5,
    title: "Sala Razzmatazz — The Klaxons",
    date: "12 MAR 2025",
    venue: "Razzmatazz, Poblenou",
    imageUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    genre: "Indie / Electronic",
    userRating: 4,
    attendedAt: "2025-03-12",
    ratings: { artista: 5, sonido: 3, ambiente: 4, sala: 4, repertorio: 4 },
    comment: "Concierto increíble, aunque el sonido en la Sala 1 podría mejorar.",
    pointsEarned: 50,
    communityAvg: 4.1,
    helpfulCount: 18,
  },
  {
    id: 3,
    eventId: 2,
    title: "Sónar Festival 2025",
    date: "19 JUN 2025",
    venue: "Fira de Barcelona",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    genre: "Electronic / Techno",
    userRating: 5,
    attendedAt: "2025-06-19",
    ratings: { artista: 5, sonido: 5, ambiente: 5, sala: 5, repertorio: 5 },
    comment: "El Sónar es otra dimensión. Sonido brutal y público super receptivo.",
    photoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    pointsEarned: 75,
    communityAvg: 4.7,
  },
  {
    id: 4,
    eventId: 3,
    title: "Brunch Electronik",
    date: "06 ABR 2025",
    venue: "Parc de la Ciutadella",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    genre: "Electronic / House",
    userRating: 4,
    attendedAt: "2025-04-06",
    ratings: { artista: 4, sonido: 4, ambiente: 5, sala: 4, repertorio: 3 },
    pointsEarned: 50,
    communityAvg: 4.2,
  },
  {
    id: 5,
    eventId: 4,
    title: "Cruïlla Festival 2025",
    date: "11 JUL 2025",
    venue: "Parc del Fòrum",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    genre: "World / Pop / Rock",
    userRating: 3,
    attendedAt: "2025-07-11",
    ratings: { artista: 3, sonido: 3, ambiente: 4, sala: 3, repertorio: 2 },
    comment: "Esperaba más del cartel, aunque el ambiente salvó la noche.",
    pointsEarned: 50,
    communityAvg: 3.8,
  },
  {
    id: 6,
    eventId: 1,
    title: "Concierto íntimo — Núria Graham",
    date: "22 FEB 2025",
    venue: "Sala Apolo",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    genre: "Folk / Indie",
    userRating: 5,
    attendedAt: "2025-02-22",
    ratings: { artista: 5, sonido: 5, ambiente: 5, sala: 4, repertorio: 5 },
    comment: "Mágico. Un formato íntimo perfecto para disfrutar de su voz.",
    photoUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80",
    pointsEarned: 75,
    communityAvg: 4.8,
  },
]

// ── Reviews / valoraciones de eventos ──────────────────────────────────────

export interface Review {
  id: number
  eventId: number
  author: string
  avatar: string
  rating: number // 1-5
  date: string
  comment: string
  helpful: number
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    eventId: 1,
    author: "Marta G.",
    avatar: "M",
    rating: 5,
    date: "Hace 2 días",
    comment:
      "Increíble experiencia. El cartel fue espectacular y la organización impecable. Los escenarios muy bien distribuidos y el sonido potente. 100% volvería.",
    helpful: 24,
  },
  {
    id: 2,
    eventId: 1,
    author: "Jordi R.",
    avatar: "J",
    rating: 4,
    date: "Hace 5 días",
    comment:
      "Muy buen festival en general. Los artistas principales estuvieron a la altura. Solo le quito una estrella por las colas en la barra — demasiada gente.",
    helpful: 12,
  },
  {
    id: 3,
    eventId: 1,
    author: "Laia M.",
    avatar: "L",
    rating: 5,
    date: "Hace 1 semana",
    comment:
      "Uno de los mejores festivales a los que he ido. La vibra del Parc del Fòrum es única y el cartel este año superó expectativas.",
    helpful: 31,
  },
  {
    id: 4,
    eventId: 1,
    author: "Pol S.",
    avatar: "P",
    rating: 4,
    date: "Hace 1 semana",
    comment:
      "Genial, aunque algo caro. Pero la experiencia lo compensa. Descubrí a varios grupos nuevos que ahora escucho a diario.",
    helpful: 8,
  },
  {
    id: 5,
    eventId: 2,
    author: "Aina B.",
    avatar: "A",
    rating: 5,
    date: "Hace 3 días",
    comment:
      "El Sónar es otra dimensión. La parte de noche fue una locura, sonido brutal y público super receptivo. Imperdible.",
    helpful: 18,
  },
  {
    id: 6,
    eventId: 2,
    author: "Marc T.",
    avatar: "M",
    rating: 4,
    date: "Hace 4 días",
    comment:
      "Me encantó la propuesta artística y la combinación con tecnología. El Sónar+D estuvo muy interesante.",
    helpful: 9,
  },
  {
    id: 7,
    eventId: 5,
    author: "Clara V.",
    avatar: "C",
    rating: 5,
    date: "Hace 2 semanas",
    comment:
      "Razzmatazz nunca decepciona. Ambiente perfecto, buenísima selección de música y el local tiene ese toque especial.",
    helpful: 15,
  },
]

// ── Promotora: Artistas ─────────────────────────────────────────────────────

export type ArtistStatus = "CONFIRMED" | "NEGOTIATING" | "AVAILABLE" | "INACTIVE"

export interface PromoterArtist {
  id: string          // UUID devuelto por el backend
  promoterId?: string
  name: string
  imageUrl: string
  genres: string[]
  origin: string
  bio: string
  status: ArtistStatus
  fee: string         // caché aproximado
  eventsPlayed: number
  avgRating?: number  // no existe en el backend; reservado para uso futuro
  followers: string   // seguidores en redes
  contact: string     // email o manager
  socialSpotify?: string
  socialInstagram?: string
  tags: string[]      // etiquetas libres
  nextEventId?: string
  createdAt: string
}

export const MOCK_PROMOTER_ARTISTS: PromoterArtist[] = [
  {
    id: "mock-2001",
    name: "The Velvet Echoes",
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    genres: ["Indie", "Alternative", "Shoegaze"],
    origin: "Barcelona, ES",
    bio: "Cuarteto barcelonés que mezcla el shoegaze de los 90 con producción electrónica contemporánea. Formados en 2018, han publicado dos EPs y un LP aclamado por la crítica.",
    status: "CONFIRMED",
    fee: "1.500–2.500€",
    eventsPlayed: 4,
    avgRating: 4.7,
    followers: "12.4K",
    contact: "mgmt@velvetechoes.com",
    socialSpotify: "#",
    socialInstagram: "#",
    tags: ["directo potente", "rider sencillo", "bilingüe"],
    createdAt: "2025-09-12",
  },
  {
    id: "mock-2002",
    name: "Noa Vidal",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    genres: ["Electronic", "Techno", "Ambient"],
    origin: "Valencia, ES",
    bio: "DJ y productora residente en Valencia. Su sonido transita entre el techno industrial y el ambient más cinematográfico. Habitual en los mejores clubs del circuito europeo.",
    status: "CONFIRMED",
    fee: "800–1.200€",
    eventsPlayed: 6,
    avgRating: 4.9,
    followers: "28.1K",
    contact: "noavidal@booking.es",
    socialSpotify: "#",
    socialInstagram: "#",
    tags: ["set 3h", "equipo propio", "exclusividad"],
    createdAt: "2025-11-03",
  },
  {
    id: "mock-2003",
    name: "Cesc & La Banda",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eaa54b4a6db5?w=800&q=80",
    genres: ["Folk", "Indie", "Americana"],
    origin: "Girona, ES",
    bio: "Cesc Puig lidera este sexteto de folk mediterráneo. Sus actuaciones en directo son conocidas por la energía desbordante y la conexión con el público.",
    status: "NEGOTIATING",
    fee: "1.000–1.800€",
    eventsPlayed: 2,
    avgRating: 4.5,
    followers: "7.8K",
    contact: "cesc@gestionmusical.cat",
    socialInstagram: "#",
    tags: ["gran formato", "versátil", "familiar"],
    createdAt: "2026-01-20",
  },
  {
    id: "mock-2004",
    name: "Kiara Moon",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    genres: ["Soul", "R&B", "Jazz"],
    origin: "Madrid, ES",
    bio: "Voz prodigiosa del soul español. Con influencias de Amy Winehouse y Erykah Badu, Kiara ha actuado en festivales internacionales y colaborado con artistas de primer nivel.",
    status: "AVAILABLE",
    fee: "2.000–3.500€",
    eventsPlayed: 1,
    avgRating: 5.0,
    followers: "41.2K",
    contact: "booking@kiaramoon.com",
    socialSpotify: "#",
    socialInstagram: "#",
    tags: ["festival", "banda 5 pax", "rider técnico"],
    createdAt: "2026-02-14",
  },
  {
    id: "mock-2005",
    name: "DJ Lúmen",
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    genres: ["House", "Electronic", "Disco"],
    origin: "Barcelona, ES",
    bio: "Residente histórico en el circuito de clubs de Barcelona. Más de 15 años haciendo bailar a las mejores salas de la ciudad con su house melódico.",
    status: "AVAILABLE",
    fee: "600–900€",
    eventsPlayed: 8,
    avgRating: 4.4,
    followers: "19.3K",
    contact: "dj.lumen@gmail.com",
    socialInstagram: "#",
    tags: ["gran experiencia", "asequible", "flexible"],
    createdAt: "2025-07-30",
  },
  {
    id: "mock-2006",
    name: "Ester Fontaine",
    imageUrl:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    genres: ["Indie Pop", "Dream Pop", "Synth"],
    origin: "Lyon, FR",
    bio: "Cantautora franco-catalana afincada en Barcelona. Su pop etéreo con sintetizadores analógicos la ha convertido en una de las revelaciones del circuito indie europeo.",
    status: "INACTIVE",
    fee: "1.200–2.000€",
    eventsPlayed: 3,
    avgRating: 4.6,
    followers: "15.7K",
    contact: "ester@artistesfontaine.fr",
    socialSpotify: "#",
    tags: ["gira europea", "baja disponibilidad"],
    createdAt: "2025-10-05",
  },
]

// ── Promotora: Eventos gestionados ──────────────────────────────────────────

export type PromoterEventStatus =
  | "draft"
  | "pending-review"
  | "published"
  | "live"
  | "completed"
  | "cancelled"

export interface PromoterEvent {
  id: number
  title: string
  date: string
  dateIso: string
  venue: string
  imageUrl: string
  genre: string
  status: PromoterEventStatus
  capacity: number
  ticketsSold: number
  revenue: number // €
  avgRating: number // 1-5
  reviewsCount: number
  ticketPrice: number
  createdAt: string
}

export const MOCK_PROMOTER_EVENTS: PromoterEvent[] = [
  {
    id: 1001,
    title: "Night Waves · Sesión Electrónica",
    date: "12 ABR 2026",
    dateIso: "2026-04-12",
    venue: "Sala Apolo",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    genre: "Electronic / Techno",
    status: "published",
    capacity: 1200,
    ticketsSold: 874,
    revenue: 21850,
    avgRating: 0,
    reviewsCount: 0,
    ticketPrice: 25,
    createdAt: "2026-02-10",
  },
  {
    id: 1002,
    title: "Indie Rooftop · Primavera",
    date: "20 ABR 2026",
    dateIso: "2026-04-20",
    venue: "La Pedrera Rooftop",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    genre: "Indie / Alternative",
    status: "pending-review",
    capacity: 300,
    ticketsSold: 0,
    revenue: 0,
    avgRating: 0,
    reviewsCount: 0,
    ticketPrice: 18,
    createdAt: "2026-04-01",
  },
  {
    id: 1003,
    title: "Folk Sessions · Acústico",
    date: "03 MAY 2026",
    dateIso: "2026-05-03",
    venue: "Heliogàbal",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eaa54b4a6db5?w=800&q=80",
    genre: "Folk / Singer-Songwriter",
    status: "draft",
    capacity: 80,
    ticketsSold: 0,
    revenue: 0,
    avgRating: 0,
    reviewsCount: 0,
    ticketPrice: 12,
    createdAt: "2026-04-05",
  },
  {
    id: 1004,
    title: "House Underground · Open Air",
    date: "22 MAR 2026",
    dateIso: "2026-03-22",
    venue: "Parc del Fòrum",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    genre: "Electronic / House",
    status: "completed",
    capacity: 2000,
    ticketsSold: 1950,
    revenue: 58500,
    avgRating: 4.7,
    reviewsCount: 342,
    ticketPrice: 30,
    createdAt: "2026-01-15",
  },
  {
    id: 1005,
    title: "Velvet Nights · Showcase",
    date: "15 FEB 2026",
    dateIso: "2026-02-15",
    venue: "Razzmatazz",
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    genre: "Indie / Rock",
    status: "completed",
    capacity: 1000,
    ticketsSold: 912,
    revenue: 18240,
    avgRating: 4.3,
    reviewsCount: 198,
    ticketPrice: 20,
    createdAt: "2025-12-20",
  },
  {
    id: 1006,
    title: "Techno Cathedral",
    date: "05 ENE 2026",
    dateIso: "2026-01-05",
    venue: "Fira de Barcelona",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    genre: "Techno / Industrial",
    status: "completed",
    capacity: 1500,
    ticketsSold: 1430,
    revenue: 42900,
    avgRating: 4.8,
    reviewsCount: 289,
    ticketPrice: 30,
    createdAt: "2025-10-10",
  },
  {
    id: 1007,
    title: "Jazz Lounge · Winter Edition",
    date: "18 DIC 2025",
    dateIso: "2025-12-18",
    venue: "Palau de la Música",
    imageUrl:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    genre: "Jazz / Soul",
    status: "completed",
    capacity: 600,
    ticketsSold: 540,
    revenue: 16200,
    avgRating: 4.5,
    reviewsCount: 112,
    ticketPrice: 30,
    createdAt: "2025-09-05",
  },
]

