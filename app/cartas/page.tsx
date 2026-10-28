"use client";

import { useState, useEffect } from "react";
import { cartasService, Carta } from "@/lib/services/cartasService";
import Swal from "sweetalert2";
import { Heart, Plus, BookOpen, X, Edit2, Trash2, Mail } from "lucide-react";

export default function CartasPage() {
    const [cartas, setCartas] = useState<Carta[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarta, setSelectedCarta] = useState<Carta | null>(null);

    // Form States
    const [showForm, setShowForm] = useState(false);
    const [editingCarta, setEditingCarta] = useState<Carta | null>(null);
    const [formData, setFormData] = useState({
        titulo: "",
        contenido: "",
        fecha: new Date().toISOString().split('T')[0],
        remitente: "",
        destinatario: "",
    });

    useEffect(() => {
        fetchCartas();
    }, []);

    // Modal / form: lock page scroll and close with Escape
    useEffect(() => {
        if (!selectedCarta && !showForm) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setSelectedCarta(null);
            setShowForm(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedCarta, showForm]);

    const formatDate = (fecha: string, long = false) => {
        const [y, m, d] = fecha.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
            ...(long ? { dateStyle: "long" } : { day: "numeric", month: "short", year: "numeric" }),
        });
    };

    const fetchCartas = async () => {
        try {
            setLoading(true);
            const data = await cartasService.getAll();
            setCartas(data);
        } catch (error) {
            console.error("Error fetching cartas:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar las cartas",
                icon: "error",
                confirmButtonColor: "#f43f5e", // rose-500
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCarta = (carta: Carta) => {
        setSelectedCarta(carta);
    };

    const handleCloseCarta = () => {
        setSelectedCarta(null);
    };

    // Form Handlers
    const handleEdit = (carta: Carta) => {
        setEditingCarta(carta);
        setFormData({
            titulo: carta.titulo,
            contenido: carta.contenido,
            fecha: carta.fecha,
            remitente: carta.remitente || "",
            destinatario: carta.destinatario || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Quemar esta carta?',
            text: "No podrás recuperarla jamás",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e', // rose-500
            cancelButtonColor: '#94a3b8', // slate-400
            confirmButtonText: 'Sí, quemar',
            cancelButtonText: 'Cancelar',
            background: '#fff1f2', // rose-50
            color: '#881337', // rose-900
            iconColor: '#f43f5e'
        });

        if (result.isConfirmed) {
            try {
                await cartasService.delete(id);
                Swal.fire({
                    title: 'Eliminada',
                    text: 'La carta se ha convertido en cenizas',
                    icon: 'success',
                    confirmButtonColor: '#f43f5e',
                    background: '#fff1f2',
                    color: '#881337',
                    iconColor: '#f43f5e'
                });
                fetchCartas();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la carta',
                    icon: 'error',
                    confirmButtonColor: '#f43f5e',
                    background: '#fff1f2',
                    color: '#881337'
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCarta) {
                await cartasService.update(editingCarta.id, formData);
                Swal.fire({
                    title: "Actualizado",
                    text: "Carta reescrita con éxito",
                    icon: "success",
                    confirmButtonColor: '#f43f5e',
                    background: '#fff1f2',
                    color: '#881337',
                    iconColor: '#f43f5e'
                });
            } else {
                await cartasService.add(formData);
                Swal.fire({
                    title: "Enviado",
                    text: "Carta enviada al buzón",
                    icon: "success",
                    confirmButtonColor: '#f43f5e',
                    background: '#fff1f2',
                    color: '#881337',
                    iconColor: '#f43f5e'
                });
            }
            setShowForm(false);
            setEditingCarta(null);
            setFormData({
                titulo: "",
                contenido: "",
                fecha: new Date().toISOString().split('T')[0],
                remitente: "",
                destinatario: "",
            });
            fetchCartas();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar la carta",
                icon: "error",
                confirmButtonColor: '#f43f5e',
            });
        }
    };

    return (
        <div className="min-h-[100svh] bg-paper pt-[var(--nav-offset)] text-ink">

            {/* Admin action — bottom-right, clear of the header */}
            <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40">
                <button
                    type="button"
                    aria-label="Escribir nueva carta"
                    onClick={() => {
                        setShowForm(true);
                        setEditingCarta(null);
                        setFormData({
                            titulo: "",
                            contenido: "",
                            fecha: new Date().toISOString().split('T')[0],
                            remitente: "",
                            destinatario: "",
                        });
                    }}
                    className="flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 sm:px-5"
                >
                    <Plus className="size-5" aria-hidden="true" />
                    <span className="text-sm font-semibold">Escribir</span>
                </button>
            </div>

            <div className="page-container pb-24 pt-10 sm:pt-14">
                <header className="mb-10 text-center sm:mb-14">
                    <span className="mb-4 inline-grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
                        <Mail className="size-7" aria-hidden="true" />
                    </span>
                    <h1 className="text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
                        Cartas de Amor
                    </h1>
                    <p className="mt-3 font-display text-base italic text-ink-muted sm:text-lg">
                        Palabras que guardo en el corazón...
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent-soft border-t-accent" />
                    </div>
                ) : cartas.length === 0 ? (
                    <div className="mx-auto max-w-md rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
                        <Heart className="mx-auto mb-4 size-10 text-accent/40" aria-hidden="true" />
                        <p className="font-display text-xl text-ink">Todavía no hay cartas</p>
                        <p className="mt-2 text-sm text-ink-muted">
                            Cuando escribas la primera, aparecerá aquí.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                        {cartas.map((carta) => (
                            <div key={carta.id} className="group relative">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Leer la carta ${carta.titulo}`}
                                    className="relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
                                    onClick={() => handleOpenCarta(carta)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handleOpenCarta(carta);
                                        }
                                    }}
                                >
                                    {/* Envelope Design */}
                                    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-soft sm:h-64 sm:p-8">

                                        {/* Stamp */}
                                        <div className="absolute right-4 top-4 flex h-16 w-14 rotate-6 items-center justify-center rounded-sm border-2 border-double border-rose-200 bg-rose-50/70">
                                            <Heart className="size-5 text-rose-300" aria-hidden="true" />
                                        </div>

                                        <div className="z-10 w-full text-center">
                                            <h3 className="mb-2 line-clamp-1 font-display text-xl font-bold text-ink sm:text-2xl">
                                                {carta.titulo}
                                            </h3>
                                            <div className="mx-auto mb-3 h-px w-16 bg-line" />
                                            <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                                                {formatDate(carta.fecha)}
                                            </p>
                                            {carta.remitente && (
                                                <p className="mt-2 font-display text-xs italic text-ink-muted">
                                                    De: {carta.remitente}
                                                </p>
                                            )}
                                        </div>

                                        {/* Envelope Flap Effect */}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-100/60 to-transparent opacity-40" />

                                        {/* Admin Controls */}
                                        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5" onClick={e => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(carta)}
                                                aria-label={`Editar ${carta.titulo}`}
                                                className="grid size-10 place-items-center rounded-full bg-surface/90 text-ink-muted shadow-sm transition-colors hover:bg-accent-soft hover:text-accent"
                                            >
                                                <Edit2 className="size-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(carta.id)}
                                                aria-label={`Borrar ${carta.titulo}`}
                                                className="grid size-10 place-items-center rounded-full bg-surface/90 text-ink-muted shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="size-4" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reading Modal */}
            {selectedCarta && (
                <div
                    className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-rose-950/50 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="carta-titulo"
                    onClick={handleCloseCarta}
                >
                    <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-4">
                        <article
                            className="relative my-2 w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-[#fffdf7] shadow-2xl sm:my-8"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={handleCloseCarta}
                                aria-label="Cerrar carta"
                                className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-surface/80 text-ink-muted backdrop-blur-sm transition-colors hover:bg-accent-soft hover:text-accent sm:right-4 sm:top-4"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </button>

                            <div className="relative overflow-hidden p-5 font-display sm:p-8 md:p-12">
                                <div className="relative z-10 mb-8 border-b border-dashed border-line pb-6 pr-10 text-center">
                                    <p className="mb-3 font-sans text-xs font-medium uppercase tracking-widest text-ink-muted">
                                        {formatDate(selectedCarta.fecha, true)}
                                    </p>
                                    <h2 id="carta-titulo" className="text-balance font-display text-2xl font-bold leading-tight text-ink sm:text-3xl md:text-4xl">
                                        {selectedCarta.titulo}
                                    </h2>
                                    {(selectedCarta.destinatario || selectedCarta.remitente) && (
                                        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
                                            {selectedCarta.destinatario && (
                                                <span className="rounded-full border border-line bg-accent-soft/60 px-3 py-1 text-accent">
                                                    Para: {selectedCarta.destinatario}
                                                </span>
                                            )}
                                            {selectedCarta.remitente && (
                                                <span className="rounded-full border border-line bg-accent-soft/60 px-3 py-1 text-accent">
                                                    De: {selectedCarta.remitente}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10 whitespace-pre-wrap font-display text-base leading-relaxed text-ink-soft sm:text-lg sm:leading-loose">
                                    {selectedCarta.contenido}
                                </div>

                                <div className="mt-10 border-t border-dashed border-line pt-6 text-center sm:mt-12 sm:pt-8">
                                    <Heart className="mx-auto size-7 text-accent/50" aria-hidden="true" />
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            )}

            {/* Edit/Create Form Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-black/50 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="carta-form-titulo"
                >
                    <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-4">
                        <div className="relative my-2 w-full max-w-lg rounded-3xl bg-surface p-5 shadow-2xl sm:my-8 sm:p-6">
                            <div className="mb-6 flex items-start justify-between gap-3">
                                <h2 id="carta-form-titulo" className="flex items-center gap-2 font-display text-xl font-bold text-ink sm:text-2xl">
                                    <BookOpen className="size-5 shrink-0 text-accent sm:size-6" aria-hidden="true" />
                                    {editingCarta ? 'Reescribir Carta' : 'Escribir Nueva Carta'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    aria-label="Cerrar formulario"
                                    className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                                >
                                    <X className="size-5" aria-hidden="true" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="carta-titulo-input" className="mb-1 block text-sm font-medium text-ink-soft">Título</label>
                                    <input
                                        id="carta-titulo-input"
                                        type="text"
                                        required
                                        value={formData.titulo}
                                        onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                        className="w-full rounded-xl border border-line px-4 py-2.5 focus:border-accent focus:outline-none"
                                        placeholder="Asunto de la carta..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="carta-fecha-input" className="mb-1 block text-sm font-medium text-ink-soft">Fecha</label>
                                    <input
                                        id="carta-fecha-input"
                                        type="date"
                                        required
                                        value={formData.fecha}
                                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                        className="w-full rounded-xl border border-line px-4 py-2.5 focus:border-accent focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="carta-de" className="mb-1 block text-sm font-medium text-ink-soft">De (Opcional)</label>
                                        <input
                                            id="carta-de"
                                            type="text"
                                            value={formData.remitente}
                                            onChange={e => setFormData({ ...formData, remitente: e.target.value })}
                                            className="w-full rounded-xl border border-line px-4 py-2.5 focus:border-accent focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="carta-para" className="mb-1 block text-sm font-medium text-ink-soft">Para (Opcional)</label>
                                        <input
                                            id="carta-para"
                                            type="text"
                                            value={formData.destinatario}
                                            onChange={e => setFormData({ ...formData, destinatario: e.target.value })}
                                            className="w-full rounded-xl border border-line px-4 py-2.5 focus:border-accent focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="carta-contenido" className="mb-1 block text-sm font-medium text-ink-soft">Contenido</label>
                                    <textarea
                                        id="carta-contenido"
                                        required
                                        rows={8}
                                        value={formData.contenido}
                                        onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                                        className="w-full resize-none rounded-xl border border-line px-4 py-2.5 font-display focus:border-accent focus:outline-none"
                                        placeholder="Escribe tus sentimientos aquí..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="min-h-12 rounded-xl border border-line px-4 font-semibold text-ink-soft transition-colors hover:bg-paper"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="min-h-12 rounded-xl bg-accent px-4 font-semibold text-white transition-colors hover:bg-accent/90"
                                    >
                                        Guardar
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
