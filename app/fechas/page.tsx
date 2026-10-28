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

  // Detail modal: Escape to close and no page scroll behind it
  useEffect(() => {
    if (!fechaSeleccionada && !showForm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFechaSeleccionada(null);
      setShowForm(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fechaSeleccionada, showForm]);

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
    <div className="min-h-[100svh] bg-paper pb-20 text-ink">

      {/* Admin action — bottom-right so it never collides with the header */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40">
        <button
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? "Cerrar formulario" : "Agregar fecha"}
          className="flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 sm:px-5"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span className="text-sm font-semibold">{showForm ? "Cerrar" : "Agregar"}</span>
        </button>
      </div>

      {/* ADMIN FORM OVERLAY or INLINE */}
      {showForm && (
        <div className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
            <div className="relative my-2 w-full max-w-2xl rounded-3xl bg-surface p-5 shadow-2xl sm:my-8 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {editingId ? "Editar historia" : "Nueva historia de amor"}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  aria-label="Cerrar formulario"
                  className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1">Título</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Nuestro primer beso"
                    value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface focus:border-accent focus:outline-none"
                  />
                  {formData.fecha === TARGET_DATE && (
                    <p className="mt-1 text-xs font-semibold text-amber-700">Esta será la fecha principal</p>
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
                  <label className="block text-sm font-medium text-ink-soft mb-1">Perspectiva de Matías</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion_m}
                    onChange={e => setFormData({ ...formData, descripcion_m: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-surface focus:border-blue-400 focus:outline-none resize-none"
                    placeholder="Qué sentiste..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1">Perspectiva de Danna</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion_d}
                    onChange={e => setFormData({ ...formData, descripcion_d: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-surface focus:border-pink-400 focus:outline-none resize-none"
                    placeholder="Qué viviste..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 sm:gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-12 rounded-xl border border-line px-4 font-semibold text-ink-soft transition-colors hover:bg-paper"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
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
        </div>
      )}

      {/* Hero Section - Fecha Principal */}
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-16 pt-[var(--nav-offset)] sm:pb-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 bg-rose-900">
          {fechaPrincipal?.foto ? (
            <Image
              src={fechaPrincipal.foto}
              alt={fechaPrincipal.titulo}
              fill
              sizes="100vw"
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
              <div className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-rose-100 backdrop-blur-md animate-fade-in-up sm:mb-6 sm:px-6 sm:text-sm">
                Nuestra Gran Fecha
              </div>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white drop-shadow-lg animate-fade-in-up delay-100 sm:mb-8 sm:text-6xl md:text-8xl">
                {fechaPrincipal ? fechaPrincipal.titulo : "Nuestro tiempo juntos"}
              </h1>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg animate-fade-in-up delay-200 transition-colors hover:bg-white/15 sm:p-8 md:p-12">
                <div className="text-center">
                  <p className="font-display text-xl italic text-rose-100 sm:text-2xl md:text-3xl">
                    {fechaPrincipal ? formatearFecha(fechaPrincipal.fecha) : `${formatearFecha(TARGET_DATE)}`}
                  </p>
                </div>
              </div>

              {fechaPrincipal && (
                <div className="mt-8 animate-fade-in-up delay-300 sm:mt-12">
                  <button
                    onClick={() => setFechaSeleccionada(fechaPrincipal)}
                    className="group mx-auto flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-rose-900 transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] sm:gap-3 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    Ver Nuestros Mensajes
                    <Heart className="h-5 w-5 fill-rose-600 text-rose-600 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 cursor-pointer md:block" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
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
        <div className="relative px-4 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="mb-12 flex flex-wrap items-center justify-center gap-3 rounded-full border border-rose-200 bg-rose-100/50 px-4 py-2 backdrop-blur-sm sm:mb-20 sm:gap-4 sm:px-8">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 sm:w-6 sm:h-6" />
                <h2 className="font-display text-2xl font-bold text-rose-900 sm:text-3xl md:text-4xl">
                  Momentos Inolvidables
                </h2>
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="space-y-12 md:space-y-24">
              {otrasFechas.map((fecha, index) => (
                <article
                  key={fecha.id}
                  className={`flex flex-col gap-6 md:flex-row md:items-center md:gap-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Image Side */}
                  <div className="group w-full md:w-1/2">
                    <button
                      type="button"
                      onClick={() => setFechaSeleccionada(fecha)}
                      aria-label={`Ver la historia de ${fecha.titulo}`}
                      className="relative block h-64 w-full overflow-hidden rounded-3xl bg-white shadow-xl transition-transform duration-500 hover:scale-[1.01] sm:h-80 md:h-[400px]"
                    >
                      {fecha.foto ? (
                        <Image
                          src={fecha.foto}
                          alt={fecha.titulo}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-rose-100">
                          <Heart className="h-16 w-16 text-rose-300" aria-hidden="true" />
                        </span>
                      )}

                      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                      <span className="absolute inset-x-4 bottom-4 text-left font-display text-xl text-white sm:inset-x-6 sm:bottom-6 sm:text-2xl">
                        {formatearFecha(fecha.fecha)}
                      </span>
                    </button>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2">
                    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8 md:p-10">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 sm:mb-6">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent sm:size-14">
                            <Calendar className="size-5 sm:size-7" aria-hidden="true" />
                          </span>
                          <h3 className="min-w-0 font-display text-xl font-bold leading-tight text-ink sm:text-2xl md:text-3xl">
                            {fecha.titulo}
                          </h3>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(fecha)}
                            aria-label={`Editar ${fecha.titulo}`}
                            title="Editar"
                            className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent"
                          >
                            <Edit2 className="size-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fecha.id, fecha.imageRef)}
                            aria-label={`Borrar ${fecha.titulo}`}
                            title="Borrar"
                            className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="size-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="relative border-l-2 border-blue-200 pl-4 sm:pl-6">
                          <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-blue-400 ring-4 ring-white" aria-hidden="true" />
                          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">Matías dice:</h4>
                          <p className="line-clamp-3 italic leading-relaxed text-ink-soft">
                            &ldquo;{fecha.descripcion_m}&rdquo;
                          </p>
                        </div>

                        <div className="relative border-l-2 border-pink-200 pl-4 sm:pl-6">
                          <span className="absolute -left-[9px] top-0 size-4 rounded-full bg-pink-400 ring-4 ring-white" aria-hidden="true" />
                          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-pink-900">Danna dice:</h4>
                          <p className="line-clamp-3 italic leading-relaxed text-ink-soft">
                            &ldquo;{fecha.descripcion_d}&rdquo;
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFechaSeleccionada(fecha)}
                        className="group mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-soft px-5 font-semibold text-accent transition-colors hover:bg-accent hover:text-white sm:mt-8"
                      >
                        Leer historia completa
                        <Heart className="size-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {fechaSeleccionada && (
        <div
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-fecha-titulo"
          onClick={() => setFechaSeleccionada(null)}
        >
          <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-4">
            <div
              className="relative my-2 w-full max-w-4xl overflow-hidden rounded-3xl bg-surface shadow-2xl sm:my-8 sm:rounded-[2.5rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setFechaSeleccionada(null)}
                aria-label="Cerrar"
                className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-4 sm:top-4"
              >
                <X className="size-5" aria-hidden="true" />
              </button>

              {/* Header with Image */}
              <div className="relative h-56 w-full sm:h-80 md:h-96">
                {fechaSeleccionada.foto ? (
                  <Image
                    src={fechaSeleccionada.foto}
                    alt={fechaSeleccionada.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-rose-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 pr-14 sm:p-8 md:p-10">
                  <h2
                    id="detalle-fecha-titulo"
                    className="mb-2 font-display text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
                  >
                    {fechaSeleccionada.titulo}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-rose-100 sm:gap-3 sm:text-base">
                    <Calendar className="size-4 sm:size-5" aria-hidden="true" />
                    <span>{formatearFecha(fechaSeleccionada.fecha)}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 md:grid-cols-2 md:gap-12 md:p-12">
                {/* Perspectiva de Matías */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      M
                    </span>
                    <span className="h-px flex-1 bg-blue-100" aria-hidden="true" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Matías</h3>
                  </div>
                  <div className="whitespace-pre-wrap rounded-2xl bg-blue-50/60 p-5 text-base font-light leading-relaxed text-ink-soft sm:p-6 sm:text-lg sm:leading-loose">
                    {fechaSeleccionada.descripcion_m}
                  </div>
                </div>

                {/* Perspectiva de Danna */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">Danna</h3>
                    <span className="h-px flex-1 bg-pink-100" aria-hidden="true" />
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                      D
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap rounded-2xl bg-pink-50/60 p-5 text-base font-light leading-relaxed text-ink-soft sm:p-6 sm:text-lg sm:leading-loose">
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