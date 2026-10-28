"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Heart, Plus, X, Upload, Trash2, Edit2, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { fechasService, FechaEspecial } from "@/lib/services/fechasService";
import { convertToWebP } from "@/lib/utils/imageOptimization";

// Fecha objetivo fija para el contador y Hero (se busca en DB para mostrar datos)
const TARGET_DATE = "2025-01-31";

export default function FechasEspeciales() {
  const [fechas, setFechas] = useState<FechaEspecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<FechaEspecial | null>(null);

  // Hydration fix: Generate hearts only on client
  const [hearts, setHearts] = useState<{ left: string, top: string, delay: string, duration: string, size: string }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 4}s`,
      size: `${20 + Math.random() * 30}px`,
    }));
    setHearts(newHearts);
  }, []);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fecha: "",
    titulo: "",
    descripcion_m: "",
    descripcion_d: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fechasService.getAll();
      setFechas(data);
    } catch (error) {
      console.error("Error loading dates:", error);
      Swal.fire("Error", "No se pudieron cargar las fechas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Identify Hero Date
  const fechaPrincipal = fechas.find(f => f.fecha === TARGET_DATE);
  // Filter others
  const otrasFechas = fechas.filter(f => f.fecha !== TARGET_DATE);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fecha || !formData.titulo) {
      Swal.fire("Campos incompletos", "Por favor completa fecha y título", "warning");
      return;
    }

    try {
      setSubmitting(true);

      let imageToUpload = selectedFile;
      if (imageToUpload) {
        // Optimize before upload
        imageToUpload = await convertToWebP(imageToUpload, { maxWidth: 1200, quality: 0.8 });
      }

      if (editingId) {
        await fechasService.update(editingId, formData, imageToUpload);
        Swal.fire("¡Actualizado!", "La fecha ha sido actualizada", "success");
      } else {
        await fechasService.add(formData, imageToUpload);
        Swal.fire("¡Guardado!", "Nueva fecha especial agregada", "success");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (fecha: FechaEspecial) => {
    setEditingId(fecha.id);
    setFormData({
      fecha: fecha.fecha,
      titulo: fecha.titulo,
      descripcion_m: fecha.descripcion_m,
      descripcion_d: fecha.descripcion_d,
    });
    setPreviewUrl(fecha.foto || null);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, imageRef?: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar fecha?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await fechasService.delete(id, imageRef);
        Swal.fire('Eliminado', 'La fecha ha sido eliminada', 'success');
        fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({ fecha: "", titulo: "", descripcion_m: "", descripcion_d: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatearFecha = (fecha: string) => {
    // Ajustar zona horaria local
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 pb-20">

      {/* Admin Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
          title={showForm ? "Cerrar formulario" : "Agregar fecha"}
        >
          {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {/* ADMIN FORM OVERLAY or INLINE */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/95 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative my-8">
            <h2 className="text-3xl font-bold text-rose-900 mb-6 font-serif">
              {editingId ? "Editar Historia" : "Nueva Historia de Amor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-rose-100 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Nuestro primer beso"
                    value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-rose-100 focus:border-rose-400 focus:outline-none"
                  />
                  {formData.fecha === TARGET_DATE && (
                    <p className="text-xs text-amber-600 mt-1 font-semibold">✨ Esta será la fecha principal</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">Foto Especial</label>
                <div
                  className="border-2 border-dashed border-rose-300 rounded-xl p-4 text-center cursor-pointer hover:bg-rose-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative h-48 w-full">
                      <Image src={previewUrl} alt="Preview" fill className="object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="py-8 text-rose-400">
                      <Upload className="w-10 h-10 mx-auto mb-2" />
                      <p>Toca para seleccionar una foto</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Perspectiva de Matías</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion_m}
                    onChange={e => setFormData({ ...formData, descripcion_m: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:outline-none resize-none"
                    placeholder="Qué sentiste..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-1">Perspectiva de Danna</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion_d}
                    onChange={e => setFormData({ ...formData, descripcion_d: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none resize-none"
                    placeholder="Qué viviste..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Guardar Historia
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section - Fecha Principal */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 bg-rose-900">
          {fechaPrincipal?.foto ? (
            <Image
              src={fechaPrincipal.foto}
              alt={fechaPrincipal.titulo}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-800 to-pink-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
        </div>

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {hearts.map((heart, i) => (
            <Heart
              key={i}
              className="absolute text-white/20 animate-float"
              style={{
                left: heart.left,
                top: heart.top,
                animationDelay: heart.delay,
                animationDuration: heart.duration,
                width: heart.size,
                height: heart.size,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
              <p className="text-white text-lg">Cargando nuestra historia...</p>
            </div>
          ) : (
            <>
              <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-100 font-medium tracking-widest uppercase text-sm mb-6 animate-fade-in-up">
                Nuestra Gran Fecha
              </div>

              <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 font-serif drop-shadow-lg animate-fade-in-up delay-100">
                {fechaPrincipal ? fechaPrincipal.titulo : "Nuestro tiempo juntos"}
              </h1>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 animate-fade-in-up delay-200 hover:bg-white/15 transition-colors">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl text-rose-100 font-serif italic">
                    {fechaPrincipal ? formatearFecha(fechaPrincipal.fecha) : `${formatearFecha(TARGET_DATE)}`}
                  </p>
                </div>
              </div>

              {fechaPrincipal && (
                <div className="mt-12 animate-fade-in-up delay-300">
                  <button
                    onClick={() => setFechaSeleccionada(fechaPrincipal)}
                    className="group bg-white text-rose-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105 flex items-center gap-3 mx-auto"
                  >
                    Ver Nuestros Mensajes
                    <Heart className="w-5 h-5 text-rose-600 transition-transform group-hover:scale-125 fill-rose-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="text-white/60 text-center">
            <div className="text-sm mb-2 font-medium tracking-widest uppercase">Historia</div>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Otras Fechas - Timeline Romántico */}
      {otrasFechas.length > 0 && (
        <div className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center gap-4 mb-4 px-8 py-2 rounded-full bg-rose-100/50 backdrop-blur-sm border border-rose-200">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-rose-900 font-serif">
                  Momentos Inolvidables
                </h2>
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
            </div>

            <div className="space-y-24">
              {otrasFechas.map((fecha, index) => (
                <div
                  key={fecha.id}
                  className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 group perspective">
                    <div
                      className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl transform transition-all duration-700 hover:rotate-y-12 hover:scale-[1.02] cursor-pointer bg-white"
                      onClick={() => setFechaSeleccionada(fecha)}
                    >
                      {fecha.foto ? (
                        <Image
                          src={fecha.foto}
                          alt={fecha.titulo}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-100">
                          <Heart className="w-20 h-20 text-rose-300" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity" />

                      <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-white font-serif text-2xl">{formatearFecha(fecha.fecha)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg text-white transform rotate-3">
                            <Calendar className="w-7 h-7" />
                          </div>
                          <h3 className="text-3xl font-bold text-rose-900 font-serif leading-tight">
                            {fecha.titulo}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(fecha)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(fecha.id, fecha.imageRef)} className="p-2 text-rose-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-blue-200">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-400 ring-4 ring-white" />
                          <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wider">Matías dice:</h4>
                          <p className="text-gray-600 italic leading-relaxed line-clamp-3">
                            "{fecha.descripcion_m}"
                          </p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-pink-200">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-400 ring-4 ring-white" />
                          <h4 className="font-bold text-pink-900 mb-2 text-sm uppercase tracking-wider">Danna dice:</h4>
                          <p className="text-gray-600 italic leading-relaxed line-clamp-3">
                            "{fecha.descripcion_d}"
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setFechaSeleccionada(fecha)}
                        className="mt-8 w-full group overflow-hidden relative bg-rose-50 hover:bg-rose-100 text-rose-600 px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Leer historia completa
                          <Heart className="w-4 h-4 transition-transform group-hover:scale-125" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {fechaSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setFechaSeleccionada(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setFechaSeleccionada(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header with Image */}
            <div className="relative h-96 w-full">
              {fechaSeleccionada.foto ? (
                <Image
                  src={fechaSeleccionada.foto}
                  alt={fechaSeleccionada.titulo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-rose-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <h2 className="text-5xl font-bold text-white font-serif mb-3 leading-tight">
                  {fechaSeleccionada.titulo}
                </h2>
                <div className="flex items-center gap-3 text-rose-200">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xl">{formatearFecha(fechaSeleccionada.fecha)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-10 md:p-12 bg-white">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Perspectiva de Matías */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <span className="font-bold text-xl">M</span>
                    </div>
                    <div className="h-px flex-1 bg-blue-100" />
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Matías</h3>
                  </div>
                  <div className="bg-blue-50/50 rounded-2xl p-8 leading-loose text-gray-700 font-light text-lg whitespace-pre-wrap">
                    {fechaSeleccionada.descripcion_m}
                  </div>
                </div>

                {/* Perspectiva de Danna */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-bold text-pink-400 uppercase tracking-widest">Danna</h3>
                    <div className="h-px flex-1 bg-pink-100" />
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <span className="font-bold text-xl">D</span>
                    </div>
                  </div>
                  <div className="bg-pink-50/50 rounded-2xl p-8 leading-loose text-gray-700 font-light text-lg whitespace-pre-wrap">
                    {fechaSeleccionada.descripcion_d}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 10s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}