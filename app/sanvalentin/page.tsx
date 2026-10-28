"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Smile, Sparkles, Star, HeartHandshake } from 'lucide-react';
import "./sanvalentin.css";

const SanValentinPage = () => {
    const router = useRouter();
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [noButtonAttempts, setNoButtonAttempts] = useState(0);

    const handleNoButtonHover = () => {
        // Keep the escaping button inside the viewport, above the safe areas.
        const margin = 16;
        const buttonSize = 96;
        const maxX = Math.max(margin, window.innerWidth - buttonSize - margin);
        const minY = 96;
        const maxY = Math.max(minY, window.innerHeight - buttonSize - margin);
        const randomX = margin + Math.random() * (maxX - margin);
        const randomY = minY + Math.random() * (maxY - minY);

        setNoButtonPosition({ x: randomX, y: randomY });
        setNoButtonAttempts(prev => prev + 1);
    };

    const handleYesClick = () => {
        router.push('/sanvalentin/aceptado');
    };
    return (
        <>
            <div className="valentine-page">
                {/* Hero Section */}
                <section className="hero-valentine">
                    <div className="floating-hearts" aria-hidden="true">
                        <Heart className="heart" fill="currentColor" />
                        <Heart className="heart" fill="currentColor" />
                        <Heart className="heart" fill="currentColor" />
                        <Heart className="heart" fill="currentColor" />
                        <Heart className="heart" fill="currentColor" />
                    </div>

                    <div className="hero-content-valentine">
                        <p className="hero-subtitle-valentine">14 DE FEBRERO 2026</p>
                        <h1 className="hero-title-valentine">
                            San Valentín 2.0
                            <span className="title-highlight">Nuestro segundo San Valentín juntos</span>
                        </h1>
                        <p className="hero-text-valentine">
                            Un día especial para recordarte cuánto te amo.
                        </p>
                    </div>

                    <div className="scroll-indicator">
                        <p>Desplaza para continuar</p>
                        <div className="scroll-icon">
                            <div className="scroll-wheel"></div>
                        </div>
                    </div>
                </section>

                {/* Love Letter Section */}
                <section className="valentine-letter-section">
                    <div className="valentine-letter-header">
                        <p className="letter-category">Te amo mi chiquita</p>
                        <h2 className="letter-title">Una carta</h2>
                    </div>

                    <div className="valentine-letter-card">
                        <div className="letter-decoration" aria-hidden="true">
                            <Heart className="size-6" fill="currentColor" />
                        </div>
                        <div className="valentine-letter-content">
                            <p className="letter-greeting">Mi amor...</p>


                            <p className="letter-paragraph">
                                Hola amor… Hoy todavía no es San Valentín —jajaja— pero, así como lo hice hace un año,
                                quería pedirte algo especial: ¿quieres ser mi San Valentín?
                            </p>

                            <p className="letter-paragraph">
                                Tal vez esta vez no podamos salir como aquella ocasión, pero aun así me encantaría poder
                                estar contigo, aunque no sea una cita perfecta o tradicional. Para mí, compartir tiempo
                                contigo siempre vale más que cualquier plan.
                            </p>

                            <p className="letter-paragraph">
                                No quería dejar pasar este momento sin pedirte que este 14 de febrero pueda estar a tu lado.
                                Aunque sé que probablemente no estamos en nuestro mejor momento, esta fecha me hace muy feliz
                                porque me trae recuerdos hermosos.
                            </p>

                            <p className="letter-paragraph">
                                Especialmente uno que siempre me saca una sonrisa… mi majinboo pintado —jajaja—.
                                Me encanta, y de verdad espero que sigas queriendo y apreciando mucho tu Stitch mal pintado,
                                porque para mí representa cariño, risas y todo lo bonito que hemos compartido.
                            </p>



                            <p className="letter-signature">
                                Te amo de aquí a la luna a pasitos de tortuga ❤️
                            </p>
                        </div>
                    </div>
                </section>

                {/* Reasons Section */}
                <section className="reasons-section">
                    <div className="reasons-header">
                        <p className="reasons-category">INFINITAS RAZONES</p>
                        <h2 className="reasons-title">Por qué te amo</h2>
                        <p className="reasons-subtitle">Unas pocas</p>
                    </div>

                    <div className="reasons-grid">
                        <div className="reason-card">
                            <div className="reason-icon" aria-hidden="true"><Smile /></div>
                            <h3>Tu sonrisa</h3>
                            <p>Aunque a ti no te guste, a mí me encanta y me hace muy feliz</p>
                        </div>
                        <div className="reason-card">
                            <div className="reason-icon" aria-hidden="true"><HeartHandshake /></div>
                            <h3>Tus abrazos</h3>
                            <p>Uno de los pocos lugares que me dan paz</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-icon" aria-hidden="true"><Sparkles /></div>
                            <h3>Tu esencia</h3>
                            <p>Me encanta absolutamente todo de ti</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-icon" aria-hidden="true"><Star /></div>
                            <h3>Tu amor</h3>
                            <p>Me haces sentir realmente amado cada día</p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="valentine-gallery-section">
                    <div className="gallery-header">
                        <p className="gallery-category">NUESTROS MOMENTOS</p>
                        <h2 className="gallery-title">Recuerdos de amor</h2>
                        <p className="gallery-subtitle">Momentos que atesoro en mi corazón</p>
                    </div>

                    <div className="valentine-gallery-grid">
                        <div className="gallery-item">
                            <img src="/img/sanvalentin1.jpg" alt="San Valentín 1" loading="lazy" decoding="async" />
                        </div>
                        <div className="gallery-item">
                            <img src="/img/sanvalentin2.jpg" alt="San Valentín 2" loading="lazy" decoding="async" />
                        </div>
                        <div className="gallery-item">
                            <img src="/img/sanvalentin3.jpg" alt="San Valentín 3" loading="lazy" decoding="async" />
                        </div>
                        <div className="gallery-item">
                            <img src="/img/sanvalentin4.jpg" alt="San Valentín 4" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </section>

                {/* Proposal Section */}
                <section className="proposal-section">
                    <div className="proposal-content">
                        <div className="proposal-heart" aria-hidden="true">
                            <Heart className="size-16" fill="currentColor" />
                        </div>
                        <h2 className="proposal-question">¿Quieres ser mi Valentín un año más?</h2>
                        <p className="proposal-subtitle">
                            {noButtonAttempts === 0 && "Solo hay una respuesta correcta..."}
                            {noButtonAttempts > 0 && noButtonAttempts < 3 && "¿Por qué intentas escapar?"}
                            {noButtonAttempts >= 3 && noButtonAttempts < 5 && "Vamos, sabes que quieres decir que sí..."}
                            {noButtonAttempts >= 5 && noButtonAttempts < 8 && "¡No te vas a escapar tan fácil!"}
                            {noButtonAttempts >= 8 && "¡Ya ríndete y di que sí!"}
                        </p>

                        <div className="proposal-buttons">
                            <button
                                className="yes-button"
                                onClick={handleYesClick}
                            >
                                ¡Sí!
                            </button>

                            <button
                                className="no-button"
                                style={{
                                    position: noButtonAttempts > 0 ? 'fixed' : 'relative',
                                    left: noButtonAttempts > 0 ? `${noButtonPosition.x}px` : 'auto',
                                    top: noButtonAttempts > 0 ? `${noButtonPosition.y}px` : 'auto',
                                    transition: 'all 0.3s ease',
                                    zIndex: noButtonAttempts > 0 ? 70 : undefined,
                                }}
                                onMouseEnter={handleNoButtonHover}
                                onFocus={handleNoButtonHover}
                                onTouchStart={handleNoButtonHover}
                                onClick={handleNoButtonHover}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SanValentinPage;
