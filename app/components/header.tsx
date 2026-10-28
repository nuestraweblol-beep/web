"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface NavbarProps {
  brandName?: string;
  links?: { label: string; href: string }[];
}

const DEFAULT_LINKS = [
  { label: "Galería", href: "/galeria" },
  { label: "Fechas", href: "/fechas" },
  { label: "Cartas", href: "/cartas" },
  { label: "Canciones", href: "/canciones" },
  { label: "Timeline", href: "/timeline" },
  { label: "Extras", href: "/extras" },
  { label: "Nuestra Historia", href: "/libro" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar({
  brandName = "Nuestra Historia",
  links = DEFAULT_LINKS,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const moreRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`)) ||
    (href !== "/" && pathname === href);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Elevation only when the page moves (passive listener)
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 8;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every floating layer when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  // Lock the page behind the mobile sheet
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  // Escape closes the sheet / dropdown
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      setIsMoreOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Click outside closes the desktop dropdown
  useEffect(() => {
    if (!isMoreOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMoreOpen]);

  const primaryLinks = links.slice(0, 3);
  const moreLinks = links.slice(3);

  return (
    <>
      <header className="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-50 w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2">
        <div
          className={`flex h-14 items-center justify-between gap-2 rounded-full border border-line/80 bg-surface/90 px-3 backdrop-blur-xl transition-shadow duration-300 sm:px-5 ${
            scrolled ? "shadow-soft" : "shadow-none"
          }`}
        >
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2"
            aria-label={`${brandName} — inicio`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft">
              <Heart className="size-4 fill-accent text-accent" aria-hidden="true" />
            </span>
            <span className="truncate font-display text-sm font-semibold tracking-wide text-ink sm:text-base">
              {brandName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Principal">
            {primaryLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-ink-soft hover:bg-accent-soft/60 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                aria-controls="more-menu"
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  moreLinks.some((link) => isActive(link.href))
                    ? "bg-accent-soft text-accent"
                    : "text-ink-soft hover:bg-accent-soft/60 hover:text-ink"
                }`}
              >
                Más
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id="more-menu"
                className={`absolute right-0 top-[calc(100%+0.5rem)] w-52 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-soft transition-all duration-200 ${
                  isMoreOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0"
                }`}
              >
                {moreLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-ink-soft hover:bg-accent-soft/60 hover:text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="my-1 h-px bg-line" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-accent-soft md:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-night px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-offset)+0.5rem)] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Menú móvil" className="flex flex-col">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center justify-between border-b border-white/10 font-display text-2xl transition-colors ${
                  active ? "text-rose-300" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className="size-1.5 rounded-full bg-rose-300"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex min-h-12 items-center gap-2 self-start rounded-full border border-white/15 px-5 text-base font-medium text-rose-200 transition-colors hover:bg-white/5"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          )}
        </nav>

        <p className="mt-auto pt-10 text-center font-display text-sm italic text-white/40">
          Nuestra historia, siempre.
        </p>
      </div>
    </>
  );
}
