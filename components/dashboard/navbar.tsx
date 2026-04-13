"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [authOpen, setAuthOpen] = useState(false)
  const { isLoggedIn, role, logout } = useAuth()
  const pathname = usePathname()

  const isFeed = pathname === "/feed"
  const isPromoter = role === "promoter"

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          {/* Logo */}
          <Link
            href={isLoggedIn && isPromoter ? "/promoter" : "/"}
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-black"
          >
            GresK
            {isLoggedIn && isPromoter && (
              <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                Promotora
              </span>
            )}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isFeed && !isPromoter && (
              <>
                <Button
                  asChild
                  className="rounded-full border border-gray-300 bg-white text-black text-sm font-semibold hover:bg-gray-50 hover:border-black shadow-none"
                >
                  <Link href="/discover">Descubrir</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full border border-gray-300 bg-white text-black text-sm font-semibold hover:bg-gray-50 hover:border-black shadow-none"
                >
                  <Link href="/my-events">Mis Eventos</Link>
                </Button>
              </>
            )}

            {isLoggedIn && isPromoter && (
              <>
                <Button
                  asChild
                  className="rounded-full border border-gray-300 bg-white text-black text-sm font-semibold hover:bg-gray-50 hover:border-black shadow-none"
                >
                  <Link href="/promoter">Panel</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800"
                >
                  <Link href="/promoter/new-event">+ Nuevo evento</Link>
                </Button>
              </>
            )}

            {!isFeed && !isPromoter && isLoggedIn && (
              <Button
                asChild
                className="rounded-full border border-gray-300 bg-white text-black text-sm font-semibold hover:bg-gray-50 hover:border-black shadow-none"
              >
                <Link href="/my-events">Mis Eventos</Link>
              </Button>
            )}

            {!isFeed && !isPromoter && !isLoggedIn && (
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-sm font-medium text-gray-600 hover:text-black"
              >
                <Link href="/trabaja-con-nosotros">Trabaja con nosotros</Link>
              </Button>
            )}

            {!isLoggedIn && (
              <Button
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800"
              >
                Registro / Login
              </Button>
            )}

            {isLoggedIn && (
              <Button
                onClick={logout}
                variant="ghost"
                className="rounded-full text-sm font-medium text-gray-600 hover:text-black"
              >
                Salir
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
