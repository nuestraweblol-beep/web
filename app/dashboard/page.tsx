'use client'

import { useState } from "react"
import { Image, Calendar, ArrowRight, Infinity as InfinityIcon, Music2 } from "lucide-react"
import CrudTable from "../components/crud-table"
import { fechasService } from "@/lib/services/fechasService"
import { galeriaService } from "@/lib/services/galeriaService"
import { timelineService } from "@/lib/services/timelineService"
import { cancionesService } from "@/lib/services/cancionesService"

const crudModules = [
  {
    id: "galeria",
    title: "Galería de Imágenes",
    description: "Gestiona las fotos y momentos especiales.",
    icon: Image,
    theme: {
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      shadow: "shadow-blue-500/10",
      iconColor: "text-blue-500",
      buttonGradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
    },
    service: galeriaService,
    addSchema: [
      { name: 'image', label: 'Imagen', type: 'file' },
      { name: 'titulo', label: 'Título', type: 'text' },
    ],
  },
  {
    id: "fechas",
    title: "Fechas Importantes",
    description: "Administra los aniversarios y fechas clave.",
    icon: Calendar,
    theme: {
      gradient: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      shadow: "shadow-rose-500/10",
      iconColor: "text-rose-500",
      buttonGradient: "bg-gradient-to-r from-rose-500 to-pink-600",
    },
    service: fechasService,
    addSchema: [
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'titulo', label: 'Título', type: 'text' },
      { name: 'foto', label: 'Foto Especial', type: 'file' },
      { name: 'descripcion_m', label: 'Descripción (Matías)', type: 'textarea' },
      { name: 'descripcion_d', label: 'Descripción (Danna)', type: 'textarea' },
    ],
  },
  {
    id: "timeline",
    title: "Línea del Tiempo",
    description: "Historia eterna momento a momento.",
    icon: InfinityIcon,
    theme: {
      gradient: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
      shadow: "shadow-purple-500/10",
      iconColor: "text-purple-500",
      buttonGradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
    },
    service: timelineService,
    addSchema: [
      { name: 'fecha', label: 'Fecha (Orden)', type: 'date' },
      { name: 'fecha_display', label: 'Texto de Fecha (Opcional, ej: "Verano 2024")', type: 'text' },
      { name: 'titulo', label: 'Título', type: 'text' },
      { name: 'foto', label: 'Foto del Recuerdo', type: 'file' },
      { name: 'descripcion', label: 'Historia', type: 'textarea' },
    ],
  },
  {
    id: "canciones",
    title: "Banda Sonora",
    description: "Administra las canciones de Spotify y versos favoritos.",
    icon: Music2,
    theme: {
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      shadow: "shadow-emerald-500/10",
      iconColor: "text-emerald-500",
      buttonGradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
    },
    service: cancionesService,
    addSchema: [
      { name: 'titulo', label: 'Título', type: 'text' },
      { name: 'artista', label: 'Artista', type: 'text' },
      { name: 'spotifyUrl', label: 'Enlace Spotify', type: 'text' },
      { name: 'fraseDestacada', label: 'Parte a Resaltar (Verso)', type: 'textarea' },
      { name: 'momento', label: 'Minuto / Momento', type: 'text' },
      { name: 'dedicatoria', label: 'Dedicatoria', type: 'textarea' },
      { name: 'fecha', label: 'Fecha', type: 'date' },
    ],
  },
]

export default function DashboardPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const currentModule = crudModules.find((m) => m.id === selectedModule)

  const handleBack = () => {
    setSelectedModule(null)
  }

  if (selectedModule && currentModule) {
    return <CrudTable module={currentModule} onBack={handleBack} service={currentModule.service} addSchema={currentModule.addSchema || []} />
  }

  return (
    <div className="min-h-[100svh] bg-paper pb-20 pt-[var(--nav-offset)] text-ink">
      <div className="page-container">
        <header className="mb-10 pt-8 text-center sm:mb-14 sm:pt-12">
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Panel de Administración
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-muted sm:text-lg">
            Gestiona cada detalle de nuestra historia desde aquí.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {crudModules.map((module) => {
            const Icon = module.icon
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setSelectedModule(module.id)}
                className="group rounded-3xl border border-line bg-surface p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 sm:p-7"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${module.theme.bgLight} ${module.theme.iconColor} sm:size-14`}>
                    <Icon className="size-6 sm:size-7" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1.5 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
                      {module.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-ink-muted">{module.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Gestionar contenido
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}