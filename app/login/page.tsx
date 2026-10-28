"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Heart, Lock, Mail, Sparkles } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface MemoryItem {
  type: "image" | "quote";
  src?: string;
  alt?: string;
  text?: string;
  subtext?: string;
}

const PHOTO_COLUMNS: MemoryItem[][] = [
  // Columna 1
  [
    { type: "image", src: "/img/login1.jpg", alt: "Recuerdo juntos" },
    { type: "image", src: "/img/lugar.jpeg", alt: "Nuestro lugar especial" },
    {
      type: "quote",
      text: "Amo cada instante a tu lado",
      subtext: "Momentos inolvidables",
    },
    { type: "image", src: "/img/sanvalentin1.jpg", alt: "San Valentín" },
    { type: "image", src: "/img/ani.jpeg", alt: "Primer aniversario" },
  ],
  // Columna 2
  [
    { type: "image", src: "/img/fondo_login.jpg", alt: "Paseo bajo el atardecer" },
    { type: "image", src: "/img/login2.jpg", alt: "Risas compartidas" },
    { type: "image", src: "/img/anillo.jpeg", alt: "Promesa de amor" },
    {
      type: "quote",
      text: "Tú y yo, siempre",
      subtext: "Nuestra pequeña promesa",
    },
    { type: "image", src: "/img/sanvalentin2.jpg", alt: "San Valentín juntos" },
  ],
  // Columna 3
  [
    { type: "image", src: "/img/noche.jpeg", alt: "Noche bajo las estrellas" },
    {
      type: "quote",
      text: "Donde comenzó todo",
      subtext: "El primer capítulo",
    },
    { type: "image", src: "/img/login3.jpg", alt: "Aventuras juntos" },
    { type: "image", src: "/img/vestido.jpeg", alt: "Un día inolvidable" },
    { type: "image", src: "/img/sanvalentin3.jpg", alt: "San Valentín especial" },
  ],
  // Columna 4 (visible en pantallas medianas+)
  [
    { type: "image", src: "/img/sanvalentin4.jpg", alt: "San Valentín" },
    { type: "image", src: "/img/diciembre.jpg", alt: "Diciembre mágico" },
    {
      type: "quote",
      text: "La mejor casualidad de mi vida",
      subtext: "Te amo",
    },
    { type: "image", src: "/img/julio.jpg", alt: "Tardes de julio" },
    { type: "image", src: "/img/febrero.jpg", alt: "Febrero inolvidable" },
  ],
  // Columna 5 (visible en pantallas grandes)
  [
    { type: "image", src: "/img/octubre.jpg", alt: "Octubre juntos" },
    { type: "image", src: "/img/arbol1.jpeg", alt: "Nuestra Navidad" },
    { type: "image", src: "/img/img_carta2.jpg", alt: "Carta de amor" },
    {
      type: "quote",
      text: "Un pequeño universo para dos",
      subtext: "Nuestra Historia",
    },
    { type: "image", src: "/img/mayo.jpg", alt: "Primavera en mayo" },
  ],
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    if (!email || !password) {
      setLoginError("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLoginError("Ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/galeria");
    } catch (error: any) {
      console.error("Login Error:", error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setLoginError("Credenciales incorrectas. Intenta de nuevo.");
      } else if (error.code === "auth/too-many-requests") {
        setLoginError("Demasiados intentos. Espera unos momentos.");
      } else {
        setLoginError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#09080c]">
      {/* ============================================================
          FONDO INFINITO DE RECUERDOS (Animated Photo Wall)
          ============================================================ */}
      <div
        className="pointer-events-none absolute -inset-24 select-none opacity-45 sm:opacity-50"
        aria-hidden="true"
      >
        <div className="flex h-[140%] w-[120%] -translate-x-[10%] -translate-y-[10%] rotate-[-4deg] justify-center gap-4 sm:gap-6">
          {PHOTO_COLUMNS.map((column, colIdx) => {
            // Animación alternada: pares suben, impares bajan
            const isUp = colIdx % 2 === 0;
            const animClass = isUp ? "animate-marquee-up" : "animate-marquee-down";
            const duration = `${48 + colIdx * 7}s`;

            // Ocultar columnas 3 y 4 en pantallas pequeñas para optimizar rendimiento móvil
            const visibilityClass =
              colIdx === 3 ? "hidden sm:flex" : colIdx === 4 ? "hidden lg:flex" : "flex";

            // Duplicar el array para bucle continuo e imperceptible
            const loopedItems = [...column, ...column];

            return (
              <div
                key={colIdx}
                className={`${visibilityClass} w-[190px] shrink-0 flex-col gap-4 sm:w-[230px] sm:gap-6 md:w-[250px] lg:w-[270px] ${animClass}`}
                style={{ "--marquee-duration": duration } as React.CSSProperties}
              >
                {loopedItems.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm"
                  >
                    {item.type === "image" && item.src ? (
                      <Image
                        src={item.src}
                        alt={item.alt || "Recuerdo"}
                        fill
                        sizes="(max-width: 640px) 190px, (max-width: 1024px) 250px, 270px"
                        className="object-cover transition-transform duration-700"
                        priority={colIdx < 2 && itemIdx < 2}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-rose-950/40 via-purple-950/20 to-black/60">
                        <Heart className="mb-3 size-7 fill-rose-400/80 text-rose-400" />
                        <p className="font-display text-base font-semibold italic text-white/90">
                          &ldquo;{item.text}&rdquo;
                        </p>
                        {item.subtext && (
                          <span className="mt-2 text-xs uppercase tracking-wider text-rose-300/70 font-medium">
                            {item.subtext}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          CAPAS DE AMBIENTACIÓN Y GRADIENTES
          ============================================================ */}
      {/* Velo oscuro con viñeta para asegurar legibilidad perfecta */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09080c] via-[#09080c]/65 to-[#09080c]/80 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Luces y resplandores románticos */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 size-[460px] rounded-full bg-rose-600/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 size-[480px] rounded-full bg-purple-900/20 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[380px] rounded-full bg-rose-900/20 blur-[100px]"
        aria-hidden="true"
      />

      {/* ============================================================
          TARJETA DE LOGIN FLOTANTE (Glassmorphism de Lujo)
          ============================================================ */}
      <div className="relative z-20 flex w-full max-w-md items-center justify-center px-4 py-8 sm:px-6">
        <div className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/15 bg-[#121019]/80 p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10">
          {/* Línea de luz superior */}
          <div
            className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-rose-400/60 to-transparent"
            aria-hidden="true"
          />

          {/* Encabezado */}
          <header className="mb-7 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-purple-950/40 shadow-lg shadow-rose-950/40">
                <Heart className="size-6 fill-rose-400 text-rose-400 animate-heartbeat" aria-hidden="true" />
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Nuestra Historia
            </h1>
            <p className="mt-2 text-sm font-light text-white/60 sm:text-base">
              Ingresa a nuestro universo personal de recuerdos.
            </p>
          </header>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="ml-1 block text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35"
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/35 py-3.5 pl-11 pr-4 text-base text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-rose-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-rose-500/15"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/60"
                >
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35"
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/35 py-3.5 pl-11 pr-12 text-base text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-rose-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-rose-500/15"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error si ocurre */}
            {loginError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-center text-sm font-medium text-rose-200 backdrop-blur-sm"
              >
                {loginError}
              </div>
            )}

            {/* Botón de Entrada */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-600/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              {isLoading ? (
                <span
                  className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-label="Ingresando"
                />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>

          {/* Cita o detalle inferior */}
          <footer className="mt-8 text-center">
            <p className="font-display text-xs italic text-white/40">
              &ldquo;Donde cada recuerdo permanece para siempre.&rdquo;
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
