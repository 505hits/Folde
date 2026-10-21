import { Inter, Zen_Old_Mincho } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";
import { SITE_URL } from "@/lib/routes.mjs";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { DatabaseProvider } from "@/context/DatabaseContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const zenOldMincho = Zen_Old_Mincho({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "FOLDÈ Wedding | Digital Wedding Invitations", template: "%s" },
  description: "Elegant digital wedding invitations with online RSVP, photo galleries, maps and live guest management.",
  icons: { icon: "/icon.png" },
  openGraph: {
    siteName: "FOLDÈ Wedding",
    images: [{ url: `${SITE_URL}/images/logo.png`, alt: "FOLDÈ Wedding" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-folde-locale");
  const locale = requestedLocale === "es" || requestedLocale === "fr" ? requestedLocale : "en";
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
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
