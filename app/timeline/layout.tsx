import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Línea del Tiempo",
  description: "El recorrido paso a paso de nuestro camino juntos.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

