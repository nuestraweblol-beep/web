"use client";

import { useState, useEffect } from "react";
import { Mail, ScrollText } from "lucide-react";

interface PhotoFrameProps {
    imageSrc: string;
    rotation: number;
    delay: number;
    letter?: {
        title: string;
        content: string;
    };
    onLetterOpen?: () => void;
}

const PhotoFrame = ({ imageSrc, rotation, delay, letter, onLetterOpen }: PhotoFrameProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const handleFlip = () => {
        if (!letter) return;

        setIsFlipped(!isFlipped);

        // If we are flipping to the back (showing letter), open modal after the flip
        if (!isFlipped && onLetterOpen) {
            setTimeout(() => {
                onLetterOpen();
            }, 600);
        }
    };

    return (
        <div
            role={letter ? "button" : undefined}
            tabIndex={letter ? 0 : undefined}
            aria-label={letter ? `Abrir la carta: ${letter.title}` : undefined}
            className={`group relative block w-full transition-all duration-700 ease-out ${letter ? "cursor-pointer" : "cursor-default"}`}
            style={{
                transform: isVisible
                    ? `scale(1) rotate(${rotation}deg)`
                    : `scale(0) rotate(${rotation}deg)`,
                opacity: isVisible ? 1 : 0,
                perspective: "1000px",
            }}
            onClick={handleFlip}
            onKeyDown={(event) => {
                if (!letter) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleFlip();
                }
            }}
        >
            <div
                className="relative aspect-[3/4] w-full bg-white p-1.5 shadow-lg transition-transform duration-700 sm:p-2"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front Side - Photo */}
                <div className="absolute inset-0 p-1.5 sm:p-2" style={{ backfaceVisibility: "hidden" }}>
                    <div className="relative h-full w-full overflow-hidden bg-gray-100">
                        <img
                            src={imageSrc}
                            alt="Recuerdo de Navidad"
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    {letter && (
                        <div className="absolute bottom-1 right-1.5 rounded-full bg-white/85 p-1 text-rose-500 shadow-sm sm:bottom-1.5 sm:right-2">
                            <Mail className="size-3.5 sm:size-4" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Back Side - Letter Envelope Style */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-double border-red-200 bg-red-50 p-2 text-center sm:border-4 sm:p-4"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                    }}
                >
                    {letter && (
                        <div className="flex flex-col items-center text-rose-800">
                            <ScrollText className="mb-1 size-5 sm:mb-2 sm:size-7" aria-hidden="true" />
                            <span className="font-script text-sm leading-tight sm:text-lg">Para ti</span>
                            <span className="mt-1 font-sans text-[0.6rem] leading-tight text-rose-500/80 sm:mt-2 sm:text-xs">
                                Toca para leer
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoFrame;
