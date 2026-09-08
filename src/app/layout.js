import { Inter, Zen_Old_Mincho } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";
import { DatabaseProvider } from "@/context/DatabaseContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const zenOldMincho = Zen_Old_Mincho({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata = {
  title: "FOLDÈ Design | Invitaciones digitales de boda premium",
  description: "Invitaciones digitales de boda premium y personalizadas, con RSVP integrado, galerías de fotos, mapas interactivos y gestión de invitados en tiempo real.",
  keywords: ["invitaciones digitales de boda", "sitios web de boda premium", "RSVP de boda personalizado", "invitaciones de boda elegantes", "bodas de destino", "FOLDÈ Design"],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "FOLDÈ Design | Invitaciones digitales de boda premium",
    description: "Invitaciones digitales de boda premium con RSVP integrado, galerías de fotos, mapas interactivos y gestión de invitados.",
    url: "https://www.folde-wedding.com",
    siteName: "FOLDÈ Design",
    images: [
      {
        url: "https://www.folde-wedding.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "FOLDÈ Design Logo"
      }
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOLDÈ Design | Invitaciones digitales de boda premium",
    description: "Invitaciones digitales de boda premium con RSVP integrado, galerías de fotos, mapas interactivos y gestión de invitados.",
    images: ["https://www.folde-wedding.com/images/logo.png"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "FOLDÈ Design",
  "image": "https://www.folde-wedding.com/images/logo.png",
  "@id": "https://www.folde-wedding.com/#website",
  "url": "https://www.folde-wedding.com",
  "priceRange": "$$",
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "France" },
    { "@type": "AdministrativeArea", "name": "Provence" },
    { "@type": "AdministrativeArea", "name": "French Riviera" },
    { "@type": "AdministrativeArea", "name": "Europe" },
    { "@type": "AdministrativeArea", "name": "Worldwide" }
  ],
  "sameAs": [
    "https://www.instagram.com/foldedesign"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G5CB9NQHZL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G5CB9NQHZL');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${zenOldMincho.variable}`}>
        <DatabaseProvider>
          <SiteLayout>{children}</SiteLayout>
        </DatabaseProvider>
      </body>
    </html>
  );
}
