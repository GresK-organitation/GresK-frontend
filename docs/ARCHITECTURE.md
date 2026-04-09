# GresK — Arquitectura Frontend

## Stack
- **Framework**: Next.js 16.2.2 — App Router (no Pages Router)
- **Lenguaje**: TypeScript strict
- **Estilos**: Tailwind CSS v4 (PostCSS)
- **Fuentes**: `next/font/google` — Geist Sans + Geist Mono
- **Iconos**: `lucide-react` (⚠️ `Instagram` no existe — usar `Link2`)
- **Imágenes**: `next/image` con `fill` + `object-cover grayscale`
- **Estado global**: React Context (`lib/auth-context.tsx`)
- **Datos**: Mock data estática (`lib/mock-data.ts`) — sin backend real

---

## Estructura de carpetas

```
GresK-frontend/
├── app/                          # App Router — cada carpeta = ruta
│   ├── layout.tsx                # Root layout: fuentes, AuthProvider
│   ├── globals.css               # Variables CSS, reset
│   ├── page.tsx                  # / → Homepage (flash deals + mapa)
│   ├── feed/
│   │   └── page.tsx              # /feed → Feed usuario logueado
│   ├── discover/
│   │   └── page.tsx              # /discover → Búsqueda y filtros
│   ├── events/
│   │   └── [id]/page.tsx         # /events/[id] → Detalle evento (DICE-style)
│   ├── last-minute/
│   │   └── [id]/page.tsx         # /last-minute/[id] → Flash deal detalle
│   ├── my-events/
│   │   ├── page.tsx              # /my-events → Historial + pendientes
│   │   └── [id]/review/page.tsx  # /my-events/[id]/review → Valorar evento
│   └── promoter/
│       ├── page.tsx              # /promoter → Dashboard promotora
│       ├── new-event/page.tsx    # /promoter/new-event → Crear evento (5 pasos)
│       └── artists/
│           └── new/page.tsx      # /promoter/artists/new → Crear artista (4 pasos)
│
├── components/
│   ├── dashboard/
│   │   ├── navbar.tsx            # Navbar fija, role-aware
│   │   ├── tier-card.tsx         # Tarjeta nivel/puntos usuario
│   │   ├── event-map.tsx         # Mapa leaflet con eventos
│   │   └── event-strip.tsx       # Tira horizontal de eventos
│   ├── promoter/
│   │   └── artists-section.tsx   # Gestión artistas promotora (CRUD)
│   ├── auth/
│   │   └── auth-modal.tsx        # Modal login/registro con selector de rol
│   └── ui/                       # Componentes base (shadcn + custom)
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       └── sparkles.tsx          # Animación sparkles SVG
│
├── lib/
│   ├── mock-data.ts              # Todos los tipos e interfaces + datos mock
│   └── auth-context.tsx          # Context: isLoggedIn, role, login, logout
│
└── docs/                         # Esta documentación
```

---

## Rutas y roles

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Homepage: flash deals + mapa |
| `/feed` | Usuario | Feed personalizado |
| `/discover` | Público | Búsqueda de eventos |
| `/events/[id]` | Público | Detalle evento |
| `/last-minute/[id]` | Público | Flash deal detalle |
| `/my-events` | Usuario | Historial de asistencia |
| `/my-events/[id]/review` | Usuario | Formulario valoración |
| `/promoter` | Promotora | Dashboard KPIs + gestión |
| `/promoter/new-event` | Promotora | Crear evento (multi-step) |
| `/promoter/artists/new` | Promotora | Crear artista (multi-step) |

---

## Patrones de código

### Componentes de página
```tsx
"use client"   // siempre en páginas con interactividad
export default function XPage() { ... }
```

### Parámetros de ruta dinámica
```tsx
import { useParams } from "next/navigation"
const { id } = useParams<{ id: string }>()
```

### Formularios multi-step
```tsx
const [step, setStep] = useState(1)
const TOTAL_STEPS = 5
// Cada step renderiza su sección, back/next en pie
```

### Navegación programática
```tsx
import { useRouter } from "next/navigation"
const router = useRouter()
router.push("/feed")
```

### Image con fill (requiere padre con position relative + dimensiones)
```tsx
<div className="relative h-48 w-full">
  <Image src={url} alt={alt} fill className="object-cover grayscale" />
</div>
```

---

## Dependencias clave en package.json
```json
"next": "16.2.2",
"react": "^19",
"tailwindcss": "^4",
"lucide-react": "latest",
"next/font/google": "built-in"
```
