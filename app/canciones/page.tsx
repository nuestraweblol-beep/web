"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Disc3,
  ExternalLink,
  Heart,
  Music2,
  Plus,
  Quote,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/lib/context/AuthContext";
import { Cancion, cancionesService } from "@/lib/services/cancionesService";
import { parseSpotifyUrl } from "@/lib/spotify";

export default function CancionesPage() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    titulo: "",
    artista: "",
    spotifyUrl: "",
    fraseDestacada: "",
    momento: "",
    dedicatoria: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const previewEmbed = useMemo(() => {
    return parseSpotifyUrl(formData.spotifyUrl);
  }, [formData.spotifyUrl]);

  const fetchCanciones = async () => {
    try {
      setLoading(true);
      const data = await cancionesService.getAll();
      setCanciones(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanciones();
  }, []);

  // Modal accessibility: Escape key and body lock
  useEffect(() => {
    if (!showForm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowForm(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSpotifyUrl(formData.spotifyUrl);
    if (!parsed) {
      Swal.fire({
        icon: "warning",
        title: "Enlace no válido",
        text: "Pega un enlace de canción de Spotify (ej: https://open.spotify.com/track/...)",
        confirmButtonColor: "#9f3a52",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await cancionesService.add({
        titulo: formData.titulo.trim(),
        artista: formData.artista.trim(),
        spotifyUrl: formData.spotifyUrl.trim(),
        fraseDestacada: formData.fraseDestacada.trim(),
        momento: formData.momento.trim(),
        dedicatoria: formData.dedicatoria.trim(),
        fecha: formData.fecha,
      });

      setShowForm(false);
      setFormData({
        titulo: "",
        artista: "",
        spotifyUrl: "",
        fraseDestacada: "",
        momento: "",
        dedicatoria: "",
        fecha: new Date().toISOString().split("T")[0],
      });
      fetchCanciones();

      Swal.fire({
        icon: "success",
        title: "Canción guardada",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No pudimos guardar la canción. Intenta nuevamente.",
        confirmButtonColor: "#9f3a52",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar canción?",
      text: `Se borrará "${titulo}" de nuestra banda sonora.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9f3a52",
      cancelButtonColor: "#57534e",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await cancionesService.delete(id);
        fetchCanciones();
      } catch (error) {
        console.error("Error deleting song:", error);
      }
    }
  };

  return (
    <div className="min-h-[100svh] bg-paper pb-28 pt-[var(--nav-offset)] text-ink">
      {/* Floating Action Button */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          aria-label="Agregar nueva canción"
          className="flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 sm:px-5"
        >
          <Plus className="size-5" aria-hidden="true" />
          <span className="text-sm font-semibold">Añadir canción</span>
        </button>
      </div>

      <div className="page-container pt-8 sm:pt-12">
        {/* Header */}
        <header className="mb-10 text-center sm:mb-14">
          <span className="mb-4 inline-grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
            <Music2 className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
            Nuestra Banda Sonora
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-display text-base italic text-ink-muted sm:text-lg">
            Las canciones que cuentan lo que a veces no podemos decir con palabras.
          </p>
        </header>

        {/* Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <Disc3 className="size-10 animate-spin text-accent" aria-hidden="true" />
            <p className="text-sm text-ink-muted">Sintonizando nuestros temas...</p>
          </div>
        ) : canciones.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-line bg-surface/60 p-8 text-center sm:p-12">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
              <Disc3 className="size-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Aún no hay canciones
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Pega el enlace de Spotify de una canción que te recuerde a nosotros y destaca ese verso que eriza la piel.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              <Plus className="size-4" />
              Dedicar la primera
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {canciones.map((song) => {
              const parsed = parseSpotifyUrl(song.spotifyUrl);
              return (
                <article
                  key={song.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:shadow-lg sm:p-6"
                >
                  {/* Top Bar: Song Info & Delete */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                          <Music2 className="size-3.5" aria-hidden="true" />
                        </span>
                        <h2 className="truncate font-display text-lg font-bold text-ink sm:text-xl">
                          {song.titulo}
                        </h2>
                      </div>
                      <p className="mt-0.5 truncate text-sm font-medium text-ink-muted">
                        {song.artista}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {song.spotifyUrl && (
                        <a
                          href={song.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir ${song.titulo} en Spotify`}
                          className="grid size-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                        >
                          <ExternalLink className="size-4" aria-hidden="true" />
                        </a>
                      )}
                      {user && (
                        <button
                          type="button"
                          onClick={() => handleDelete(song.id, song.titulo)}
                          aria-label={`Eliminar ${song.titulo}`}
                          className="grid size-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resaltado de la letra / Frase Destacada */}
                  {song.fraseDestacada && (
                    <div className="relative mb-5 overflow-hidden rounded-2xl border-l-4 border-accent bg-accent-soft/40 p-4 sm:p-5">
                      <Quote
                        className="pointer-events-none absolute right-3 top-3 size-12 text-accent/10"
                        aria-hidden="true"
                      />
                      <div className="relative z-10">
                        <span className="mb-1.5 flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wider text-accent">
                          <Sparkles className="size-3" aria-hidden="true" />
                          Verso para recordar
                          {song.momento && (
                            <span className="inline-flex items-center gap-1 font-mono font-normal lowercase text-ink-soft">
                              · <Clock className="size-3" /> {song.momento}
                            </span>
                          )}
                        </span>
                        <blockquote className="font-display text-base italic leading-relaxed text-ink sm:text-lg">
                          &ldquo;{song.fraseDestacada}&rdquo;
                        </blockquote>
                      </div>
                    </div>
                  )}

                  {/* Dedicatoria personal */}
                  {song.dedicatoria && (
                    <p className="mb-4 text-sm leading-relaxed text-ink-soft">
                      {song.dedicatoria}
                    </p>
                  )}

                  {/* Spotify Player Embed */}
                  <div className="mt-auto overflow-hidden rounded-2xl bg-neutral-900 shadow-inner">
                    {parsed ? (
                      <iframe
                        src={parsed.embedUrl}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="border-0"
                        title={`Reproductor de Spotify para ${song.titulo}`}
                      />
                    ) : (
                      <div className="flex h-20 items-center justify-center p-3 text-center text-xs text-white/60">
                        Enlace no compatible con el reproductor incrustado.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-cancion-titulo"
        >
          <div className="flex min-h-full items-center justify-center py-6">
            <div className="relative w-full max-w-xl rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
              {/* Modal Header */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-cancion-titulo"
                    className="font-display text-2xl font-bold text-ink sm:text-3xl"
                  >
                    Dedicar una Canción
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Pega el enlace de Spotify y resalta ese fragmento inolvidable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Cerrar formulario"
                  className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="spotify-url"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
                  >
                    Enlace de Spotify *
                  </label>
                  <input
                    id="spotify-url"
                    type="url"
                    required
                    placeholder="https://open.spotify.com/track/..."
                    value={formData.spotifyUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, spotifyUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:bg-surface focus:outline-none"
                  />
                  <p className="mt-1 text-[0.75rem] text-ink-muted">
                    Ve a Spotify &gt; Compartir &gt; Copiar enlace de la canción.
                  </p>
                </div>

                {/* Live Spotify Preview if URL is valid */}
                {previewEmbed && (
                  <div className="overflow-hidden rounded-2xl border border-line">
                    <iframe
                      src={previewEmbed.embedUrl}
                      width="100%"
                      height="80"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="border-0"
                      title="Vista previa de Spotify"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cancion-titulo"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
                    >
                      Título de la canción *
                    </label>
                    <input
                      id="cancion-titulo"
                      type="text"
                      required
                      placeholder="Ej: Yellow"
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData({ ...formData, titulo: e.target.value })
                      }
                      className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:bg-surface focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cancion-artista"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
                    >
                      Artista / Banda *
                    </label>
                    <input
                      id="cancion-artista"
                      type="text"
                      required
                      placeholder="Ej: Coldplay"
                      value={formData.artista}
                      onChange={(e) =>
                        setFormData({ ...formData, artista: e.target.value })
                      }
                      className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:bg-surface focus:outline-none"
                    />
                  </div>
                </div>

                {/* Highlighted part */}
                <div className="rounded-2xl border border-accent/20 bg-accent-soft/30 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="frase-destacada"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent"
                    >
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      Parte o Verso a Resaltar
                    </label>
                    <span className="text-[0.7rem] font-medium text-accent/80">
                      Lo más especial
                    </span>
                  </div>

                  <textarea
                    id="frase-destacada"
                    rows={3}
                    placeholder="Escribe la estrofa o letra que resume todo lo que siento por ti..."
                    value={formData.fraseDestacada}
                    onChange={(e) =>
                      setFormData({ ...formData, fraseDestacada: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-2.5 font-display text-sm italic text-ink transition-colors focus:border-accent focus:outline-none"
                  />

                  <div className="mt-3">
                    <label
                      htmlFor="momento"
                      className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft"
                    >
                      Minuto / Momento (Opcional)
                    </label>
                    <input
                      id="momento"
                      type="text"
                      placeholder="Ej: 02:15 o 'En el estribillo'"
                      value={formData.momento}
                      onChange={(e) =>
                        setFormData({ ...formData, momento: e.target.value })
                      }
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cancion-dedicatoria"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
                  >
                    Dedicatoria / Por qué esta canción (Opcional)
                  </label>
                  <textarea
                    id="cancion-dedicatoria"
                    rows={2}
                    placeholder="Te la dedico porque cada vez que suena en el auto..."
                    value={formData.dedicatoria}
                    onChange={(e) =>
                      setFormData({ ...formData, dedicatoria: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:bg-surface focus:outline-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="min-h-12 rounded-xl border border-line px-4 font-semibold text-ink-soft transition-colors hover:bg-paper"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Disc3 className="size-5 animate-spin" />
                    ) : (
                      <Heart className="size-4" fill="currentColor" />
                    )}
                    <span>Guardar canción</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

