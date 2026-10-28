"use client";
import "./christmas.css";
import BokehLights from "../components/BokehLights";
import Snowflakes from "../components/Snowflakes";
import ChristmasTree from "../components/ChristmasTree";

const Index = () => {
    return (
        <div className="christmas-theme relative overflow-hidden">
            {/* Background effects */}
            <BokehLights />
            <Snowflakes />

            {/* Decorative garland at top */}
            <div
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-christmas-red via-christmas-green to-christmas-red opacity-60"
                aria-hidden="true"
            />

            {/* Main content */}
            <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-[var(--nav-offset)] sm:px-6">
                {/* Header */}
                <header className="mb-8 text-center sm:mb-12">
                    <h1 className="mb-4 text-balance font-script text-4xl leading-tight text-christmas-gold drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                        Nuestro árbol de navidad
                    </h1>
                    <p className="mx-auto max-w-md font-display text-base italic leading-relaxed text-christmas-cream/85 sm:text-lg">
                        No es el mejor árbol, pero sí es uno lleno de amor.
                    </p>
                    <p className="mx-auto mt-4 max-w-md font-display text-base italic leading-relaxed text-christmas-cream/85 sm:text-lg">
                        En esta Navidad, mi mejor regalo no está debajo del árbol, sino a mi lado. Gracias por ser mi luz y mi hogar en cada día de mi vida. ¡Feliz Navidad, mi amor!
                    </p>
                    <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-christmas-cream/60 sm:text-sm">
                        Pst: toca las fotos marcadas para descubrir cada carta.
                    </p>
                </header>

                {/* Christmas Tree */}
                <section className="flex justify-center">
                    <ChristmasTree />
                </section>

                {/* Footer message */}
                <footer className="mt-12 text-center sm:mt-16">
                    <p className="font-script text-2xl text-christmas-gold sm:text-3xl">
                        Feliz Navidad, mi amor
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default Index;
