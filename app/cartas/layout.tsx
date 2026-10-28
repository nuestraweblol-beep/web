import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartas",
  description: "Palabras escritas desde el fondo de nuestro corazón.",
};

export default function CartasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

