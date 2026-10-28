"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";

interface LetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    letter: {
        title: string;
        content: string;
        videoSrc?: string;
    } | null;
}

const LetterModal = ({ isOpen, onClose, letter }: LetterModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close with Escape and keep the page behind the modal still.
    useEffect(() => {
        if (!mounted || !isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [mounted, isOpen, onClose]);

    if (!mounted || !isOpen || !letter) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-labelledby="carta-navidad-titulo"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div className="relative flex min-h-full items-start justify-center p-2.5 sm:items-center sm:p-4">
                {/* Modal Card */}
                <div className="relative my-2 flex max-h-[calc(100svh-1.25rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-double border-amber-500/50 bg-[#fffdf5] shadow-2xl animate-reveal sm:my-8 sm:max-h-[90svh] sm:rounded-xl sm:border-4">
                    {/* Decorative Elements */}
                    <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-gradient-to-r from-red-700 via-green-800 to-red-700" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-10 -top-10 size-24 rotate-45 bg-red-600 opacity-10 blur-xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 size-24 rotate-45 bg-green-700 opacity-10 blur-xl" aria-hidden="true" />

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-2 top-2 z-50 grid size-11 place-items-center rounded-full text-red-800/70 transition-colors hover:bg-red-100/60 hover:text-red-900 sm:right-4 sm:top-4"
                        aria-label="Cerrar carta"
                    >
                        <X className="size-6" aria-hidden="true" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 flex w-full flex-1 flex-col items-center overflow-y-auto overscroll-contain p-5 pt-14 text-center sm:p-8 sm:pt-12 md:p-10">
                        <Mail className="mb-4 size-8 text-red-700/80 sm:mb-5 sm:size-10" aria-hidden="true" />

                        <h2
                            id="carta-navidad-titulo"
                            className="mb-4 text-balance font-script text-2xl leading-tight text-red-800 drop-shadow-sm sm:mb-6 sm:text-4xl md:text-5xl"
                        >
                            {letter.title}
                        </h2>

                        <div className="relative my-1 w-full py-5 sm:py-6">
                            {/* Decorative quote marks */}
                            <span className="pointer-events-none absolute left-0 top-0 font-serif text-4xl leading-none text-amber-200/60 sm:text-6xl" aria-hidden="true">
                                &ldquo;
                            </span>
                            <span className="pointer-events-none absolute bottom-0 right-0 font-serif text-4xl leading-none text-amber-200/60 sm:text-6xl" aria-hidden="true">
                                &rdquo;
                            </span>

                            <div className="whitespace-pre-line px-3 text-left font-display text-base italic leading-relaxed text-stone-700 sm:px-6 sm:text-lg md:text-xl">
                                {letter.content}
                            </div>
                        </div>

                        {letter.videoSrc && (
                            <div className="relative mb-4 aspect-video w-full max-w-2xl shrink-0 overflow-hidden rounded-lg border-2 border-amber-500/50 bg-black shadow-xl sm:mb-6 sm:border-4">
                                <video
                                    src={letter.videoSrc}
                                    controls
                                    preload="metadata"
                                    playsInline
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LetterModal;
