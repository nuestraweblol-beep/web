'use client';

import React from 'react';
import { X } from 'lucide-react';

type MasonryItem = {
  id: string;
  img: string;
  title?: string;
  url?: string;
  height?: number;
  alt?: string;
};

type AnimateFrom = 'bottom' | 'top' | 'left' | 'right' | 'none';

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: AnimateFrom;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

export default function Masonry({
  items,
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 1.04,
  colorShiftOnHover = false,
}: MasonryProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // One observer for the whole grid instead of one per card.
  React.useEffect(() => {
    const node = rootRef.current;
    if (!node || animateFrom === 'none') return;

    const cards = Array.from(node.querySelectorAll<HTMLElement>('[data-masonry-item]'));
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [animateFrom, items]);

  // Lightbox controls: Escape closes, page scroll is locked while open.
  React.useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
      if (event.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openIndex, items.length]);

  const openItem = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div
        ref={rootRef}
        className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:columns-4 [column-fill:_balance]"
      >
        {items.map((item, index) => {
          const normalizedSrc = item.img?.startsWith('http://')
            ? item.img.replace('http://', 'https://')
            : item.img;

          return (
            <div
              key={item.id}
              data-masonry-item
              className={`group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-surface shadow-soft transition-[opacity,transform] sm:mb-4 ${
                animateFrom === 'none' ? '' : 'masonry-hidden'
              }`}
              style={{ transitionDuration: `${duration}s`, transitionDelay: `${stagger * Math.min(index, 8)}s` }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={item.title ? `Ampliar ${item.title}` : 'Ampliar imagen'}
                className="block w-full cursor-zoom-in"
              >
                <img
                  src={normalizedSrc}
                  alt={item.alt || item.title || `Recuerdo ${index + 1}`}
                  className={`block h-auto w-full object-cover transition-transform duration-500 ${
                    scaleOnHover ? 'group-hover:scale-[var(--hover-scale,1.04)]' : ''
                  } ${colorShiftOnHover ? 'group-hover:saturate-125' : ''}`}
                  style={{
                    '--hover-scale': hoverScale,
                    ...(item.height ? { height: `${item.height}px` } : {}),
                  } as React.CSSProperties}
                  loading="lazy"
                  decoding="async"
                />
              </button>

              {item.title && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10 sm:p-4">
                  <h3 className="line-clamp-2 font-display text-sm font-semibold text-white sm:text-base">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openItem && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={openItem.title || 'Imagen ampliada'}
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Cerrar imagen"
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <figure
            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={
                openItem.img?.startsWith('http://')
                  ? openItem.img.replace('http://', 'https://')
                  : openItem.img
              }
              alt={openItem.alt || openItem.title || 'Imagen ampliada'}
              className="max-h-[78svh] w-auto max-w-full rounded-xl object-contain"
            />
            {openItem.title && (
              <figcaption className="text-center font-display text-sm text-white/80 sm:text-base">
                {openItem.title}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
