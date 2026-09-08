import { Inter, Zen_Old_Mincho } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
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
  metadataBase: new URL("https://www.folde-wedding.com"),
  title: "FOLDÈ Design | Premium Digital Wedding Invitations",
  description: "Premium bespoke digital wedding invitations with integrated RSVPs, photo galleries, interactive maps, and live guest management. Designed for celebrations worldwide.",
  keywords: ["digital wedding invitations", "premium wedding sites", "bespoke wedding RSVP", "elegant wedding invitations", "destination wedding websites", "FOLDÈ Design"],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "FOLDÈ Design | Premium Digital Wedding Invitations",
    description: "Premium bespoke digital wedding invitations with integrated RSVPs, photo galleries, interactive maps, and live guest management.",
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
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/",
    languages: { en: "/", es: "/es", "x-default": "/" },
  },
  twitter: {
    card: "summary_large_image",
    title: "FOLDÈ Design | Premium Digital Wedding Invitations",
    description: "Premium bespoke digital wedding invitations with integrated RSVPs, photo galleries, interactive maps, and live guest management.",
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

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-folde-locale") === "es" ? "es" : "en";
  return (
    <html lang={locale}>
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
