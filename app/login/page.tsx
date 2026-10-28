"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setLoginError("Credenciales incorrectas. Intenta de nuevo.");
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError("Demasiados intentos. Espera un momento.");
      } else {
        setLoginError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a] overflow-hidden">
      {/* Background Ambient Gradients (Global) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Left Side - Memory Wall (Desktop 60%) */}
      {/* Keeping the masonry layout user liked but integrating it into the dark/glass theme */}
      <div className="lg:w-[60%] relative h-[400px] lg:h-auto overflow-hidden flex items-center justify-center perspective-1000">

        {/* Floating Particles Overlay */}
        <div className="absolute inset-0 z-10 bg-[url('/img/noise.png')] opacity-[0.03] animate-grain pointer-events-none" />

        {/* Masonry Grid */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl p-8 rotate-[-6deg] lg:scale-110 opacity-80 hover:opacity-100 hover:rotate-0 hover:scale-100 transition-all duration-[1.5s] ease-out-expo">

          {/* Cards with Glass Borders */}
          {/* Item 1 */}
          <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-rose-900/20 border border-white/10 backdrop-blur-sm group transform translate-y-12">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image src="/img/login1.jpg" alt="Recuerdo" fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
          </div>

          {/* Item 2 - Text Card */}
          <div className="relative h-48 lg:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center transform -translate-y-8 group hover:bg-white/10 transition-colors">
            <Heart className="w-10 h-10 text-rose-400 mb-3 drop-shadow-glow animate-heartbeat" />
            <p className="text-white/80 font-serif italic text-center px-4">"Amo nuestros momentos juntos"</p>
          </div>

          {/* Item 3 */}
          <div className="relative h-72 lg:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform translate-y-20">
            <Image src="/img/login2.jpg" alt="Recuerdo" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]" />
          </div>

          {/* Item 4 */}
          <div className="relative h-56 lg:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-purple-500/10 backdrop-blur-md flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-700">
            <div className="text-center">
              <span className="text-5xl drop-shadow-lg">✨</span>
              <h3 className="font-serif font-bold text-white/90 mt-4 text-2xl tracking-widest">D&M</h3>
            </div>
          </div>

          {/* Item 5 */}
          <div className="relative h-60 lg:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform -translate-y-12 hover:-translate-y-16 transition-transform duration-700">
            <Image src="/img/login3.jpg" alt="Recuerdo" fill className="object-cover hover:scale-110 transition-transform duration-[2s]" />
          </div>
        </div>
      </div>

      {/* Right Side - Glass Login Form (Desktop 40%) */}
      <div className="lg:w-[40%] relative z-20 flex flex-col justify-center px-6 py-12 lg:px-20">

        {/* Glass Card Container */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-black/50 overflow-hidden group">

          {/* Inner Glow Effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-rose-500/30 rounded-full blur-3xl group-hover:bg-rose-500/40 transition-colors duration-1000" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-colors duration-1000" />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-white/10 mb-6 shadow-glow">
                <Sparkles className="w-6 h-6 text-rose-300 animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-3 tracking-tight">
                Bienvenido
              </h1>
              <p className="text-white/40 text-lg font-light">
                Ingresa a nuestro universo personal.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group/input">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1 group-focus-within/input:text-rose-400 transition-colors">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 focus:bg-white/10 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all duration-300 outline-none text-white placeholder-white/20 font-medium"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2 group/input">
                <div className="flex justify-between ml-1">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider group-focus-within/input:text-rose-400 transition-colors">Contraseña</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 focus:bg-white/10 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all duration-300 outline-none text-white placeholder-white/20 font-medium tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-medium backdrop-blur-md animate-shake">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-rose-900/20 hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 blur-md" />

                <div className="relative flex items-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              <div className="text-center pt-2">
                <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors border-b border-transparent hover:border-white/30 pb-0.5">
                  ¿Olvidaste la clave?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
