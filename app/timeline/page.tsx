"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { timelineService, TimelineEntry } from "@/lib/services/timelineService";
import { Heart, Star, Infinity as InfinityIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function TimelinePage() {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Client-side visual state
    const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string; opacity: number }[]>([]);

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

        // Decorative stars — generated once on the client, never during render
        const newStars = Array.from({ length: 18 }).map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 2.5 + 1}px`,
            delay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.25,
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
            <div className="flex min-h-[100svh] items-center justify-center bg-night">
                <Loader2 className="h-10 w-10 animate-spin text-purple-400" aria-label="Cargando" />
            </div>
        );
    }

    return (
        <div className="relative min-h-[100svh] overflow-x-hidden bg-[#0F0F1A] pt-[var(--nav-offset)] text-white">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 h-[500px] w-full bg-gradient-to-b from-purple-900/40 to-transparent" />
                <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-indigo-900/30 blur-[100px]" />

                {/* Stars */}
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse-slow"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDelay: star.delay,
                            opacity: star.opacity,
                        }}
                    />
                ))}
            </div>

            <main className="page-container relative z-10 py-12 sm:py-16 md:py-20">

                {/* Header */}
                <div className="mb-14 text-center animate-fade-in-up sm:mb-20 md:mb-24">
                    <div className="mb-5 inline-grid size-16 place-items-center rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm sm:mb-6 sm:size-20">
                        <InfinityIcon className="size-8 text-purple-400 sm:size-10" aria-hidden="true" />
                    </div>
                    <h1 className="mb-4 text-balance bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text font-display text-3xl font-bold leading-tight text-transparent sm:mb-6 sm:text-5xl md:text-7xl">
                        Nuestra Historia Eterna
                    </h1>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/60 sm:text-lg md:text-xl">
                        Cada momento contigo es un universo de recuerdos que quiero atesorar por siempre en esta línea del tiempo infinita.
                    </p>
                </div>

                {entries.length === 0 ? (
                    <div className="mx-auto max-w-md rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
                        <Star className="mx-auto mb-4 size-8 text-purple-300/50" aria-hidden="true" />
                        <p className="font-display text-xl text-white">La línea del tiempo está esperando</p>
                        <p className="mt-2 text-sm text-purple-200/60">
                            Los recuerdos aparecerán aquí cuando existan.
                        </p>
                    </div>
                ) : (
                /* Timeline Container */
                <div className="relative mx-auto max-w-5xl">
                    {/* Central Line */}
                    <div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 md:left-1/2 md:-translate-x-1/2" />

                    <div className="space-y-14 sm:space-y-20 md:space-y-24">
                        {entries.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`relative flex flex-col items-center gap-6 md:flex-row md:gap-16 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >

                                {/* Timeline Dot */}
                                <div className="absolute left-4 top-2 z-20 size-3 rounded-full border-2 border-[#0F0F1A] bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.7)] md:left-1/2 md:top-0 md:size-4 md:-translate-x-1/2">
                                    {index === 0 && (
                                        <span className="absolute inset-0 rounded-full bg-purple-400 opacity-60 animate-ping" aria-hidden="true" />
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full min-w-0 pl-10 md:w-1/2 md:pl-0 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}`}>
                                    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:p-6">

                                        <div className={`absolute top-6 hidden size-6 rotate-45 border-t border-r border-white/10 bg-[#1a1a2e] md:block ${index % 2 === 0 ? "-right-3" : "-left-3"}`}
                                            style={{ transform: index % 2 === 0 ? 'rotate(45deg)' : 'rotate(-135deg)', zIndex: -1 }}
                                        />

                                        <p className="mb-2 font-display text-base italic text-purple-300/80 md:hidden">
                                            {entry.fecha_display || formatearFecha(entry.fecha)}
                                        </p>

                                        <h3 className="mb-3 text-balance font-display text-xl font-bold leading-snug text-white sm:text-2xl">{entry.titulo}</h3>
                                        <p className="whitespace-pre-wrap text-sm font-light leading-relaxed text-purple-200/80 sm:text-base">
                                            {entry.descripcion}
                                        </p>
                                    </div>
                                </div>

                                {/* Date Desktop & Image */}
                                <div className={`w-full min-w-0 pl-10 md:w-1/2 md:pl-0 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}>
                                    <div className="mb-4 hidden font-display text-xl italic text-purple-300/80 md:block lg:text-2xl">
                                        {entry.fecha_display || formatearFecha(entry.fecha)}
                                    </div>

                                    {entry.foto && (
                                        <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:h-64 md:mx-0 md:w-80">
                                            <Image
                                                src={entry.foto}
                                                alt={entry.titulo}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 320px"
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#0F0F1A]/80 to-transparent p-4">
                                                <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80">
                                                    <Heart className="size-3.5 fill-purple-500 text-purple-500" aria-hidden="true" />
                                                    Recuerdo
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}

                        {/* End of Timeline */}
                        <div className="relative z-20 pt-8 text-center sm:pt-16">
                            <div className="inline-block rounded-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent px-6 py-1 text-xs uppercase tracking-[0.3em] text-purple-200/60 sm:px-8 sm:text-sm">
                                La historia continúa...
                            </div>
                        </div>
                    </div>
                </div>
                )}
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
