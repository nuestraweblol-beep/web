'use client';

import { useState, useEffect } from 'react';
import Masonry from './Masonry';
import { Loader, AlertTriangle, ImageOff } from 'lucide-react';
import { galeriaService, GaleriaItem } from '@/lib/services/galeriaService';

export default function GaleriaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await galeriaService.getAll();

      const formattedItems = data.map((item: GaleriaItem) => ({
        id: item.id,
        img: item.imageUrl,
        title: item.titulo,
        alt: item.titulo,
      }));

      setItems(formattedItems);
      setError(null);
    } catch (e: any) {
      console.error('Error fetching gallery:', e);
      setError(e.message || 'Error al cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-paper pt-[var(--nav-offset)]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="size-10 animate-spin text-accent" aria-hidden="true" />
          <p className="text-sm text-ink-muted">Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-paper px-4 pt-[var(--nav-offset)]">
        <div className="flex max-w-sm flex-col items-center rounded-3xl border border-line bg-surface p-6 text-center shadow-soft">
          <AlertTriangle className="size-10 text-amber-500" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">No se pudo cargar la galería</h2>
          <p className="mt-2 text-sm text-ink-muted">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-5 min-h-11 rounded-full bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[100svh] bg-paper pb-24 pt-[var(--nav-offset)] text-ink">
      <div className="page-container">
        <header className="mb-8 pt-8 text-center sm:mb-12 sm:pt-12">
          <h1 className="text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
            Nuestra Galería
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-display text-base italic text-ink-muted sm:text-lg">
            &ldquo;Quiero atesorar cada momento especial por siempre.&rdquo;
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
            <ImageOff className="mx-auto mb-4 size-9 text-ink-muted/50" aria-hidden="true" />
            <p className="font-display text-xl text-ink">La galería está vacía</p>
            <p className="mt-2 text-sm text-ink-muted">
              Los recuerdos aparecerán aquí cuando se suban las primeras fotos.
            </p>
          </div>
        ) : (
          <Masonry
            items={items}
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={1.04}
            colorShiftOnHover={false}
          />
        )}
      </div>
    </main>
  );
}
