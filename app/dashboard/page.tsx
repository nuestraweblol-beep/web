'use client'

import { useState } from "react"
import { Image, Calendar, ArrowRight, Infinity as InfinityIcon } from "lucide-react"
import CrudTable from "../components/crud-table"
import { fechasService } from "@/lib/services/fechasService"
import { galeriaService } from "@/lib/services/galeriaService"
import { timelineService } from "@/lib/services/timelineService"

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
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4 font-serif">
            Panel de Administración
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Gestiona cada detalle de nuestra historia desde aquí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crudModules.map((module) => {
            const Icon = module.icon
            return (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className="group text-left bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl ${module.theme.bgLight} group-hover:scale-110 transition-transform duration-300 ${module.theme.shadow}`}>
                    <Icon className={`h-8 w-8 ${module.theme.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold ${module.theme.text} mb-2`}>{module.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{module.description}</p>
                    <div className={`flex items-center font-medium ${module.theme.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <span>Gestionar Contenido</span>
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
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