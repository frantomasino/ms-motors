import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ms Motors',
  description: 'MS Motors',
  generator: 'Fran Tomasino',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icono-ms-favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
