"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface NavbarProps {
  brandName?: string;
  links?: { label: string; href: string }[];
}

export default function Navbar({
  brandName = "Nuestra Historia",
  links = [
    { label: "Galería", href: "/galeria" },
    { label: "Fechas", href: "/fechas" },
    { label: "Cartas", href: "/cartas" },
    { label: "Timeline", href: "/timeline" },
    { label: "Extras", href: "/extras" },
    { label: "Nuestra Historia", href: "/libro" },
    { label: "Dashboard", href: "/dashboard" },
  ],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [spotlightStyle, setSpotlightStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set Active Index based on Path
  useEffect(() => {
    const index = links.findIndex((link) =>
      pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
    );
    setActiveIndex(index !== -1 ? index : null);
  }, [pathname, links]);

  // Check if current page has a light background to adjust text color
  const isLightPage = pathname?.startsWith('/galeria') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/extras') || pathname?.startsWith('/aniversario') || pathname?.startsWith('/sueno') || pathname?.startsWith('/libro');
  const textColor = scrolled || isMenuOpen || isLightPage ? "text-slate-800" : "text-white";
  const navTextColor = scrolled || isMenuOpen || isLightPage ? "text-slate-600 hover:text-slate-900" : "text-white/90 hover:text-white";
  const logoBg = isMenuOpen ? "bg-rose-100" : (isLightPage && !scrolled ? "bg-rose-100/50" : "bg-white/20");

  return (
    <>
      {/* Floating Capsule Header */}
      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-4xl`}
      >
        <div
          className={`
            relative flex items-center justify-between px-6 py-3 rounded-full 
            border shadow-2xl backdrop-blur-xl 
            transition-all duration-500
            ${scrolled || isMenuOpen ? "bg-white/80 border-white/40 shadow-rose-900/10" : (isLightPage ? "bg-white/60 border-white/40 shadow-sm" : "bg-white/10 border-white/10 hover:bg-white/20")}
          `}
        >
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className={`p-2 rounded-full ${logoBg} group-hover:bg-rose-100 transition-colors duration-300`}>
              <Heart className={`w-5 h-5 ${isMenuOpen ? "text-rose-500 fill-rose-500" : "text-rose-500 group-hover:fill-rose-500"}`} />
            </div>
            <span className={`font-serif font-bold text-lg tracking-wide ${textColor}`}>
              {brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 relative" ref={navRef}>
            {links.map((link, index) => {
              if (index < 3) {
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`
                      relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10
                      ${activeIndex === index ? "text-rose-600" : navTextColor}
                    `}
                    onMouseEnter={(e) => {
                      setHoveredIndex(index);
                      const target = e.currentTarget;
                      setSpotlightStyle({
                        left: target.offsetLeft,
                        width: target.offsetWidth,
                        opacity: 1
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setSpotlightStyle(prev => ({ ...prev, opacity: 0 }));
                    }}
                  >
                    {link.label}
                    {activeIndex === index && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
                    )}
                  </Link>
                )
              }
              return null
            })}

            {/* "More" Dropdown & User Actions */}
            {(links.length > 3 || user) && (
              <div className="relative group">
                <button
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 flex items-center gap-1
                    ${navTextColor}
                  `}
                >
                  Más
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  {links.slice(3).map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Logout Option */}
                  {user && (
                    <>
                      <div className="h-px bg-gray-100 my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Spotlight Hover Effect */}
            <div
              className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ease-out -z-0 pointer-events-none 
              ${isLightPage && !scrolled ? "bg-slate-200/50" : "bg-white/30"}`}
              style={{
                left: spotlightStyle.left,
                width: spotlightStyle.width,
                opacity: spotlightStyle.opacity
              }}
            />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-colors z-50 
            ${isMenuOpen ? "bg-rose-100 text-rose-600" : (isLightPage && !scrolled ? "bg-white/50 text-slate-800 hover:bg-white/80" : "bg-white/20 text-white hover:bg-white/30")}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0F0F1A] transition-all duration-700 md:hidden flex flex-col items-center justify-center space-y-8 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-200"}`}
      >
        {/* Background Decorations */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[100px] transition-transform duration-1000 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] transition-transform duration-1000 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`} />

        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className={`
                text-4xl font-serif font-bold text-white/90 hover:text-rose-400 transition-all duration-500 transform
                ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
              `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {link.label}
          </Link>
        ))}

        {user && (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className={`
                text-3xl font-serif font-bold text-red-400 hover:text-red-300 transition-all duration-500 transform flex items-center gap-3
                ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
              `}
            style={{ transitionDelay: `${links.length * 100}ms` }}
          >
            Cerrar Sesión
          </button>
        )}

        <div className={`mt-12 flex gap-4 transition-all duration-700 delay-500 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Sparkles className="text-white/30 w-6 h-6 animate-pulse" />
        </div>
      </div>
    </>
  );
}
