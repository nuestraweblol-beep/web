import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "San Valentín",
  description: "Celebrando nuestro amor en una fecha muy especial.",
};

export default function SanValentinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

