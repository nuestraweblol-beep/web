import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Un Sueño Increíble",
  description: "Un momento soñado bajo las estrellas.",
};

export default function SuenoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

