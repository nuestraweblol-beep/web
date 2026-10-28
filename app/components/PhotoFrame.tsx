
"use client";

import { useState, useEffect } from "react";

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
        if (letter) {
            setIsFlipped(!isFlipped);

            // If we are flipping to the back (showing letter), open modal after delay
            if (!isFlipped && onLetterOpen) {
                setTimeout(() => {
                    onLetterOpen();
                    // Optional: Auto-flip back after modal opens? 
                    // Let's keep it flipped as an indicator it was read.
                }, 600); // Wait for flip animation
            }
        }
    };

    return (
        <div
            className={`relative cursor-pointer group transition-all duration-700 ease-out`}
            style={{
                transform: isVisible
                    ? `scale(1) rotate(${rotation}deg)`
                    : `scale(0) rotate(${rotation}deg)`,
                opacity: isVisible ? 1 : 0,
                perspective: "1000px"
            }}
            onClick={handleFlip}
        >
            <div
                className="relative w-full aspect-[3/4] bg-white p-2 shadow-lg transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
            >
                {/* Front Side - Photo */}
                <div
                    className="absolute inset-0 p-2"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="w-full h-[85%] relative overflow-hidden bg-gray-100">
                        <img
                            src={imageSrc}
                            alt="Christmas Memory"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {letter && (
                        <div className="absolute bottom-1 right-2 text-rose-500 animate-pulse">
                            <span className="text-sm">💌</span>
                        </div>
                    )}
                </div>

                {/* Back Side - Letter Envelope Style */}
                <div
                    className="absolute inset-0 bg-red-50 p-4 flex flex-col items-center justify-center text-center border-4 border-double border-red-200"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden"
                    }}
                >
                    {letter && (
                        <div className="flex flex-col items-center text-rose-800">
                            <span className="text-4xl mb-2">📜</span>
                            <span className="font-script text-lg">Para Ti</span>
                            <span className="text-xs text-rose-500 mt-2 font-sans opacity-75">Click para leer</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoFrame;
