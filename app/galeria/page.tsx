'use client';

import { useState, useEffect } from 'react';
import Masonry from './Masonry';
import { Loader, AlertTriangle } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 animate-spin text-rose-500" />
          <p className="mt-4 text-lg text-gray-600">Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="flex flex-col items-center text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-red-700">Ocurrió un error</h2>
          <p className="mt-2 text-gray-600">No se pudo cargar la galería. Por favor, inténtalo de nuevo más tarde.</p>
          <p className="mt-2 text-sm text-gray-500">Detalle: {error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4 font-serif">
          Nuestra Galería
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto italic font-light">
          "Quiero atesorar cada momento especial por siempre."
        </p>
      </div>

      <Masonry
        items={items}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={1.05}
        blurToFocus={false}
        colorShiftOnHover={false}
      />
    </main>
  );
}