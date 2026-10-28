import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestro Libro",
  description: "Nuestra historia contada capítulo a capítulo.",
};

export default function LibroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

