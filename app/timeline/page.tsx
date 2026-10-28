"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { timelineService, TimelineEntry } from "@/lib/services/timelineService";
import { Heart, Calendar, ArrowRight, Star, Infinity as InfinityIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function TimelinePage() {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Client-side visual state
    const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string }[]>([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await timelineService.getAll();
                setEntries(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();

        // Start background stars
        const newStars = Array.from({ length: 30 }).map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 3 + 1}px`,
            delay: `${Math.random() * 5}s`,
        }));
        setStars(newStars);
    }, []);

    const formatearFecha = (fecha: string) => {
        const [year, month, day] = fecha.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0F1A] text-white relative overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/40 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[100px]" />

                {/* Stars */}
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse-slow"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDelay: star.delay,
                            opacity: Math.random() * 0.7 + 0.3
                        }}
                    />
                ))}
            </div>

            <main className="relative z-10 container mx-auto px-4 py-20">

                {/* Header */}
                <div className="text-center mb-24 animate-fade-in-up">
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-6 backdrop-blur-sm border border-purple-500/30 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]">
                        <InfinityIcon className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent font-serif">
                        Nuestra Historia Eterna
                    </h1>
                    <p className="text-xl text-purple-200/60 max-w-2xl mx-auto leading-relaxed">
                        Cada momento contigo es un universo de recuerdos que quiero atesorar por siempre en esta línea del tiempo infinita.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 md:-translate-x-1/2" />

                    <div className="space-y-24">
                        {entries.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-purple-400 rounded-full md:-translate-x-1/2 shadow-[0_0_15px_rgba(192,132,252,0.8)] border-4 border-[#0F0F1A] z-20 mt-1.5 md:mt-0">
                                    <div className="absolute inset-0 bg-purple-400 animate-ping opacity-75 rounded-full" />
                                </div>

                                {/* Date Mobile (Left aligned next to dot) */}
                                <div className="md:hidden pl-12 mb-2 w-full text-purple-300 font-serif italic text-lg opacity-80">
                                    {entry.fecha_display || formatearFecha(entry.fecha)}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                                    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] hover:-translate-y-1">

                                        <div className={`hidden md:block absolute top-6 ${index % 2 === 0 ? "-right-3" : "-left-3"} w-6 h-6 bg-[#1a1a2e] rotate-45 border-t border-r border-white/10`}
                                            style={{ transform: index % 2 === 0 ? 'rotate(45deg)' : 'rotate(-135deg)', zIndex: -1 }}
                                        />

                                        <h3 className="text-2xl font-bold text-white mb-3 font-serif">{entry.titulo}</h3>
                                        <p className="text-purple-200/80 leading-relaxed mb-4 font-light">
                                            {entry.descripcion}
                                        </p>

                                        <div className={`md:hidden mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-purple-300`}>
                                            <Calendar className="w-4 h-4" />
                                            {entry.fecha_display || formatearFecha(entry.fecha)}
                                        </div>
                                    </div>
                                </div>

                                {/* Date Desktop & Image */}
                                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}>
                                    <div className="hidden md:block text-2xl font-serif text-purple-300 mb-4 opacity-80 italic">
                                        {entry.fecha_display || formatearFecha(entry.fecha)}
                                    </div>

                                    {entry.foto && (
                                        <div className="relative h-64 w-full md:w-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group cursor-pointer ml-auto mr-auto md:mx-0">
                                            <Image
                                                src={entry.foto}
                                                alt={entry.titulo}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                                <span className="text-white text-sm tracking-widest uppercase flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-purple-500 fill-purple-500" />
                                                    Ver Recuerdo
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}

                        {/* End of Timeline */}
                        <div className="pt-20 text-center relative z-20">
                            <div className="inline-block p-1 px-8 rounded-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent text-purple-200/60 text-sm tracking-[0.3em] uppercase animate-pulse">
                                La historia continúa...
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
}
