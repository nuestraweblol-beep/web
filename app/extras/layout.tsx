import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extras",
  description: "Rinconcitos y momentos únicos que guardamos con cariño.",
};

export default function ExtrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

