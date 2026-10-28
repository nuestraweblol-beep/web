import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería",
  description: "Nuestros momentos capturados en fotos y recuerdos.",
};

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

