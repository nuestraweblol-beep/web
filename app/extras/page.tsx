"use client";

import { useRouter } from "next/navigation";
import { Gift, Heart, Sparkles, ArrowRight, BookOpen } from "lucide-react";

interface ExtraCard {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    gradient: string;
    textColor: string;
    shadowColor: string;
}

export default function ExtrasPage() {
    const router = useRouter();

    const extras: ExtraCard[] = [
        {
            title: "Navidad",
            description: "Nuestra primera Navidad juntos llena de magia y amor",
            icon: <Gift className="w-8 h-8" />,
            href: "/navidad",
            gradient: "from-red-100 to-green-100",
            textColor: "text-red-700",
            shadowColor: "shadow-red-200",
        },
        {
            title: "Primer Aniversario",
            description: "Celebrando un año de amor, risas y momentos inolvidables",
            icon: <Heart className="w-8 h-8" />,
            href: "/aniversario",
            gradient: "from-rose-100 to-pink-100",
            textColor: "text-rose-700",
            shadowColor: "shadow-rose-200",
        },
        {
            title: "San Valentín 2.0",
            description: "Nuestro segundo San Valentín juntos y que sean muchos más",
            icon: <Heart className="w-8 h-8" />,
            href: "/sanvalentin",
            gradient: "from-pink-100 to-red-100",
            textColor: "text-pink-700",
            shadowColor: "shadow-pink-200",
        },
        {
            title: "Nuestra Historia",
            description: "Un libro con nuestra historia, capítulo a capítulo",
            icon: <BookOpen className="w-8 h-8" />,
            href: "/libro",
            gradient: "from-amber-100 to-orange-100",
            textColor: "text-amber-700",
            shadowColor: "shadow-amber-200",
        },
    ];

    return (
        <main className="min-h-[100svh] bg-paper pb-24 pt-[var(--nav-offset)] text-ink">
            <div className="page-container">
                <header className="mb-10 pt-8 text-center sm:mb-14 sm:pt-12">
                    <span className="mb-5 inline-grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
                        <Sparkles className="size-6" aria-hidden="true" />
                    </span>
                    <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
                        Momentos Especiales
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl font-display text-base italic text-ink-muted sm:text-lg">
                        &ldquo;Secciones dedicadas a celebrar nuestros momentos más mágicos&rdquo;
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {extras.map((extra) => (
                        <button
                            key={extra.href}
                            type="button"
                            onClick={() => router.push(extra.href)}
                            className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${extra.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-40`} />

                            <div className="relative z-10 flex h-full flex-col">
                                <span className={`mb-5 inline-grid size-12 place-items-center rounded-2xl bg-paper ${extra.textColor} transition-colors group-hover:bg-white/80`}>
                                    {extra.icon}
                                </span>

                                <h2 className="mb-2 font-display text-xl font-bold text-ink sm:text-2xl">
                                    {extra.title}
                                </h2>

                                <p className="mb-6 text-sm leading-relaxed text-ink-muted sm:text-base">
                                    {extra.description}
                                </p>

                                <span className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${extra.textColor}`}>
                                    Ver recuerdos
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
