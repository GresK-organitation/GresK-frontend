# GresK — Design System

## Filosofía: Hybrid Luminoso
Fondo blanco puro + tipografía bold negra + imágenes en escala de grises.
Sin colores de acento. Minimalista, legible, alta jerarquía visual.

---

## Paleta de colores

| Rol              | Valor Tailwind          | Hex       |
|------------------|-------------------------|-----------|
| Background       | `bg-white`              | #FFFFFF   |
| Foreground       | `text-black`            | #000000   |
| Surface          | `bg-gray-50`            | #F9FAFB   |
| Border           | `border-gray-200`       | #E5E7EB   |
| Text muted       | `text-gray-500`         | #6B7280   |
| Text subtle      | `text-gray-400`         | #9CA3AF   |
| Overlay dark     | `bg-black/90`           | —         |
| Badge primary    | `bg-black text-white`   | —         |

**Regla**: No usar colores de acento (rojo, amarillo, púrpura). Todo en escala de grises/negro.

---

## Tipografía

**Fuente**: Geist Sans (variable `--font-geist-sans`)

| Rol              | Clases Tailwind                                        |
|------------------|--------------------------------------------------------|
| Logo/marca       | `text-2xl font-black tracking-tighter`                 |
| Título hero      | `text-3xl md:text-4xl font-black`                      |
| Título sección   | `text-2xl font-black`                                  |
| Eyebrow label    | `text-xs font-bold uppercase tracking-widest`          |
| Eyebrow muted    | `text-[10px] font-bold uppercase tracking-widest text-gray-500` |
| Body             | `text-sm font-medium text-gray-500`                    |
| Badge/chip texto | `text-xs font-bold`                                    |
| Precio           | `text-base font-black` / `text-xl font-black`          |

---

## Espaciado y layout

- **Max width contenido**: `max-w-4xl` (feed, eventos detalle) / `max-w-7xl` (homepage)
- **Padding horizontal**: `px-4 md:px-8`
- **Padding top** (bajo navbar fija): `pt-24`
- **Padding bottom**: `pb-16`
- **Gap entre secciones**: `mb-12` / `mb-16`

---

## Componentes UI

### Cards
```
rounded-3xl border border-gray-200 bg-white
hover: hover:shadow-lg (transition-all)
padding interno: p-5 / p-6
```

### Pills / Badges
```
rounded-full bg-black px-3 py-1 text-xs font-bold text-white   ← primario
rounded-full border border-gray-200 bg-white px-3 py-1          ← secundario
rounded-full bg-white px-2.5 py-1 text-xs font-bold text-black  ← sobre imagen
```

### Botones
```
rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800   ← primario
rounded-full border border-gray-300 bg-white text-black hover:border-black  ← secundario
```

### Imágenes
**Siempre**: `className="object-cover grayscale"` — sin excepciones.

### Overlay en imágenes
```
bg-gradient-to-t from-black/90 via-black/30 to-transparent   ← hero
bg-gradient-to-t from-black/60 to-transparent                  ← cards pequeñas
```

---

## Animaciones

### Progress bar animada
```tsx
const [animatedPct, setAnimatedPct] = useState(0)
useEffect(() => {
  const t = setTimeout(() => setAnimatedPct(target), 120)
  return () => clearTimeout(t)
}, [target])
// En el div: style={{ width: `${animatedPct}%` }}
// Clase: transition-all duration-700 ease-out
```

### Expand/collapse sin JS
```css
/* contenedor hijo con min-h-0 overflow-hidden */
/* contenedor padre con transition-[grid-template-rows] duration-300 */
grid-template-rows: 0fr  →  1fr
```

### Countdown (HH:MM:SS)
```tsx
useEffect(() => {
  const id = setInterval(() => { /* recalcular diff */ }, 1000)
  return () => clearInterval(id)
}, [])
```

---

## Navbar
- Fixed: `fixed top-0 left-0 right-0 z-50 h-16`
- Background: `bg-white/95 backdrop-blur-md`
- Border: `border-b border-gray-200`
- Logo: `text-2xl font-black tracking-tighter text-black`

---

## Componentes reutilizables clave

| Componente | Ruta | Uso |
|---|---|---|
| `Navbar` | `components/dashboard/navbar.tsx` | Todas las páginas |
| `TierCard` | `components/dashboard/tier-card.tsx` | Feed usuario |
| `EventMap` | `components/dashboard/event-map.tsx` | Homepage |
| `EventStrip` | `components/dashboard/event-strip.tsx` | Homepage |
| `ArtistsSection` | `components/promoter/artists-section.tsx` | Panel promotora |
| `AuthModal` | `components/auth/auth-modal.tsx` | Login/registro |
| `Sparkles` | `components/ui/sparkles.tsx` | Decoración tier |
