"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart } from 'lucide-react';
import "./aceptado.css";

const AceptadoPage = () => {
    const router = useRouter();

    return (
        <div className="aceptado-page">
            <div className="aceptado-content">
                <div className="celebration-emoji" aria-hidden="true">
                    <Heart className="size-10" fill="currentColor" />
                    <Heart className="size-14" fill="currentColor" />
                    <Heart className="size-10" fill="currentColor" />
                </div>

                <h1 className="aceptado-title">
                    Yeeeeiii dijiste que sí!
                </h1>

                <p className="aceptado-message">
                    ¡Eres oficialmente mi Valentín! ❤️
                </p>

                <div className="aceptado-text">
                    <p>
                        Gracias por ser mi todo, y por ser mi valentin un nuevo año. Te amo muchisimo.
                    </p>
                    <p>
                        Este San Valentín y todos los que vengan serán especiales siempre que tu estes a mi lado.
                    </p>
                </div>

                <div className="love-declaration">
                    <div className="love-icon">
                        <img src="/img/ani.jpeg" alt="Ani" loading="lazy" decoding="async" />
                    </div>
                    <p className="love-text">
                        Eres el amor de mi vida y no puedo esperar para seguir creando recuerdos juntos.
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => router.push('/extras')}
                >
                    <ArrowLeft className="inline-block size-5 align-middle" aria-hidden="true" />
                    Volver a Extras
                </button>
            </div>
        </div>
    );
};

export default AceptadoPage;
