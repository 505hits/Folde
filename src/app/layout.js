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
  title: "FOLDÈ Design | Premium Digital Wedding Invitations",
  description: "Discover FOLDÈ Design, specialist in immersive digital wedding invitations. An elegant, modern, and interactive experience to elevate your big day. Book your personalized consultation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${zenOldMincho.variable}`}>
        <DatabaseProvider>
          <SiteLayout>{children}</SiteLayout>
        </DatabaseProvider>
      </body>
    </html>
  );
}
