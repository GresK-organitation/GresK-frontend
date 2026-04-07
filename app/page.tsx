"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { TierCard } from "@/components/dashboard/tier-card"
import { EventCard } from "@/components/dashboard/event-card"
import { MusicCard } from "@/components/dashboard/music-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { SectionHeader } from "@/components/dashboard/section-header"
import { SpotifyBadge } from "@/components/dashboard/spotify-badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function DashboardPage() {
  // Estados para almacenar la información real del Backend
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = "http://localhost:8080/api/v1"

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Intentamos traer el perfil del usuario (ajusta el ID o usa /me si tienes JWT)
        const userRes = await fetch(`${API_BASE_URL}/users/1`)
        const userData = await userRes.json()
        setUser(userData)

        // 2. Intentamos traer los eventos
        const eventsRes = await fetch(`${API_BASE_URL}/events`)
        const eventsData = await eventsRes.json()
        setEvents(eventsData)

      } catch (error) {
        console.error("Error conectando con el Backend:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Si aún está cargando, mostramos un estado elegante
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white animate-pulse">Cargando GresK...</p>
      </div>
    )
  }

  // Comprobamos si el usuario tiene géneros (para mostrar EmptyState o no)
  const hasGenres = user?.genres?.length > 0

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={user?.name || "Invitado"}
        userCity={user?.city || "Localización desconocida"}
        userAvatar={undefined}
      />

      <main className="container px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-10">

          {/* Tier & Loyalty Section */}
          <section className="max-w-md">
            <TierCard
              tier={user?.tier || "BRONZE"}
              currentPoints={user?.currentPoints || 0}
              nextTierPoints={user?.nextTierPoints || 1000}
            />
          </section>

          {/* Events Section */}
          <section className="space-y-6">
            <SectionHeader
              title={`Eventos en ${user?.city || "tu ciudad"}`}
              subtitle="Recomendados para ti"
            />

            {events.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={event.date} // Asegúrate que tu Java devuelva un String tipo "15 ABR"
                    venue={event.venue}
                    imageUrl={event.imageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onConfigureClick={() => console.log("Ir a configuración")} />
            )}
          </section>

          {/* Music Section (Aquí podrías conectar con Spotify más adelante) */}
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeader
                title="Para ti"
                subtitle="Basado en tus gustos musicales"
                showViewAll={hasGenres}
              />
              <SpotifyBadge />
            </div>

            {hasGenres ? (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {/* Aquí mapearías track de una API de música */}
                  <p className="text-muted-foreground text-sm">Conecta tu cuenta para ver recomendaciones musicales.</p>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <EmptyState onConfigureClick={() => console.log("Configurar géneros")} />
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container px-4 text-center md:px-6">
          <p className="text-xs text-muted-foreground">
            © 2026 GresK. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}