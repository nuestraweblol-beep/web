import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fechas Especiales",
  description: "Días que marcaron un antes y un después en nuestra historia.",
};

export default function FechasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

