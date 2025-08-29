import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // ← Esta línea DEBE existir

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Leterago - Sistema de Gestión de Seguridad',
  description: 'Sistema de gestión de técnicas y tácticas de ciberseguridad similar a MITRE ATT&CK',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
