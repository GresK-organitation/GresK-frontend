"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/dashboard/navbar"
import {
  listPromoters,
  approvePromoter,
  listUsers,
  suspendUser,
  activateUser,
  type AdminPromoter,
  type AdminUser,
} from "@/lib/api/admin"

// ── Constantes ───────────────────────────────────────────────────────────────

const CITIES = [
  "Barcelona", "Madrid", "Valencia", "Sevilla", "Bilbao",
  "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas",
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const classes: Record<string, string> = {
    PENDING:   "bg-gray-100 text-gray-600",
    ACTIVE:    "bg-black text-white",
    SUSPENDED: "bg-gray-300 text-gray-800",
    DELETED:   "bg-gray-100 text-gray-400 line-through",
  }
  const labels: Record<string, string> = {
    PENDING:   "Pendiente",
    ACTIVE:    "Activa",
    SUSPENDED: "Suspendida",
    DELETED:   "Eliminada",
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${classes[status] ?? "bg-gray-100 text-gray-500"}`}>
      {labels[status] ?? status}
    </span>
  )
}

const STATUS_OPTIONS = ["", "PENDING", "ACTIVE", "SUSPENDED"]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"promoters" | "users">("promoters")

  // ── Promoters state ───────────────────────────────────────────────────────
  const [promoters, setPromoters]           = useState<AdminPromoter[]>([])
  const [promoStatus, setPromoStatus]       = useState("")
  const [promoCity, setPromoCity]           = useState("")
  const [promoLoading, setPromoLoading]     = useState(false)
  const [promoError, setPromoError]         = useState<string | null>(null)
  const [approvingId, setApprovingId]       = useState<string | null>(null)

  // ── Users state ───────────────────────────────────────────────────────────
  const [users, setUsers]                   = useState<AdminUser[]>([])
  const [userStatus, setUserStatus]         = useState("")
  const [userCity, setUserCity]             = useState("")
  const [usersLoading, setUsersLoading]     = useState(false)
  const [usersError, setUsersError]         = useState<string | null>(null)
  const [actionUserId, setActionUserId]     = useState<string | null>(null)

  // ── Fetch promoters ───────────────────────────────────────────────────────
  const fetchPromoters = useCallback(async () => {
    setPromoLoading(true)
    setPromoError(null)
    try {
      const data = await listPromoters(promoStatus || undefined, promoCity || undefined)
      setPromoters(data)
    } catch {
      setPromoError("Error al cargar promotoras")
    } finally {
      setPromoLoading(false)
    }
  }, [promoStatus, promoCity])

  useEffect(() => {
    if (tab === "promoters") fetchPromoters()
  }, [tab, fetchPromoters])

  // ── Fetch users ───────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const data = await listUsers(userStatus || undefined, userCity || undefined)
      setUsers(data)
    } catch {
      setUsersError("Error al cargar usuarios")
    } finally {
      setUsersLoading(false)
    }
  }, [userStatus, userCity])

  useEffect(() => {
    if (tab === "users") fetchUsers()
  }, [tab, fetchUsers])

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleApprove(id: string) {
    setApprovingId(id)
    try {
      await approvePromoter(id)
      await fetchPromoters()
    } catch {
      alert("Error al aprobar promotora")
    } finally {
      setApprovingId(null)
    }
  }

  async function handleSuspend(id: string) {
    setActionUserId(id)
    try {
      await suspendUser(id)
      await fetchUsers()
    } catch {
      alert("Error al suspender usuario")
    } finally {
      setActionUserId(null)
    }
  }

  async function handleActivate(id: string) {
    setActionUserId(id)
    try {
      await activateUser(id)
      await fetchUsers()
    } catch {
      alert("Error al activar usuario")
    } finally {
      setActionUserId(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Panel de control</p>
          <h1 className="text-3xl font-black mt-1">Admin</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 rounded-full border border-gray-200 bg-gray-50 p-1 w-fit">
          <button
            onClick={() => setTab("promoters")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              tab === "promoters" ? "bg-black text-white" : "text-gray-500 hover:text-black"
            }`}
          >
            Promotoras
          </button>
          <button
            onClick={() => setTab("users")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              tab === "users" ? "bg-black text-white" : "text-gray-500 hover:text-black"
            }`}
          >
            Usuarios
          </button>
        </div>

        {/* ── TAB PROMOTERS ─────────────────────────────────────────────────── */}
        {tab === "promoters" && (
          <section>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={promoStatus}
                onChange={e => setPromoStatus(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-black"
              >
                <option value="">Todos los estados</option>
                {STATUS_OPTIONS.filter(Boolean).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={promoCity}
                onChange={e => setPromoCity(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-black"
              >
                <option value="">Todas las ciudades</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {promoLoading && (
              <p className="text-sm text-gray-500">Cargando…</p>
            )}
            {promoError && (
              <p className="text-sm text-red-500">{promoError}</p>
            )}

            {!promoLoading && !promoError && promoters.length === 0 && (
              <p className="text-sm text-gray-400">Sin resultados</p>
            )}

            {!promoLoading && promoters.length > 0 && (
              <div className="rounded-3xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500">Nombre</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500 hidden md:table-cell">Email</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500 hidden md:table-cell">Ciudad</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500">Estado</th>
                      <th className="px-5 py-3 text-right font-bold text-xs uppercase tracking-widest text-gray-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoters.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}
                      >
                        <td className="px-5 py-4 font-semibold">{p.name}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{p.email}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{p.city}</td>
                        <td className="px-5 py-4">{statusBadge(p.status)}</td>
                        <td className="px-5 py-4 text-right">
                          {p.status === "PENDING" && (
                            <button
                              disabled={approvingId === p.id}
                              onClick={() => handleApprove(p.id)}
                              className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-opacity"
                            >
                              {approvingId === p.id ? "Aprobando…" : "Aprobar"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── TAB USERS ──────────────────────────────────────────────────────── */}
        {tab === "users" && (
          <section>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={userStatus}
                onChange={e => setUserStatus(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-black"
              >
                <option value="">Todos los estados</option>
                {STATUS_OPTIONS.filter(Boolean).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={userCity}
                onChange={e => setUserCity(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-black"
              >
                <option value="">Todas las ciudades</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {usersLoading && (
              <p className="text-sm text-gray-500">Cargando…</p>
            )}
            {usersError && (
              <p className="text-sm text-red-500">{usersError}</p>
            )}

            {!usersLoading && !usersError && users.length === 0 && (
              <p className="text-sm text-gray-400">Sin resultados</p>
            )}

            {!usersLoading && users.length > 0 && (
              <div className="rounded-3xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500">Nombre</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500 hidden md:table-cell">Email</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500 hidden md:table-cell">Ciudad</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-widest text-gray-500">Estado</th>
                      <th className="px-5 py-3 text-right font-bold text-xs uppercase tracking-widest text-gray-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}
                      >
                        <td className="px-5 py-4 font-semibold">{u.name}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{u.email}</td>
                        <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{u.city}</td>
                        <td className="px-5 py-4">{statusBadge(u.status)}</td>
                        <td className="px-5 py-4 text-right flex justify-end gap-2">
                          {u.status !== "SUSPENDED" && u.status !== "DELETED" && (
                            <button
                              disabled={actionUserId === u.id}
                              onClick={() => handleSuspend(u.id)}
                              className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-700 hover:border-black hover:text-black disabled:opacity-50 transition-all"
                            >
                              {actionUserId === u.id ? "…" : "Suspender"}
                            </button>
                          )}
                          {u.status === "SUSPENDED" && (
                            <button
                              disabled={actionUserId === u.id}
                              onClick={() => handleActivate(u.id)}
                              className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-opacity"
                            >
                              {actionUserId === u.id ? "…" : "Activar"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
