import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.msmotors.com.ar"),
  title: "MS Motors | Autos usados en Quilmes, Buenos Aires",
  description: "Comprá tu próximo auto con confianza. MS Motors ofrece vehículos usados verificados en Quilmes, Buenos Aires. Atención personalizada, permutas y financiación disponible.",
  keywords: "autos usados Quilmes, venta de autos Buenos Aires, MS Motors, comprar auto usado, permuta autos, financiación autos",
  openGraph: {
    title: "MS Motors | Autos usados en Quilmes",
    description: "Vehículos verificados, atención premium y los mejores precios del sur del Gran Buenos Aires.",
    type: "website",
    locale: "es_AR",
    siteName: "MS Motors",
    images: [{ url: "/banner-2.jpg", width: 1200, height: 630, alt: "MS Motors - Autos usados en Quilmes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MS Motors | Autos usados en Quilmes",
    description: "Vehículos verificados, atención premium y los mejores precios del sur del Gran Buenos Aires.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.msmotors.com.ar" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="icon" type="image/png" href="/icono-ms-favicon.png" />
        <meta name="theme-color" content="#0c0e12" />
        <meta name="geo.region" content="AR-B" />
        <meta name="geo.placename" content="Quilmes, Buenos Aires" />
      </head>
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}