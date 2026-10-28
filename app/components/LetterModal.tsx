"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

    if (!mounted || !isOpen || !letter) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#fffdf5] rounded-xl shadow-2xl overflow-hidden animate-reveal border-4 border-double border-amber-500/50">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-700 via-green-800 to-red-700 z-20" />
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600 rotate-45 opacity-10 blur-xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-green-700 rotate-45 opacity-10 blur-xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 text-red-800/70 hover:text-red-900 hover:bg-red-100/50 rounded-full transition-all duration-300"
                    aria-label="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10 overflow-y-auto flex-1 w-full">
                    <div className="text-5xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>💌</div>

                    <h2 className="font-script text-4xl md:text-5xl text-red-800 mb-6 drop-shadow-sm leading-relaxed">
                        {letter.title}
                    </h2>

                    <div className="relative w-full py-8 my-2">
                        {/* Decorative quote marks */}
                        <span className="absolute top-0 left-0 text-6xl text-amber-200/50 font-serif leading-none">“</span>
                        <span className="absolute bottom-0 right-0 text-6xl text-amber-200/50 font-serif leading-none">”</span>

                        <div className="font-display text-gray-700 text-lg md:text-xl leading-relaxed italic px-6 whitespace-pre-line text-left">
                            {letter.content}
                        </div>
                    </div>

                    {letter.videoSrc && (
                        <div className="w-full max-w-2xl mx-auto mb-6 rounded-lg overflow-hidden border-4 border-amber-500/50 shadow-2xl bg-black relative group aspect-video flex-shrink-0">
                            <video
                                src={letter.videoSrc}
                                controls
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}


                </div>
            </div>
        </div>,
        document.body
    );
};

export default LetterModal;
