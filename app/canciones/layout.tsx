import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canciones",
  description: "La banda sonora de nuestra historia juntos.",
};

export default function CancionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

