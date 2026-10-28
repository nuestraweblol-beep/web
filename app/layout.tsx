"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { HelmetProvider } from "react-helmet-async";
import "./globals.css";
import Header from "./components/header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/lib/context/AuthContext";
import AuthWrapper from "./components/AuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <head>
        <title>Sistema de Login</title>
        <meta
          name="description"
          content="Aplicación de autenticación con interfaz moderna"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HelmetProvider>
          <AuthProvider>
            <AuthWrapper>
              {!isLoginPage && <Header />}
              <main>{children}</main>
            </AuthWrapper>
          </AuthProvider>
        </HelmetProvider>
      </body>
    </html>
  );
}
