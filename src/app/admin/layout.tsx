import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de Administración - Leterago',
  description: 'Gestión de categorías, técnicas y usuarios del sistema',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}