import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de administración de recuerdos y momentos.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
