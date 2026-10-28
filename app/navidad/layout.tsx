import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Especial de Navidad",
  description: "Nuestra primera Navidad juntos, llena de magia y amor.",
};

export default function NavidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

