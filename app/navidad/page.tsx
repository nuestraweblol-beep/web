"use client";
import "./christmas.css";
import BokehLights from "../components/BokehLights";
import Snowflakes from "../components/Snowflakes";
import ChristmasTree from "../components/ChristmasTree";

const Index = () => {
    return (
        <>
            <div className="christmas-theme min-h-screen relative overflow-hidden">
                {/* Background effects */}
                <BokehLights />
                <Snowflakes />

                {/* Decorative garland at top */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-christmas-red via-christmas-green to-christmas-red opacity-60" />

                {/* Main content */}
                <main className="relative z-10 container mx-auto px-4 pt-24 pb-8 md:pt-32 md:pb-12">
                    {/* Header */}
                    <header className="text-center mb-8 md:mb-12">
                        <h1 className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-christmas-gold mb-4 drop-shadow-lg">
                            Nuestro árbol de navidad
                        </h1>
                        <p className="font-display text-foreground/80 text-lg md:text-xl max-w-md mx-auto italic">
                            No es el mejor árbol, pero si es uno lleno de amor.
                        </p>
                        <p className="font-display text-foreground/80 text-lg md:text-xl max-w-md mx-auto italic mt-4">
                            En esta Navidad, mi mejor regalo no está debajo del árbol, sino a mi lado. Gracias por ser mi luz y mi hogar en cada día de mi vida. ¡Feliz Navidad, mi amor!
                        </p>
                        <p className="text-muted-foreground text-sm mt-4">
                            Psdt: Haz clic en las imágenes de las películas para descubrir cada carta.

                        </p>
                    </header>

                    {/* Christmas Tree */}
                    <section className="flex justify-center">
                        <ChristmasTree />
                    </section>

                    {/* Footer message */}
                    <footer className="text-center mt-12 md:mt-16">
                        <p className="font-script text-2xl md:text-3xl text-christmas-gold">
                            Feliz Navidad, mi amor
                        </p>
                    </footer>
                </main>

                {/* Corner decorations */}
                <div className="fixed bottom-4 left-4 text-4xl opacity-60 animate-twinkle" style={{ animationDelay: '0.3s' }}>
                    🎄
                </div>
                <div className="fixed bottom-4 right-4 text-4xl opacity-60 animate-twinkle" style={{ animationDelay: '0.8s' }}>
                    🎁
                </div>
            </div>
        </>
    );
};

export default Index;
