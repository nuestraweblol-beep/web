import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primer Aniversario",
  description: "Celebrando nuestro primer año juntos con todo el amor.",
};

export default function AniversarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

