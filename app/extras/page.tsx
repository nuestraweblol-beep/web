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
            title: "Navidad 🎄",
            description: "Nuestra primera Navidad juntos llena de magia y amor",
            icon: <Gift className="w-8 h-8" />,
            href: "/navidad",
            gradient: "from-red-100 to-green-100",
            textColor: "text-red-700",
            shadowColor: "shadow-red-200",
        },
        {
            title: "Primer Aniversario 💕",
            description: "Celebrando un año de amor, risas y momentos inolvidables",
            icon: <Heart className="w-8 h-8" />,
            href: "/aniversario",
            gradient: "from-rose-100 to-pink-100",
            textColor: "text-rose-700",
            shadowColor: "shadow-rose-200",
        },
        {
            title: "San Valentín 2.0 ❤️",
            description: "Nuestro segundo San Valentín juntos y que sean muchos más",
            icon: <Heart className="w-8 h-8" />,
            href: "/sanvalentin",
            gradient: "from-pink-100 to-red-100",
            textColor: "text-pink-700",
            shadowColor: "shadow-pink-200",
        },
        {
            title: "Nuestra Historia 📖",
            description: "Un libro con nuestra historia, capítulo a capítulo",
            icon: <BookOpen className="w-8 h-8" />,
            href: "/libro",
            gradient: "from-amber-100 to-orange-100",
            textColor: "text-amber-700",
            shadowColor: "shadow-amber-200",
        },
    ];

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md mb-6 animate-pulse">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4 font-serif">
                        Momentos Especiales
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto italic font-light">
                        "Secciones dedicadas a celebrar nuestros momentos más mágicos"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {extras.map((extra, index) => (
                        <button
                            key={index}
                            onClick={() => router.push(extra.href)}
                            className={`group relative overflow-hidden bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left border border-slate-100 hover:-translate-y-2`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${extra.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`inline-flex p-4 rounded-2xl bg-slate-50 group-hover:bg-white/80 group-hover:shadow-md transition-all duration-300 mb-6 ${extra.textColor}`}>
                                    {extra.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif group-hover:text-black transition-colors">
                                    {extra.title}
                                </h3>

                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {extra.description}
                                </p>

                                <div className={`mt-auto flex items-center font-medium ${extra.textColor} opacity-80 group-hover:opacity-100`}>
                                    <span className="mr-2">Ver Recuerdos</span>
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
