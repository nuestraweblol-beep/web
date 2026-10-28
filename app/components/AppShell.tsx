"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/context/AuthContext";
import { getRouteTheme } from "@/lib/routeTheme";
import AuthWrapper from "./AuthWrapper";
import Header from "./header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const theme = getRouteTheme(pathname);

  // Paint the real document background, not only an inner div.
  // This is what removes the white bands on iOS overscroll.
  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === "night" ? "#121019" : "#faf7f3";
    document.body.style.backgroundColor =
      theme === "night" ? "#121019" : "#faf7f3";
  }, [theme]);

  return (
    <AuthProvider>
      <div
        data-theme={theme}
        className="min-h-[100svh] bg-paper text-ink data-[theme=night]:bg-night data-[theme=night]:text-white"
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-soft"
        >
          Saltar al contenido
        </a>

        <AuthWrapper>
          {!isLoginPage && <Header />}
          <main id="contenido" className="min-h-[100svh]">
            {children}
          </main>
        </AuthWrapper>
      </div>
    </AuthProvider>
  );
}
