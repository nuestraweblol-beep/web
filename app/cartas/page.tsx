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

    // Customize SweetAlert mixin for consistent theming
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 py-20 px-4">

            {/* Admin Toggle */}
            <div className="fixed top-24 right-4 z-40">
                <button
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
                    className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-full bg-rose-100 mb-4">
                        <Mail className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-rose-900 mb-4">
                        Cartas de Amor
                    </h1>
                    <p className="text-rose-400 font-serif italic text-xl">
                        Palabras que guardo en el corazón...
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cartas.map((carta, index) => (
                            <div
                                key={carta.id}
                                className="group perspective"
                            >
                                <div
                                    className="relative cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
                                    onClick={() => handleOpenCarta(carta)}
                                >
                                    {/* Envelope Design */}
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-rose-100 relative h-64 flex items-center justify-center p-8 bg-[url('/img/paper-texture.png')]">

                                        {/* Stamp */}
                                        <div className="absolute top-4 right-4 w-16 h-20 border-4 border-double border-rose-200 p-1 bg-rose-50 rotate-12 shadow-sm flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-rose-300" />
                                        </div>

                                        <div className="text-center w-full z-10">
                                            <h3 className="text-2xl font-serif font-bold text-rose-800 mb-2 line-clamp-1">
                                                {carta.titulo}
                                            </h3>
                                            <div className="w-16 h-0.5 bg-rose-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                                                {(() => {
                                                    const [y, m, d] = carta.fecha.split('-').map(Number);
                                                    return new Date(y, m - 1, d).toLocaleDateString();
                                                })()}
                                            </p>
                                            {carta.remitente && (
                                                <p className="text-xs text-rose-400 mt-2 font-serif italic">
                                                    De: {carta.remitente}
                                                </p>
                                            )}
                                        </div>

                                        {/* Envelope Flap Effect */}
                                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-gradient-to-b from-rose-200 to-transparent" />

                                        {/* Admin Controls */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 z-20" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => handleEdit(carta)} className="p-2 bg-white/80 hover:bg-rose-100 text-rose-500 rounded-full shadow-sm transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(carta.id)} className="p-2 bg-white/80 hover:bg-red-100 text-red-500 rounded-full shadow-sm transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stack effect */}
                                    <div className="absolute inset-0 bg-rose-900/5 rounded-xl transform translate-x-2 translate-y-2 -z-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reading Modal */}
            {selectedCarta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#fffdf7] max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 border-[3px] border-rose-100 ring-4 ring-white/50">
                        <button
                            onClick={handleCloseCarta}
                            className="absolute top-4 right-4 z-10 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-full p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8 md:p-12 font-serif bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] relative overflow-hidden">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100/20 to-transparent rounded-bl-full -z-0" />

                            <div className="relative z-10 text-center mb-8 pb-6 border-b-2 border-rose-100/50 border-dashed">
                                <p className="text-rose-400 italic mb-3 font-medium tracking-wide">
                                    {(() => {
                                        const [y, m, d] = selectedCarta.fecha.split('-').map(Number);
                                        return new Date(y, m - 1, d).toLocaleDateString(undefined, { dateStyle: 'long' });
                                    })()}
                                </p>
                                <h2 className="text-4xl md:text-5xl font-bold text-rose-900 drop-shadow-sm">{selectedCarta.titulo}</h2>
                                <div className="flex justify-center gap-6 mt-6 text-sm">
                                    {selectedCarta.destinatario && (
                                        <span className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full border border-rose-100">
                                            Para: {selectedCarta.destinatario}
                                        </span>
                                    )}
                                    {selectedCarta.remitente && (
                                        <span className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full border border-rose-100">
                                            De: {selectedCarta.remitente}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 prose prose-rose mx-auto text-lg leading-relaxed text-slate-700 whitespace-pre-wrap first-letter:text-6xl first-letter:font-bold first-letter:text-rose-500 first-letter:mr-3 first-letter:float-left first-letter:font-serif">
                                {selectedCarta.contenido}
                            </div>

                            <div className="mt-12 text-center pt-8 border-t-2 border-rose-100/50 border-dashed">
                                <Heart className="w-10 h-10 text-rose-400 mx-auto animate-pulse fill-rose-100" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Create Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in slide-in-from-bottom-10">
                        <h2 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-2">
                            <BookOpen className="w-6 h-6" />
                            {editingCarta ? 'Reescribir Carta' : 'Escribir Nueva Carta'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.titulo}
                                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                    placeholder="Asunto de la carta..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.fecha}
                                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-rose-500 outline-none"
                                    />
                                </div>
                                <div>
                                    {/* Placeholder for future color picker or category */}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">De (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.remitente}
                                        onChange={e => setFormData({ ...formData, remitente: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-rose-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Para (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.destinatario}
                                        onChange={e => setFormData({ ...formData, destinatario: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-rose-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={formData.contenido}
                                    onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-rose-500 outline-none resize-none font-serif"
                                    placeholder="Escribe tus sentimientos aquí..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
