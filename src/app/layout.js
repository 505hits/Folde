import { Inter, Zen_Old_Mincho } from "next/font/google";
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
  title: "FOLDÈ Design | Premium Digital Wedding Invitations Paris & Worldwide",
  description: "Specialist in immersive digital wedding invitations. Elegant, bespoke designs with integrated RSVPs and interactive maps, designed in Paris for celebrations in Provence, the French Riviera, and worldwide. Book your consultation.",
  openGraph: {
    title: "FOLDÈ Design | Premium Digital Wedding Invitations Paris & Worldwide",
    description: "Specialist in immersive digital wedding invitations. Elegant, bespoke designs with integrated RSVPs and interactive maps, designed in Paris for celebrations in Provence, the French Riviera, and worldwide.",
    url: "https://www.foldedesign.com",
    siteName: "FOLDÈ Design",
    images: [
      {
        url: "https://www.foldedesign.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "FOLDÈ Design Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOLDÈ Design | Premium Digital Wedding Invitations Paris & Worldwide",
    description: "Specialist in immersive digital wedding invitations. Elegant, bespoke designs with integrated RSVPs and interactive maps, designed in Paris for celebrations in Provence, the French Riviera, and worldwide.",
    images: ["https://www.foldedesign.com/images/logo.png"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "FOLDÈ Design",
  "image": "https://www.foldedesign.com/images/logo.png",
  "@id": "https://www.foldedesign.com/#website",
  "url": "https://www.foldedesign.com",
  "telephone": "+33100000000",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rue de la Paix",
    "addressLocality": "Paris",
    "postalCode": "75002",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.8690,
    "longitude": 2.3308
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Paris" },
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
    <html lang="en">
      <head>
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
