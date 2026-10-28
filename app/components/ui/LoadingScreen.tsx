import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-10 animate-spin text-accent" aria-hidden="true" />
                <p className="animate-pulse text-sm text-ink-muted" role="status">Cargando...</p>
            </div>
        </div>
    );
}
