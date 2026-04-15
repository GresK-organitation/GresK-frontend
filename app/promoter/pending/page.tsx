"use client"

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/dashboard/navbar"

export default function PromoterPendingPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-16">
        <div className="w-full max-w-md text-center">

          {/* Icono */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-black">
            <Clock className="h-8 w-8 text-white" />
          </div>

          {/* Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Solicitud enviada
          </p>

          {/* Título */}
          <h1 className="mt-3 text-3xl font-black leading-tight text-black md:text-4xl">
            Tu cuenta está pendiente<br />de aprobación
          </h1>

          {/* Cuerpo */}
          <p className="mx-auto mt-5 max-w-sm text-sm font-medium leading-relaxed text-gray-500">
            Un administrador de GresK revisará tu solicitud en breve.
            Te avisaremos por correo cuando tu cuenta esté activa.
          </p>

          {/* Separador */}
          <div className="mx-auto mt-10 h-px w-16 bg-gray-200" />

          {/* Qué esperar */}
          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Qué sucede ahora
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Recibirás un correo de confirmación en breve",
                "Nuestro equipo revisará tu perfil de promotora",
                "Una vez aprobada, podrás acceder a tu panel",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA volver */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-black transition-all hover:border-black hover:shadow-md"
            >
              Volver al inicio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
