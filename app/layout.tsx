import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { BASE_URL } from "@/lib/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MS Motors | Autos usados en Quilmes, Buenos Aires",
    template: "%s | MS Motors",
  },
  description:
    "Comprá tu próximo auto con confianza. MS Motors ofrece vehículos usados verificados en Quilmes, Buenos Aires. Atención personalizada, permutas y financiación disponible. 5.0★ en Google.",
  keywords: [
    "autos usados Quilmes",
    "venta de autos Buenos Aires",
    "MS Motors",
    "comprar auto usado",
    "permuta autos",
    "financiación autos",
    "autos usados verificados",
    "concesionaria Quilmes",
    "autos usados sur GBA",
    "vehículos usados Buenos Aires",
  ],
  authors: [{ name: "MS Motors", url: BASE_URL }],
  creator: "MS Motors",
  publisher: "MS Motors",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "MS Motors | Autos usados en Quilmes, Buenos Aires",
    description:
      "Vehículos verificados, atención premium y los mejores precios del sur del Gran Buenos Aires. Permutas y financiación disponible.",
    type: "website",
    locale: "es_AR",
    siteName: "MS Motors",
    url: BASE_URL,
    images: [
      {
        url: "/banner-2.jpg",
        width: 1200,
        height: 630,
        alt: "MS Motors - Autos usados en Quilmes, Buenos Aires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MS Motors | Autos usados en Quilmes",
    description:
      "Vehículos verificados, atención premium y los mejores precios del sur del Gran Buenos Aires.",
    images: ["/banner-2.jpg"],
  },
 manifest: "/site.webmanifest",
  category: "automotive",
  verification: {
    google: "UsX8QnChnimUNbESC4SczMi_WvsZlgDMQ8S77rwaguQ",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${BASE_URL}/#organization`,
  name: "MS Motors",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo-ms-motors.png`,
  },
  image: `${BASE_URL}/banner-2.jpg`,
  description:
    "Concesionaria de autos usados en Quilmes, Buenos Aires. Vehículos verificados, permutas y financiación disponible. 5 estrellas en Google.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Quilmes",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.7217,
    longitude: -58.2572,
  },
  telephone: "+54-9-11-5945-6142",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+54-9-11-5945-6142",
    contactType: "sales",
    areaServed: "AR",
    availableLanguage: ["Spanish"],
    contactOption: "TollFree",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "13",
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [
    "https://wa.me/5491159456142",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catálogo de Autos Usados",
    description: "Vehículos usados verificados disponibles en MS Motors, Quilmes",
  },
  knowsAbout: [
    "Venta de autos usados",
    "Permuta de vehículos",
    "Financiación de autos",
    "Autos verificados",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "MS Motors",
  description: "Autos usados verificados en Quilmes, Buenos Aires",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "es-AR",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="icon" type="image/png" href="/icono-ms-favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0c0e12" />
        <meta name="geo.region" content="AR-B" />
        <meta name="geo.placename" content="Quilmes, Buenos Aires" />
        <Script
          id="schema-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="beforeInteractive"
        />
      </head>
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}