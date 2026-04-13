# GresK — Sistema de Autenticación y Roles

## Descripción general
Auth simulada sin backend. El login siempre tiene éxito (offline-tolerant).
El rol del usuario determina qué ve y a dónde se redirige.

---

## Tipos

```ts
// lib/auth-context.tsx
type UserRole = "user" | "promoter"

interface AuthContext {
  isLoggedIn: boolean
  role: UserRole | null
  login: (role?: UserRole) => void
  logout: () => void
}
```

---

## Persistencia

El rol se guarda en `localStorage` con la clave `gresk_role`:
```ts
localStorage.setItem("gresk_role", role)   // al hacer login
localStorage.removeItem("gresk_role")       // al hacer logout
```

Al montar `AuthProvider`, se lee `gresk_role` para restaurar la sesión.

---

## Flujo de login

1. Usuario abre `AuthModal` (botón "Registro / Login" en navbar)
2. Selecciona rol con `RoleSelector`: **Usuario** | **Promotora**
3. Rellena email/password (no se validan — cualquier valor funciona)
4. Se llama `login(role)` → guarda en localStorage → actualiza contexto
5. Redirección automática:
   - `role === "user"` → `router.push("/feed")`
   - `role === "promoter"` → `router.push("/promoter")`

---

## Navbar role-aware

```tsx
const { isLoggedIn, role, logout } = useAuth()
const isPromoter = role === "promoter"

// Logo: si promotora → href="/promoter", badge "Promotora"
// Menú usuario: Descubrir, Mis Eventos
// Menú promotora: Panel, + Nuevo evento
```

---

## Componentes afectados por rol

| Componente/Página | Comportamiento según rol |
|---|---|
| `Navbar` | Menú diferente, badge "Promotora" en logo |
| `/` (homepage) | Público, sin diferencia de rol |
| `/feed` | Solo usuarios (no protegido técnicamente, pero el flujo lleva aquí) |
| `/promoter` | Solo promotoras (no protegido técnicamente) |
| `AuthModal` | Selector de rol antes de login/registro |

---

## Notas importantes

- **No hay guards de ruta**: cualquiera puede acceder a cualquier URL manualmente. La protección es solo visual/de flujo.
- **Login siempre exitoso**: no hay llamada a API. Si el servidor estuviera caído, el login seguiría funcionando.
- **Logout**: limpia localStorage y resetea el contexto. No redirige automáticamente (la navbar simplemente cambia).
- **Estado inicial**: `isLoggedIn: false`, `role: null` hasta que se restaura de localStorage.
