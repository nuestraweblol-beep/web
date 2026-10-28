'use client';

import React from 'react';
import Link from 'next/link';

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

function getStartTransform(direction: AnimateFrom): string {
  switch (direction) {
    case 'bottom':
      return 'translateY(12px)';
    case 'top':
      return 'translateY(-12px)';
    case 'left':
      return 'translateX(-12px)';
    case 'right':
      return 'translateX(12px)';
    default:
      return 'none';
  }
}

const ImageComponent = ({ item, imgStyles, scaleOnHover, hoverScale, colorShiftOnHover }: { item: MasonryItem, imgStyles: React.CSSProperties, scaleOnHover?: boolean, hoverScale?: number, colorShiftOnHover?: boolean }) => {
  const normalize = (url: string) => url?.startsWith('http://') ? url.replace('http://', 'https://') : url;
  const [src, setSrc] = React.useState<string>(() => normalize(item.img));
  return (
    <div className="relative">
      <img
        src={src}
        alt={item.alt || item.title || `item-${item.id}`}
        className={`w-full h-auto object-cover block ${
          scaleOnHover ? 'group-hover:scale-[var(--hoverScale,0.95)]' : ''
        } ${colorShiftOnHover ? 'group-hover:saturate-150' : ''}`}
        style={{
          ...imgStyles,
          transform: scaleOnHover ? 'translateZ(0)' : undefined,
        }}
        onMouseEnter={(e) => {
          if (scaleOnHover) {
            (e.currentTarget as HTMLImageElement).style.transform = `scale(${hoverScale})`;
          }
        }}
        onMouseLeave={(e) => {
          if (scaleOnHover) {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
          }
        }}
        onError={() => {
          // Reintento con https si por alguna razón llegó http o la primera carga falló
          if (src?.startsWith('http://')) {
            setSrc(src.replace('http://', 'https://'));
          }
        }}
        loading="lazy"
      />
      {item.title && (
        <div className="absolute inset-0 flex items-end p-4 sm:p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <h3 className="text-white text-lg lg:text-xl font-bold tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            {item.title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default function Masonry({
  items,
  ease = 'ease',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
      {items.map((item, index) => {
        const startTransform = getStartTransform(animateFrom);
        const transition = `${duration}s ${ease}`;
        const delay = `${(stagger || 0) * index}s`;

        const cardStyles: React.CSSProperties = {
          opacity: animateFrom === 'none' ? 1 : 0,
          transform: animateFrom === 'none' ? 'none' : startTransform,
          transitionProperty: 'opacity, transform, filter, background-color',
          transitionDuration: transition,
          transitionDelay: delay,
        };

        const imgStyles: React.CSSProperties = {
          height: item.height ? `${item.height}px` : undefined,
          filter: blurToFocus ? 'blur(3px)' : undefined,
          transition: `transform ${transition}, filter ${transition}`,
        };

        return (
          <div
            key={item.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-md group"
            style={cardStyles}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              if (animateFrom !== 'none') {
                el.style.opacity = '1';
                el.style.transform = 'none';
              }
            }}
            onMouseOver={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img && blurToFocus) img.style.filter = 'blur(0px)';
            }}
            onMouseOut={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img && blurToFocus) img.style.filter = 'blur(3px)';
            }}
            ref={(node) => {
              if (!node || animateFrom === 'none') return;
              const observer = new IntersectionObserver(
                (entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      const el = entry.target as HTMLDivElement;
                      el.style.opacity = '1';
                      el.style.transform = 'none';
                      observer.unobserve(el);
                    }
                  });
                },
                { threshold: 0.1 }
              );
              observer.observe(node);
            }}
          >
            {item.url ? (
              <Link href={item.url} target="_blank">
                <ImageComponent item={item} imgStyles={imgStyles} scaleOnHover={scaleOnHover} hoverScale={hoverScale} colorShiftOnHover={colorShiftOnHover} />
              </Link>
            ) : (
              <ImageComponent item={item} imgStyles={imgStyles} scaleOnHover={scaleOnHover} hoverScale={hoverScale} colorShiftOnHover={colorShiftOnHover} />
            )}
          </div>
        );
      })}
    </div>
  );
}